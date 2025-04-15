// Gesture Control for LSU Presentation
// Uses MediaPipe Hands for gesture recognition

// Configuration
const config = {
    // Gesture detection settings
    minDetectionConfidence: 0.5,  // Reduced from 0.7 for more lenient detection
    minTrackingConfidence: 0.5,   // Reduced from 0.7 for better tracking
    
    // Gesture definitions (in milliseconds)
    gestureHoldTime: 500,
    
    // Swipe gesture settings
    swipeThreshold: 0.05,  // Reduced from 0.1 for more sensitive detection
    swipeTimeout: 500,     // Increased from 300 for slower gestures
    
    // Hold gesture settings
    holdThreshold: 0.02, // Maximum movement to be considered a hold
    holdTime: 1000,      // Time to hold in milliseconds
    
    // Debug mode
    debug: true,
    
    // Enable/disable specific gestures
    enableSwipeLeft: true,
    enableSwipeRight: true,
    enableSwipeUp: false,
    enableSwipeDown: false,
    enableHold: false
};

// Track hand positions and movements
let handLandmarks = null;
let lastHandX = 0;
let lastHandY = 0;
let lastHandTime = 0;
let gestureInProgress = false;
let gestureStartTime = 0;
let gestureDirection = null;
let videoElement = null;
let canvasElement = null;
let canvasCtx = null;
let gestureIndicator = null;
let fingerCount = 0;
let startedInLeftHalf = null;  // Track which half of the screen the hand started in

// Initialize the gesture control system
function initGestureControl() {
    console.log('Initializing Gesture Control System...');
    
    // Create debug info panel if debug mode is enabled
    if (config.debug) {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.position = 'absolute';
        debugPanel.style.left = '20px';
        debugPanel.style.top = '20px';
        debugPanel.style.padding = '10px';
        debugPanel.style.background = 'rgba(0, 0, 0, 0.7)';
        debugPanel.style.color = 'white';
        debugPanel.style.borderRadius = '5px';
        debugPanel.style.fontFamily = 'monospace';
        debugPanel.style.fontSize = '12px';
        debugPanel.style.zIndex = '1003';
        
        debugPanel.innerHTML = `
            <div>Gesture Debug Information</div>
            <div id="debug-info">Movement: 0.000, Time: 0ms</div>
            <div id="finger-count">Fingers: 0</div>
        `;
        
        document.body.appendChild(debugPanel);
    }
    
    // Create container for webcam and canvas
    const cameraContainer = document.createElement('div');
    cameraContainer.style.position = 'absolute';
    cameraContainer.style.right = '10px';
    cameraContainer.style.bottom = '70px'; // Positioned higher to sit above the footer
    cameraContainer.style.width = '220px'; // Larger size for better visibility
    cameraContainer.style.height = '165px';
    cameraContainer.style.zIndex = '1000';
    cameraContainer.style.border = '2px solid rgba(70, 29, 124, 0.7)';
    cameraContainer.style.borderRadius = '8px';
    cameraContainer.style.overflow = 'hidden';
    cameraContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    document.body.appendChild(cameraContainer);
    
    // Create and configure video element for webcam
    videoElement = document.createElement('video');
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.style.objectFit = 'cover';
    videoElement.style.transform = 'scaleX(-1)'; // Mirror the video
    cameraContainer.appendChild(videoElement);
    
    // Create and configure canvas for visualization
    canvasElement = document.createElement('canvas');
    canvasElement.style.position = 'absolute';
    canvasElement.style.top = '0';
    canvasElement.style.left = '0';
    canvasElement.style.width = '100%';
    canvasElement.style.height = '100%';
    canvasElement.style.zIndex = '1001';
    cameraContainer.appendChild(canvasElement);
    
    // Add hint text overlay
    const hintOverlay = document.createElement('div');
    hintOverlay.style.position = 'absolute';
    hintOverlay.style.top = '5px';
    hintOverlay.style.left = '0';
    hintOverlay.style.width = '100%';
    hintOverlay.style.textAlign = 'center';
    hintOverlay.style.color = 'white';
    hintOverlay.style.fontSize = '12px';
    hintOverlay.style.padding = '2px';
    hintOverlay.style.backgroundColor = 'rgba(70, 29, 124, 0.5)';
    hintOverlay.style.zIndex = '1002';
    hintOverlay.innerHTML = 'Move hand across center line';
    cameraContainer.appendChild(hintOverlay);
    canvasCtx = canvasElement.getContext('2d');
    
    // Create gesture indicator element
    gestureIndicator = document.createElement('div');
    gestureIndicator.style.position = 'absolute';
    gestureIndicator.style.left = '20px';
    gestureIndicator.style.bottom = '20px';
    gestureIndicator.style.padding = '10px';
    gestureIndicator.style.background = 'rgba(0, 0, 0, 0.5)';
    gestureIndicator.style.color = 'white';
    gestureIndicator.style.borderRadius = '5px';
    gestureIndicator.style.fontFamily = 'Arial, sans-serif';
    gestureIndicator.style.zIndex = '1002';
    gestureIndicator.style.display = 'none';
    document.body.appendChild(gestureIndicator);
    
    // Initialize MediaPipe Hands
    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });
    
    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: config.minDetectionConfidence,
        minTrackingConfidence: config.minTrackingConfidence
    });
    
    hands.onResults(onHandResults);
    
    // Setup camera
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 320,
        height: 240
    });
    
    camera.start()
        .then(() => {
            console.log('Camera started successfully');
            // Resize canvas to match video dimensions
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
        })
        .catch(error => {
            console.error('Error starting camera:', error);
            showPermissionError();
        });
    
    // Show instructions on startup
    showInstructions();
}

