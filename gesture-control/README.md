# Gesture Control for LSU Presentation

This extension adds webcam-based gesture control functionality to the LSU Presentation system, allowing presenters to navigate through slides using hand gestures instead of keyboard or mouse controls.

## Features

- **Hand Gesture Navigation**: Navigate through slides using simple hand gestures
  - Cross left to right: Go to next slide
  - Cross right to left: Go to previous slide
  - Hold gesture (optional): Custom action
- **Visual Feedback**: Shows visual indicators for recognized gestures
- **Toggle Controls**: Enable/disable gesture control with a button
- **Unobtrusive Interface**: Small webcam feed displayed in the corner
- **Debug Mode**: Real-time information about gesture detection
- **Configurable Settings**: Easy customization of gesture parameters
- **Presenter/Viewer Mode**: Separate views for presenter and audience

## Technical Implementation

This system uses the following technologies:

- **MediaPipe Hands**: For real-time hand tracking and landmark detection
- **JavaScript**: For hand gesture recognition and integration with the presentation system
- **HTML/CSS**: For the user interface and visual feedback

## Requirements

- Modern web browser (Chrome, Edge, or Firefox recommended)
- Webcam
- Permission to access webcam from the browser

## How to Use

1. Open the presentation with gesture control (`gesture-control/index.html`)
2. Click the "Enable Gesture Control" button in the top-right corner
3. Grant webcam permission when prompted
4. A small webcam feed will appear in the bottom-right corner
5. Use the following gestures to control the presentation:
   - **Cross left to right**: Move to the next slide
   - **Cross right to left**: Move to the previous slide
   - **Hold** (if enabled): Custom action

## How It Works

The system uses MediaPipe's hand tracking to detect the positions of 21 landmarks on your hand in real-time. When you make a gesture:

1. The system tracks the movement of your index finger (landmark 8)
2. It detects when your hand crosses from one half of the screen to the other
3. Moving from left half to right half advances to the next slide
4. Moving from right half to left half goes back to the previous slide
5. A visual indicator shows which gesture was recognized
6. The system also tracks finger extension status for potential additional controls

In debug mode, you can see detailed information about your movements, including:
- Current hand position
- Which half of the screen your hand is in
- Number of detected extended fingers

## Presenter/Viewer Mode

A key feature of this system is the ability to have separate presenter and viewer interfaces:

### Presenter View
- Located in `views/presenter.html`
- Includes all gesture control capabilities
- Shows debugging information and webcam feed
- Provides manual navigation controls
- Includes a slide counter and debug panel
- Can launch and control a synchronized viewer window

### Viewer View
- Located in `views/viewer.html`
- Clean, minimal interface without controls or debug information
- No webcam feed or gesture indicators visible
- Synchronized with the presenter's current slide
- Ideal for displaying to an audience on a projector
- Includes a discreet fullscreen button

This dual-view system is perfect for presentations where you want the controls and feedback for yourself, but a clean view for your audience.

## Troubleshooting

- **Camera not working**: Make sure you've granted camera permissions to the site
- **Gestures not recognized**: Ensure your hand is clearly visible in the webcam view
- **Performance issues**: Try closing other applications or tabs using your webcam
- **Gesture sensitivity issues**: Try adjusting the configuration parameters in `gesture-control.js`
- **Browser compatibility**: Use Chrome or Edge for best results with MediaPipe

## Configuration Options

You can customize the gesture detection by modifying the `config` object at the top of `gesture-control.js`:

```javascript
const config = {
    // Gesture detection settings
    minDetectionConfidence: 0.7,  // Increase for more accuracy
    minTrackingConfidence: 0.7,   // Decrease for better responsiveness
    
    // Swipe gesture settings
    swipeThreshold: 0.1, // Lower = more sensitive
    swipeTimeout: 300,   // Time window for swipe detection
    
    // Hold gesture settings
    holdThreshold: 0.02, // Maximum movement for hold detection
    holdTime: 1000,      // Time to hold in milliseconds
    
    // Debug mode
    debug: true,         // Set to false to hide debug panel
    
    // Enable/disable specific gestures
    enableSwipeLeft: true,
    enableSwipeRight: true,
    enableSwipeUp: false,
    enableSwipeDown: false,
    enableHold: false
};
```

## Files Included

- `gesture-control.js`: Main gesture detection and processing script
- `index.html`: Modified presentation viewer with gesture control
- `test.html`: Simple test page for trying gesture detection
- `launch.html`: Launcher interface to choose between modes
- `troubleshoot.html`: Diagnostic tool for webcam and gesture issues
- `views/presenter.html`: Presentation view with controls for presenters
- `views/viewer.html`: Clean view without controls for audience display
- `README.md`: This documentation file
- `INTEGRATION.md`: Guide for integrating with existing presentations
- `USER_GUIDE.md`: End-user documentation for presenters
- `GETTING_STARTED.md`: Quick start guide for new users
- `SUMMARY.md`: Overview of the implementation approach
- `PATH_FIXES.md`: Documentation of cross-directory path solutions

## Future Enhancements

- Add more gesture types for additional controls:
  - Rotation gestures for zooming in/out
  - Two-hand gestures for more complex controls
  - Pinch gestures for highlighting elements
- Improve gesture recognition accuracy with machine learning
- Add customizable gesture settings via UI
- Implement a calibration system for better accuracy
- Add multi-hand support for more complex gestures
- Voice command integration for multi-modal control
- Accessibility features for users with limited mobility

## Credits

Developed as part of the Future-Ready Workforce Development project at Louisiana State University.

### Technologies Used

- [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) - Hand tracking library
- [Unreal Engine](https://www.unrealengine.com/) - For the original VR simulation environment
- [LSU Presentation System](https://www.lsu.edu/) - Base presentation framework

### Team Members

- Hameedreza Gucci
- Jonathan Morse
- Amirhosein Jafari
- Andrew Webb
- Jennifer Qian
- Shinhee Jeong
- Yimin Zhu
- Suniti Karunatillake

---

For more information, contact the development team.