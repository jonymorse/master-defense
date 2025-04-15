# Integrating Gesture Control with Existing Presentations

This document explains how to add gesture control capabilities to existing LSU presentations.

## Option 1: Using the Standalone Version

The simplest way to add gesture control is to use the standalone version:

1. Keep your existing presentation files untouched
2. Use the `gesture-control/index.html` file instead of your regular `index.html`
3. It will automatically load your content from the original location

## Option 2: Integrating into Existing Presentations

If you want to modify your existing presentation to include gesture control:

### Step 1: Add MediaPipe Scripts

Add the MediaPipe script dependencies to your `index.html` file:

```html
<!-- Add these before your closing </body> tag -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></script>
```

### Step 2: Add Gesture Control Script

Copy the `gesture-control.js` file to your presentation directory and reference it in your HTML:

```html
<!-- Add this after loading your original slide scripts -->
<script src="gesture-control.js"></script>
```

### Step 3: Add UI Elements

Add these UI elements to your HTML:

```html
<!-- Add gesture control toggle button -->
<button class="gesture-toggle" id="gesture-toggle">Enable Gesture Control</button>

<!-- Add gesture indicator -->
<div class="gesture-indicator" id="gesture-indicator"></div>
```

### Step 4: Add Required CSS

Add these styles to your CSS file or in a `<style>` tag:

```css
/* Gesture control styles */
.gesture-indicator {
    position: fixed;
    left: 20px;
    bottom: 20px;
    padding: 10px;
    background-color: rgba(70, 29, 124, 0.7);
    color: white;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    z-index: 1002;
    display: none;
}

.webcam-container {
    position: fixed;
    right: 10px;
    bottom: 10px;
    width: 160px;
    height: 120px;
    border: 2px solid rgba(70, 29, 124, 0.7);
    border-radius: 5px;
    overflow: hidden;
    z-index: 1000;
}

.gesture-toggle {
    position: fixed;
    right: 10px;
    top: 10px;
    padding: 10px 15px;
    background-color: rgba(70, 29, 124, 0.7);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1003;
    font-family: Arial, sans-serif;
}

.gesture-toggle:hover {
    background-color: rgba(70, 29, 124, 1);
}
```

### Step 5: Add Toggle Button Functionality

Add this JavaScript to initialize the toggle button:

```javascript
// Add this after your other scripts
document.addEventListener('DOMContentLoaded', function() {
    // Add toggle functionality for gesture control
    document.getElementById('gesture-toggle').addEventListener('click', function() {
        const button = document.getElementById('gesture-toggle');
        
        if (button.textContent === 'Enable Gesture Control') {
            // Initialize gesture control
            if (typeof initGestureControl === 'function') {
                initGestureControl();
                button.textContent = 'Disable Gesture Control';
            } else {
                alert('Gesture control script not loaded correctly. Please refresh the page.');
            }
        } else {
            // Reload the page to disable gesture control
            location.reload();
        }
    });
});
```

## Customizing Gesture Recognition

If you want to customize the gesture recognition behavior:

1. Open `gesture-control.js`
2. Modify the `config` object at the top:

```javascript
const config = {
    // Gesture detection settings
    minDetectionConfidence: 0.7, // Increase for more accuracy, decrease for better detection
    minTrackingConfidence: 0.7,
    
    // Gesture definitions (in milliseconds)
    gestureHoldTime: 500, // How long to hold a gesture
    
    // Swipe gesture settings
    swipeThreshold: 0.1, // Sensitivity (lower = more sensitive)
    swipeTimeout: 300,   // Time to complete a swipe
    
    // Debug mode (shows hand tracking)
    debug: true
};
```

## Adding New Gestures

To add new types of gestures, modify the `processGestures()` function in `gesture-control.js`. 

For example, to add a "hold" gesture for pausing:

```javascript
// Inside processGestures function
// Check for hold gesture (hand stays in same position)
if (movementMagnitude < 0.01 && currentTime - gestureStartTime > 1000) {
    // Detected hold gesture
    gestureDirection = 'hold';
    showGestureIndicator('✋ Pause/Resume');
    togglePause(); // Implement this function
    resetGestureState();
}
```

## Troubleshooting

1. **Scripts Not Loading**: Check browser console for errors
2. **Permission Issues**: Make sure your site has HTTPS or is on localhost
3. **Gesture Not Detected**: Adjust the `swipeThreshold` value in the config
4. **Performance Issues**: Set `debug: false` to reduce rendering work

---

For additional help, refer to the MediaPipe documentation or contact the development team.