// Process hand tracking results
function onHandResults(results) {
    // Clear canvas
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // If we have a hand detected
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        handLandmarks = results.multiHandLandmarks[0];
        
        // Draw hand landmarks for visualization
        drawHandLandmarks();
        
        // Process gestures
        processGestures();
    } else {
        handLandmarks = null;
        resetGestureState();
    }
}

// Draw hand landmarks for visualization
function drawHandLandmarks() {
    if (!handLandmarks || !config.debug) return;
    
    // Draw screen divider to show the center line
    canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    canvasCtx.fillRect(canvasElement.width / 2 - 1, 0, 2, canvasElement.height);
    
    // Draw which half is active based on hand position
    const isInLeftHalf = handLandmarks[8].x < 0.5;
    if (isInLeftHalf) {
        // Highlight left half
        canvasCtx.fillStyle = 'rgba(253, 208, 35, 0.1)'; // LSU gold with transparency
        canvasCtx.fillRect(0, 0, canvasElement.width / 2, canvasElement.height);
    } else {
        // Highlight right half
        canvasCtx.fillStyle = 'rgba(253, 208, 35, 0.1)'; // LSU gold with transparency
        canvasCtx.fillRect(canvasElement.width / 2, 0, canvasElement.width / 2, canvasElement.height);
    }
    
    // Draw hand connections
    canvasCtx.fillStyle = '#00FF00';
    canvasCtx.strokeStyle = '#00FF00';
    canvasCtx.lineWidth = 2;
    
    // Draw landmarks
    for (const landmark of handLandmarks) {
        const normalizedX = landmark.x * canvasElement.width;
        const normalizedY = landmark.y * canvasElement.height;
        
        canvasCtx.beginPath();
        canvasCtx.arc(normalizedX, normalizedY, 5, 0, 2 * Math.PI);
        canvasCtx.fill();
    }
    
    // Draw palm
    canvasCtx.beginPath();
    canvasCtx.moveTo(
        handLandmarks[0].x * canvasElement.width,
        handLandmarks[0].y * canvasElement.height
    );
    
    for (const connection of HAND_CONNECTIONS) {
        canvasCtx.moveTo(
            handLandmarks[connection[0]].x * canvasElement.width,
            handLandmarks[connection[0]].y * canvasElement.height
        );
        canvasCtx.lineTo(
            handLandmarks[connection[1]].x * canvasElement.width,
            handLandmarks[connection[1]].y * canvasElement.height
        );
    }
    
    canvasCtx.stroke();
    
    // Draw index finger tip with a different color to highlight the tracking point
    const indexTip = handLandmarks[8];
    canvasCtx.fillStyle = '#FF0000';
    canvasCtx.beginPath();
    canvasCtx.arc(
        indexTip.x * canvasElement.width,
        indexTip.y * canvasElement.height,
        8, 0, 2 * Math.PI
    );
    canvasCtx.fill();
}

