# LSU Themed Presentation Template

This is a modular presentation system using HTML, CSS, and JavaScript, themed with LSU's official purple and gold colors.

## Files Structure

- **index.html**: The main HTML structure file that loads all resources
- **lsu-style.css**: All styling for the presentation (LSU colors, layouts, typography)
- **slides.js**: JavaScript that handles slide loading, navigation, and interactions
- **content.json**: Content for all slides in a structured format

## How It Works

1. The system loads a clean template structure from the HTML file
2. CSS provides the LSU styling and layout
3. JavaScript loads the presentation content from the JSON file
4. Slides are dynamically created based on content types and structure

## Customizing the Presentation

### To Change the Content

Edit the `content.json` file to update text, titles, and structure. The JSON file contains an array of slide objects, each with:

- `type`: The slide type (title, content, two-column)
- `title`: Main slide heading
- `header`: Header content including logo text
- `footer`: Footer content
- Content-specific fields based on slide type

### To Change the Design

Edit the `lsu-style.css` file to modify:

- Colors (LSU purple/gold are defined as variables)
- Fonts and typography
- Layout and spacing
- Header and footer appearance

### To Add New Slide Types

1. Create a new slide type function in `slides.js`
2. Add the new type to the switch statement in the createSlides function
3. Add examples in the content.json file with the new type

## Using the Presentation

1. Open `index.html` in any modern web browser
2. Navigate using:
   - Next/Previous buttons
   - Arrow keys (left/right)
   - Spacebar (to advance)
3. The progress bar at the bottom shows your current position

## Special Features

- Progress bar to track your position in the presentation
- LSU Electrical Engineering logo in the header
- Custom LSU purple and gold theming
- Responsive design that works on various screen sizes

## Logo Information

The presentation uses the LSU Electrical Engineering logo from the PNG Files folder:
- Path: `../PNG Files/LSUElectrical_Gold_RGB.png`
- You can change to a different logo by modifying the path in the slides.js file

## LSU Brand Colors

- LSU Purple: #461D7C
- LSU Gold: #FDD023
