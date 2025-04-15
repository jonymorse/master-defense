# Path Fixes for Gesture Control Implementation

This document explains the modifications made to fix path references in the gesture control implementation when used across different directories.

## Issue Overview

The original issue was that the gesture control implementation in `/Users/jomo/masters/gesture-control/` couldn't properly load the presentation content from `/Users/jomo/masters/lsu_presentation/`. This caused the "Error Loading Presentation" message to appear.

## Changes Made

### 1. Fixed Content JSON Path

In `index.html`, we modified the fetch operation to correctly locate the content.json file:

```javascript
// Temporarily override fetch to modify the URL for content.json
const originalFetch = window.fetch;
window.fetch = function(url, options) {
    if (url === 'content.json') {
        url = '../lsu_presentation/content.json';
    }
    return originalFetch(url, options);
};
```

This approach intercepts the fetch call made in the original slides.js file and redirects it to the correct location.

### 2. Added Image Path Correction

We also added code to fix image paths after the slides are loaded:

```javascript
// Fix image paths after slides are loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for slides to be created
    setTimeout(function() {
        // Fix all image paths to point to the correct location
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            if (img.src.includes('PNG Files')) {
                // Fix the path to use the correct directory
                img.src = img.src.replace(/PNG\ Files/, '../PNG Files');
            }
            if (img.src.includes('images/')) {
                // Fix the path to use the correct directory
                img.src = img.src.replace(/images\//, '../lsu_presentation/images/');
            }
        });
    }, 500); // Give it time to load slides
});
```

This ensures that all image references are updated to point to the correct directories, fixing both the LSU logo from the PNG Files directory and the slide images from the images directory.

### 3. CSS Paths

The CSS file is correctly referenced with a relative path:

```html
<link rel="stylesheet" href="../lsu_presentation/lsu-style.css">
```

This ensures that the presentation styling is maintained even when viewed from the gesture-control directory.

## Benefits of This Approach

1. **Non-Invasive**: We didn't need to modify the original presentation files
2. **Maintainable**: Changes to the original presentation will automatically be reflected
3. **Isolated**: The gesture control functionality is kept separate from the presentation content
4. **Robust**: Path corrections handle different types of assets (JSON, images, CSS)

## How This Works

When the index.html file in the gesture-control directory is loaded:

1. It loads the original slides.js script from the lsu_presentation directory
2. The script tries to fetch 'content.json' from the current directory
3. Our override redirects that fetch to '../lsu_presentation/content.json'
4. After the slides are created, our image path correction updates all image sources
5. The presentation renders correctly with all content and styling intact

## Troubleshooting

If you still encounter path issues:

1. Check browser developer console for any 404 errors
2. Verify that all paths in the HTML and JS are correctly referencing the parent directory
3. Ensure that the file structure hasn't changed
4. Use the troubleshoot.html tool to diagnose any webcam or rendering issues

## Future Improvements

A more robust solution for a production environment might include:

1. Creating a build process that copies all necessary files to a single directory
2. Using absolute paths from a base URL
3. Implementing a more sophisticated module loading system
4. Using a proper bundler like Webpack to handle asset references

For now, this approach provides a clean separation between the presentation content and the gesture control functionality while maintaining full compatibility.