// Process hand gestures
function processGestures() {
    if (!handLandmarks) return;
    
    // Get index finger tip position (landmark 8)
    const indexTip = handLandmarks[8];
    const currentX = indexTip.x;
    const currentY = indexTip.y;
    const currentTime = Date.now();
    
    // Define screen halves
    const leftHalf = 0.5;  // Center of screen
    
    // Debug information if enabled
    if (config.debug) {
        const debugInfoElement = document.getElementById('debug-info');
        if (debugInfoElement) {
            const screenHalf = currentX < leftHalf ? "Left Half" : "Right Half";
            debugInfoElement.textContent = `Position: ${currentX.toFixed(3)}, ` +
                                         `Screen: ${screenHalf}, ` +
                                         `Last position: ${lastHandX.toFixed(3)}`;
        }
    }
    
    // First-time detection
    if (!gestureInProgress) {
        gestureInProgress = true;
        gestureStartTime = currentTime;
        lastHandX = currentX;
        lastHandY = currentY;
        lastHandTime = currentTime;
        
        // Remember which half of the screen the hand started in
        startedInLeftHalf = currentX < leftHalf;
        return;
    }
    
    // Calculate time since last update
    const deltaTime = currentTime - lastHandTime;
    
    // Detect crossing from one side of screen to another
    const currentlyInLeftHalf = currentX < leftHalf;
    const wasInLeftHalf = lastHandX < leftHalf;
    
    // Check if hand crossed from left to right half
    if (!currentlyInLeftHalf && wasInLeftHalf && config.enableSwipeRight) {
        // Hand moved from left half to right half - Right swipe
        gestureDirection = 'right';
        showGestureIndicator('➡️ Next Slide');
        showNextSlide();
        resetGestureState();
    }
    // Check if hand crossed from right to left half
    else if (currentlyInLeftHalf && !wasInLeftHalf && config.enableSwipeLeft) {
        // Hand moved from right half to left half - Left swipe
        gestureDirection = 'left';
        showGestureIndicator('⬅️ Previous Slide');
        showPreviousSlide();
        resetGestureState();
    }
    // If the hand is stable in one half, check for hold gesture
    else if (config.enableHold && 
             Math.abs(currentX - lastHandX) < config.holdThreshold && 
             Math.abs(currentY - lastHandY) < config.holdThreshold && 
             currentTime - gestureStartTime > config.holdTime) {
        // Hold gesture detected
        gestureDirection = 'hold';
        showGestureIndicator('✋ Hold Gesture');
        // You can trigger any action here for the hold gesture
        resetGestureState();
    }
    
    // Update last position and time
    lastHandX = currentX;
    lastHandY = currentY;
    lastHandTime = currentTime;
    
    // Check if gesture has timed out without crossing the center
    if (currentTime - gestureStartTime > 2000) {
        resetGestureState();
    }
    
    // Check for finger count gestures (optional enhancement)
    detectFingerCountGestures();
}

// Reset gesture tracking state
function resetGestureState() {
    gestureInProgress = false;
    gestureDirection = null;
    startedInLeftHalf = null;
}

