# LSU Presentation Gesture Control

This directory contains a simplified implementation of gesture controls for the LSU presentation.

## Overview

This implementation adds gesture control and dual-window presentation capabilities to the original LSU presentation without modifying the original files. It uses:

1. **iframes** to load the original presentation
2. **MediaPipe** for hand gesture recognition
3. **BroadcastChannel API** for communication between presenter and audience views

## Features

- **Hand Gesture Navigation**: Swipe left/right to navigate between slides
- **Audience View**: Opens a separate window for audience that hides the gesture controls
- **Slide Synchronization**: Keeps presenter and audience views in sync
- **Special Video Handling**: Ensures video on slide 11 plays correctly

## Files

- `index.html` - Presenter view with gesture controls
- `audience.html` - Clean audience view for presentation display
- `README.md` - This documentation file

## How to Use

1. **Open the Presenter View**:
   - Open `/gesture-control/index.html` in a browser
   - This is your control interface with gesture recognition

2. **Enable Gesture Control**:
   - Click the "Enable Gesture Control" button in the top right
   - Allow camera permissions when prompted
   - A small webcam feed will appear in the bottom right

3. **Open Audience View**:
   - Click the "Open Audience View" button in the top left
   - Position this window on the projector/external display for the audience
   - Optionally click "Fullscreen" in the audience view

4. **Control the Presentation**:
   - Move your hand from left to right across the center line to advance to the next slide
   - Move your hand from right to left across the center line to go back to the previous slide
   - Both presenter and audience views will stay synchronized

5. **Manual Synchronization**:
   - If slides get out of sync, click the "Sync Current Slide" button

## Troubleshooting

### Video on Slide 11

If the video on slide 11 doesn't play correctly:
- In the audience view, the video will automatically show in a fullscreen overlay
- Click "Return to Presentation" to hide the video overlay

### Slide Synchronization Issues

If the audience view isn't staying in sync with the presenter view:
- Click the "Sync Current Slide" button that appears when the audience view is open
- Try refreshing both windows and starting again

## Technical Notes

- The system uses BroadcastChannel API for communication, which works best in Chrome-based browsers
- Gesture recognition uses MediaPipe Hands for tracking hand movements
- No modifications are made to the original presentation files

## Credits

- LSU Presentation by Jonathan Erkin Morse
- Hand gesture recognition using Google's MediaPipe
- Implementation by LSU College of Engineering