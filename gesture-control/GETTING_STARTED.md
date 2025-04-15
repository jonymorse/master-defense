# Getting Started with Gesture Control

This guide explains how to get up and running with the webcam-based gesture control system for your LSU Presentation.

## What We've Built

We've created a complete gesture control solution that allows you to navigate through your presentation using hand gestures captured by your webcam. This includes:

1. **Core Gesture Detection System**: Using MediaPipe Hands for real-time hand tracking
2. **Presentation Integration**: Connecting gestures to slide navigation actions
3. **User Interface Components**: Visual feedback and control elements
4. **Test Environment**: Simple test page to practice gesture detection
5. **Troubleshooting Tool**: Diagnostic utility to check camera and gesture functionality
6. **Presenter/Viewer Modes**: Separate interfaces for presenter and audience
7. **Complete Documentation**: Technical and user-friendly guides

## How to Start Using It

### Quickest Method - Use the Launcher

1. Navigate to `/Users/jomo/masters/gesture-control/` in your file explorer
2. Open `launch.html` in a modern web browser (Chrome or Edge recommended)
3. Choose from the following options:
   - **Demo Mode**: For practicing gesture controls
   - **Presenter Mode**: Full controls and debug info with ability to launch viewer
   - **Viewer Mode**: Clean display for audience without controls
   - **Full Presentation**: Standard single-view mode with gesture control
   - **Troubleshooting**: For diagnosing any issues with webcam or gestures
4. Click the appropriate launch button
5. When the page loads, click "Enable Gesture Control" if using a mode with controls
6. Grant webcam permission when prompted

### Testing the System

Before using gesture control for an actual presentation:

1. Open `test.html` in your browser
2. Click "Enable Gesture Control"
3. Practice making left and right crossing gestures
4. Observe how the system responds to your movements
5. Use the visual feedback to improve your gesture technique

### Using for a Real Presentation

When you're ready to present:

1. Make sure you're in a well-lit environment
2. Position your laptop/device so the webcam can clearly see your hand
3. Open `index.html` (or use the launcher)
4. Enable gesture control
5. Present normally, using gestures to navigate slides

## Using Presenter and Viewer Modes

One of the most powerful features is the ability to have separate presenter and viewer views:

### Setting Up Dual Display

1. **Connect to Projector/External Display**: Connect your computer to a projector or second monitor
2. **Open Presenter View**: Launch `views/presenter.html` on your primary screen
3. **Open Viewer**: Click the "Open Viewer" link in the presenter view
4. **Move to Second Display**: Drag the viewer window to your secondary display
5. **Make Fullscreen**: Click the "Fullscreen" button on the viewer window

### Controlling the Presentation

1. **Enable Gesture Control**: Click the button in the presenter view
2. **Navigate**: Use hand gestures or the manual navigation buttons
3. **Monitor Feedback**: Watch gesture indicators and debug info
4. **Check Sync**: The viewer display will automatically stay synchronized

This setup gives you full control while showing a clean interface to your audience.

## Technical Requirements

- **Browser**: Chrome or Edge (latest version recommended)
- **Hardware**: Webcam with at least 720p resolution
- **Permissions**: Browser access to webcam
- **Performance**: Modern computer with sufficient processing power
- **Network**: No internet required after initial page load (MediaPipe libraries are loaded from CDN)

## Customization Options

If you want to customize the gesture control behavior:

1. Open `gesture-control.js` in a text editor
2. Locate the `config` object at the top of the file
3. Adjust parameters like `swipeThreshold` (lower = more sensitive)
4. Save the file and reload the page to test your changes

## Integrating with Other Presentations

To add gesture control to other presentations:

1. See the detailed instructions in `INTEGRATION.md`
2. The basic process involves:
   - Adding the gesture control script
   - Adding UI elements for feedback
   - Connecting gesture events to your navigation functions

## Troubleshooting

If you encounter issues:

1. **Use the Troubleshooting Tool**: 
   - Open `troubleshoot.html` directly or access it through the launcher
   - Use the various diagnostic tools to test your webcam, hand tracking, and gesture detection
   - Follow the step-by-step process to identify the specific issue

2. **Common Issues**:
   - **Webcam Permission**: Check browser settings if permission dialog doesn't appear
   - **Detection Problems**: Ensure good lighting and a contrasting background
   - **Browser Compatibility**: Try Chrome or Edge if other browsers have issues
   - **Performance Issues**: Close other applications, especially those using webcam
   - **Script Errors**: Check browser console for any error messages
   - **Path Problems**: If content doesn't load correctly, see `PATH_FIXES.md` for details

## Next Steps

Once you're comfortable with the basic gesture controls, consider:

1. Exploring the configuration options to fine-tune sensitivity
2. Adding additional gestures for specific presentation needs
3. Integrating the system with your own custom presentations
4. Providing feedback to help improve future versions

---

For more detailed information, please refer to:
- `README.md` - Technical overview
- `USER_GUIDE.md` - End-user instructions
- `INTEGRATION.md` - Developer integration guide

If you need additional assistance, please contact the development team.