// Detect how many fingers are extended
function detectFingerCountGestures() {
    if (!handLandmarks) return;
    
    // Detect extended fingers based on the angles between joints
    // Fingers are considered extended if they're straighter than a threshold
    
    // We'll use a simple heuristic approach for this demo:
    // Compare fingertip positions (landmarks 8, 12, 16, 20) with palm position (landmark 0)
    
    const palm = handLandmarks[0];
    const wrist = handLandmarks[0]; // Using palm as approximate wrist position
    
    // For each finger, check if the fingertip is higher than the base joint (relative to the wrist)
    const indexExtended = isFingerExtended(handLandmarks[8], handLandmarks[5], wrist);
    const middleExtended = isFingerExtended(handLandmarks[12], handLandmarks[9], wrist);
    const ringExtended = isFingerExtended(handLandmarks[16], handLandmarks[13], wrist);
    const pinkyExtended = isFingerExtended(handLandmarks[20], handLandmarks[17], wrist);
    
    // Thumb is special case due to its different orientation
    const thumbExtended = isThumbExtended(handLandmarks[4], handLandmarks[2], wrist);
    
    // Count extended fingers
    fingerCount = (thumbExtended ? 1 : 0) + 
                 (indexExtended ? 1 : 0) + 
                 (middleExtended ? 1 : 0) + 
                 (ringExtended ? 1 : 0) + 
                 (pinkyExtended ? 1 : 0);
    
    // Update debug info if available
    if (config.debug) {
        const fingerCountElement = document.getElementById('finger-count');
        if (fingerCountElement) {
            fingerCountElement.textContent = `Fingers: ${fingerCount}`;
        }
    }
}

// Check if a finger is extended based on its joints' positions
function isFingerExtended(tip, base, wrist) {
    // Simple approach: finger is extended if the tip is further from the wrist than the base
    // This is a simplification - a more robust approach would use angles between joints
    
    const tipToWristDist = distanceBetweenPoints(tip, wrist);
    const baseToWristDist = distanceBetweenPoints(base, wrist);
    
    return tipToWristDist > baseToWristDist * 1.2; // Add a threshold factor
}

// Special case for thumb due to its different orientation
function isThumbExtended(tip, joint, wrist) {
    // For thumb, check if it's pointing away from the palm
    const tipToWristDist = distanceBetweenPoints(tip, wrist);
    const jointToWristDist = distanceBetweenPoints(joint, wrist);
    
    return tipToWristDist > jointToWristDist * 1.2;
}

// Calculate distance between two points in 3D space
function distanceBetweenPoints(a, b) {
    return Math.sqrt(
        Math.pow(a.x - b.x, 2) + 
        Math.pow(a.y - b.y, 2) + 
        Math.pow(a.z - b.z, 2)
    );
}

// Show gesture indicator with feedback
function showGestureIndicator(text) {
    if (!gestureIndicator) return;
    
    gestureIndicator.textContent = text;
    gestureIndicator.style.display = 'block';
    gestureIndicator.style.fontSize = '24px'; // Larger text
    gestureIndicator.style.padding = '15px 20px'; // More padding
    
    // Add a subtle animation
    gestureIndicator.style.animation = 'none';
    setTimeout(() => {
        gestureIndicator.style.animation = 'pulse 0.5s';
    }, 10);
    
    // Hide indicator after 3 seconds (increased from 2)
    setTimeout(() => {
        gestureIndicator.style.display = 'none';
    }, 3000);
}

