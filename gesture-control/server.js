const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the gesture-control directory
app.use(express.static(path.join(__dirname)));

// Serve static files from the lsu_presentation directory
app.use('/lsu_presentation', express.static(path.join(__dirname, '../lsu_presentation')));

// Serve PNG files from the parent directory
app.use('/PNG Files', express.static(path.join(__dirname, '../PNG Files')));

// Store current presentation state
let currentSlide = 0;
let clientCount = 0;

// Handle socket connections
io.on('connection', (socket) => {
  clientCount++;
  console.log(`New client connected. Total clients: ${clientCount}`);
  
  // Send current slide to new clients
  socket.emit('slideChange', { slideIndex: currentSlide });
  
  // Listen for presenter slide changes
  socket.on('changeSlide', (data) => {
    console.log(`Slide changed to ${data.slideIndex + 1}`);
    currentSlide = data.slideIndex;
    // Broadcast to all clients except sender
    socket.broadcast.emit('slideChange', { slideIndex: currentSlide });
  });

  // Listen for video events
  socket.on('videoEvent', (data) => {
    console.log(`Video event: ${data.action}`);
    // Broadcast to all clients except sender
    socket.broadcast.emit('videoEvent', data);
  });

  // Listen for presenter connection
  socket.on('presenterConnected', () => {
    console.log('Presenter connected');
    socket.broadcast.emit('presenterStatus', { connected: true });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    clientCount--;
    console.log(`Client disconnected. Remaining clients: ${clientCount}`);
  });
});

// Special routes for presenter and audience views
app.get('/presenter', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/audience', (req, res) => {
  res.sendFile(path.join(__dirname, 'audience.html'));
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Presenter view: http://localhost:${PORT}/presenter`);
  console.log(`Audience view: http://localhost:${PORT}/audience`);
});