// Show instructions modal
function showInstructions() {
    const instructionsModal = document.createElement('div');
    instructionsModal.style.position = 'fixed';
    instructionsModal.style.top = '0';
    instructionsModal.style.left = '0';
    instructionsModal.style.width = '100%';
    instructionsModal.style.height = '100%';
    instructionsModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    instructionsModal.style.display = 'flex';
    instructionsModal.style.flexDirection = 'column';
    instructionsModal.style.justifyContent = 'center';
    instructionsModal.style.alignItems = 'center';
    instructionsModal.style.color = 'white';
    instructionsModal.style.fontFamily = 'Arial, sans-serif';
    instructionsModal.style.zIndex = '2000';
    instructionsModal.style.padding = '20px';
    instructionsModal.style.boxSizing = 'border-box';
    
    instructionsModal.innerHTML = `
        <h2>Gesture Control Enabled</h2>
        <p>Use the following hand gestures to control the presentation:</p>
        <div style="background-color: rgba(70, 29, 124, 0.7); padding: 20px; border-radius: 10px; margin: 15px 0; max-width: 600px;">
            <h3 style="margin-top: 0; color: #FDD023;">Simple Gesture Controls:</h3>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin: 10px 0;">➡️ <strong>Next slide</strong>: Move your hand from the left side to the right side of the screen</li>
                <li style="margin: 10px 0;">⬅️ <strong>Previous slide</strong>: Move your hand from the right side to the left side of the screen</li>
            </ul>
            <p style="margin-top: 15px;">For best results:</p>
            <ul style="text-align: left;">
                <li>Simply move your hand across the center of the screen</li>
                <li>Keep your palm facing the camera</li>
                <li>Position your hand so it's clearly visible</li>
                <li>No need for fast movements - just cross from one side to the other</li>
                <li>Make sure your lighting is good so the camera can see your hand</li>
            </ul>
        </div>
        <button id="startGestureBtn" style="padding: 15px 25px; margin-top: 20px; cursor: pointer; background-color: #FDD023; color: #461D7C; border: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
            Start Using Gesture Control
        </button>
    `;
    
    document.body.appendChild(instructionsModal);
    
    // Add event listener to close modal and start using gesture control
    document.getElementById('startGestureBtn').addEventListener('click', () => {
        document.body.removeChild(instructionsModal);
    });
}

// Show error when camera permission is denied
function showPermissionError() {
    const errorModal = document.createElement('div');
    errorModal.style.position = 'fixed';
    errorModal.style.top = '0';
    errorModal.style.left = '0';
    errorModal.style.width = '100%';
    errorModal.style.height = '100%';
    errorModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    errorModal.style.display = 'flex';
    errorModal.style.flexDirection = 'column';
    errorModal.style.justifyContent = 'center';
    errorModal.style.alignItems = 'center';
    errorModal.style.color = 'white';
    errorModal.style.fontFamily = 'Arial, sans-serif';
    errorModal.style.zIndex = '2000';
    errorModal.style.padding = '20px';
    errorModal.style.boxSizing = 'border-box';
    
    errorModal.innerHTML = `
        <h2>Camera Permission Denied</h2>
        <p>Gesture control requires access to your webcam.</p>
        <p>Please allow camera access and refresh the page to use gesture control.</p>
        <button id="closeErrorBtn" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">
            Close
        </button>
    `;
    
    document.body.appendChild(errorModal);
    
    // Add event listener to close modal
    document.getElementById('closeErrorBtn').addEventListener('click', () => {
        document.body.removeChild(errorModal);
    });
}

// Integration with existing slide navigation
function showNextSlide() {
    // Simulate a right arrow key press to advance to the next slide
    const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        code: 'ArrowRight',
        keyCode: 39,
        which: 39,
        bubbles: true
    });
    document.dispatchEvent(event);
}

function showPreviousSlide() {
    // Simulate a left arrow key press to go back to the previous slide
    const event = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        keyCode: 37,
        which: 37,
        bubbles: true
    });
    document.dispatchEvent(event);
}

// Hand connections for drawing
const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20],
    [5, 9], [9, 13], [13, 17], [5, 17]
];

// Load the necessary libraries and initialize the system when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create script elements for MediaPipe libraries
    const scripts = [
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
    ];
    
    // Load scripts sequentially
    let scriptsLoaded = 0;
    
    function loadScript(index) {
        if (index >= scripts.length) {
            console.log('All MediaPipe libraries loaded');
            // Initialize gesture control after all scripts are loaded
            initGestureControl();
            return;
        }
        
        const script = document.createElement('script');
        script.src = scripts[index];
        script.onload = () => {
            console.log(`Loaded: ${scripts[index]}`);
            loadScript(index + 1);
        };
        script.onerror = (error) => {
            console.error(`Failed to load script: ${scripts[index]}`, error);
            // Try to continue with the next script
            loadScript(index + 1);
        };
        document.head.appendChild(script);
    }
    
    // Start loading scripts
    loadScript(0);
});