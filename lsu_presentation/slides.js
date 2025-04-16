// LSU Presentation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the presentation content
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            createSlides(data);
            initializeNavigation();
        })
        .catch(error => {
            console.error('Error loading presentation content:', error);
            document.querySelector('.slide-container').innerHTML = 
                '<div class="slide active"><div class="slide-title">Error Loading Presentation</div>' +
                '<p>Could not load the presentation content. Please check the content.json file.</p></div>';
        });
});

// Create slides from the JSON content
function createSlides(data) {
    const slideContainer = document.querySelector('.slide-container');
    let slidesHTML = '';
    
    // Loop through each slide in the data
    data.slides.forEach((slide, index) => {
        // Create slide HTML based on slide type
        switch(slide.type) {
            case 'title':
                slidesHTML += createTitleSlide(slide, index);
                break;
            case 'content':
                slidesHTML += createContentSlide(slide, index);
                break;
            case 'two-column':
                slidesHTML += createTwoColumnSlide(slide, index);
                break;
            case 'content-with-image':
                slidesHTML += createContentWithImageSlide(slide, index);
                break;
            case 'content-with-image-grid':
                slidesHTML += createContentWithImageGridSlide(slide, index);
                break;
            case 'two-column-with-image':
                slidesHTML += createTwoColumnWithImageSlide(slide, index);
                break;
            case 'two-column-with-images':
                slidesHTML += createTwoColumnWithImagesSlide(slide, index);
                break;
            case 'video':
                slidesHTML += createVideoSlide(slide, index);
                break;
            default:
                slidesHTML += createContentSlide(slide, index);
        }
    });
    
    // Add the slides to the container
    slideContainer.innerHTML = slidesHTML;
    
    // Set the first slide as active
    const firstSlide = document.querySelector('.slide');
    if (firstSlide) {
        firstSlide.classList.add('active');
    }
    
    // Update the progress bar
    updateProgressBar(0, data.slides.length);
}

// Create a title slide
function createTitleSlide(slide, index) {
    return `
        <div class="slide title-slide" id="slide-${index + 1}">
            <div class="lsu-header">
                <div class="lsu-logo">
                    <img src="../PNG Files/logo_gold.png" alt="LSU Electrical Engineering Logo">
                </div>
                <div>Towards High-Fidelity VR Simulation of HRI Tasks</div>
            </div>
            <div class="title-content">
                <div class="slide-title">${slide.title}</div>
                <div class="slide-subtitle">${slide.subtitle}</div>
                <div class="authors">${slide.authors}</div>
            </div>
            <div class="lsu-footer">
                <div>${slide.footer.left}</div>
                <div>${slide.footer.right}</div>
            </div>
        </div>
    `;
}

// Create a regular content slide
function createContentSlide(slide, index) {
    let contentHTML = '';
    
    // Special handling for slide 2 (index 1) with progressive reveal
    if (index === 1 && typeof slide.content === 'object') {
        // Create progressive reveal content for slide 2
        const sections = Object.entries(slide.content);
        contentHTML = `
            <div class="progressive-content">
                <div class="static-content-wrapper">
                    ${sections.map(([title, items], sectionIndex) => `
                        <div class="content-section ${sectionIndex === 0 ? 'active' : ''}" data-section="${sectionIndex}">
                            <div class="content-section-title">${title}</div>
                            <ul class="full-width-list">
                                ${Array.isArray(items) ? items.map(item => `<li>${item}</li>`).join('') : items}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                <!-- Progress indicator removed -->
            </div>
        `;
        
        // Return early to avoid getting content processed again
        return `
            <div class="slide progressive-slide" id="slide-${index + 1}">
                <div class="lsu-header">
                    <div class="lsu-logo">
                        <img src="../PNG Files/logo_gold.png" alt="LSU Electrical Engineering Logo">
                    </div>
                    <div>${slide.header.text}</div>
                </div>
                <div class="slide-title">${slide.title}</div>
                <div class="slide-content centered-content">
                    <div class="content-container" style="width: 100%; max-width: 100%;">
                        ${contentHTML}
                    </div>
                </div>
                <div class="lsu-footer">
                    <div>${slide.footer.left}</div>
                    <div>${slide.footer.right || 'Page ' + (index + 1)}</div>
                </div>
            </div>
        `;
    }
    // Check if content is an SVG path (architecture diagram)
    else if (typeof slide.content === 'string' && slide.content.endsWith('.svg')) {
        // Special case for architecture diagram - full slide image
        contentHTML = `
            <div class="diagram-container">
                <img src="${slide.content}" alt="System Architecture Diagram" class="full-slide-diagram">
            </div>
            <div class="centered-caption">
            </div>
        `;
    } else if (Array.isArray(slide.content)) {
        // If content is an array, create a list
        contentHTML = `
            <ul class="full-width-list">
                ${slide.content.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    } else if (typeof slide.content === 'object') {
        // If content is an object with sections
        contentHTML = Object.entries(slide.content).map(([title, items]) => {
            if (title === 'Architecture Diagram' && typeof items === 'string' && items.endsWith('.svg')) {
                // Special case for architecture diagram - full slide image
                return `
                    <div class="diagram-container">
                        <img src="${items}" alt="System Architecture Diagram" class="full-slide-diagram">
                    </div>
                    <div class="centered-caption">
                        <p class="caption">Layered Blueprint Architecture for VR Training System</p>
                    </div>
                `;
            } else {
                return `
                    <div class="content-section-title">${title}</div>
                    <ul class="full-width-list">
                        ${Array.isArray(items) ? items.map(item => `<li>${item}</li>`).join('') : items}
                    </ul>
                `;
            }
        }).join('');
    } else if (slide.content === 'acknowledgement') {
        // Special case for acknowledgement
        contentHTML = `
            <div class="acknowledgement">
                <p>${slide.acknowledgementText[0]}</p>
                <p>${slide.acknowledgementText[1]}</p>
            </div>
        `;
    } else {
        // Simple text content
        contentHTML = `<p class="full-width-text">${slide.content}</p>`;
    }
    
    return `
        <div class="slide ${index === 1 ? 'progressive-slide' : ''}" id="slide-${index + 1}">
            <div class="lsu-header">
                <div class="lsu-logo">
                    <img src="../PNG Files/logo_gold.png" alt="LSU Electrical Engineering Logo">
                </div>
                <div>${slide.header.text}</div>
            </div>
            <div class="slide-title">${slide.title}</div>
            <div class="slide-content centered-content">
                <div class="content-container" style="width: 100%; max-width: 100%;">
                    ${contentHTML}
                </div>
            </div>
            <div class="lsu-footer">
                <div>${slide.footer.left}</div>
                <div>${slide.footer.right || 'Page ' + (index + 1)}</div>
            </div>
        </div>
    `;
}

// Create a content slide with a single image
function createContentWithImageSlide(slide, index) {
    let contentHTML = '';
    
    // Build the content HTML based on content type
    if (Array.isArray(slide.content)) {
        // If content is an array, create a list
        contentHTML = `
            <ul class="standard-list">
                ${slide.content.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    } else if (typeof slide.content === 'object') {
        // If content is an object with sections
        contentHTML = Object.entries(slide.content).map(([title, items]) => `
            <div class="content-section-title">${title}</div>
            <ul class="standard-list">
                ${Array.isArray(items) ? items.map(item => `<li>${item}</li>`).join('') : items}
            </ul>
        `).join('');
    } else {
        // Simple text content
        contentHTML = `<p class="standard-text">${slide.content}</p>`;
    }
    
    const captionHTML = slide.caption ? `<p class="caption">${slide.caption}</p>` : '';
    
    // Determine layout ratio based on content length
    const contentLength = typeof slide.content === 'object' ? 
        Object.values(slide.content).flat().length : 
        (Array.isArray(slide.content) ? slide.content.length : 1);
    
    // Special case for architecture diagram (slide 3)
    let leftColumnClass = "column";
    let rightColumnClass = "column column-with-image";
    
    // Add architecture-diagram class for slide 3
    if (index === 2) { // index 2 is the third slide (slide 3)
        leftColumnClass += " arch-text-column";
        rightColumnClass += " arch-diagram-column";
    }
    
    return `
        <div class="slide" id="slide-${index + 1}">
            <div class="lsu-header">
                <div class="lsu-logo">
                    <img src="../PNG Files/logo_gold.png" alt="LSU Electrical Engineering Logo">
                </div>
                <div>${slide.header.text}</div>
            </div>
            <div class="slide-title">${slide.title}</div>
            <div class="slide-content">
                <div class="${leftColumnClass}">
                    ${contentHTML}
                </div>
                <div class="${rightColumnClass}">
                    <div class="slide-image">
                        <img src="${slide.image}" alt="${slide.title}">
                        ${captionHTML}
                    </div>
                </div>
            </div>
            <div class="lsu-footer">
                <div>${slide.footer.left}</div>
                <div>${slide.footer.right || 'Page ' + (index + 1)}</div>
            </div>
        </div>
    `;
}

// Create a content slide with multiple images in a grid
function createContentWithImageGridSlide(slide, index) {
    let contentHTML = '';
    
    // Build the content HTML based on content type
    if (Array.isArray(slide.content)) {
        // If content is an array, create a list
        contentHTML = `
            <ul class="standard-list">
                ${slide.content.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    } else if (typeof slide.content === 'object') {
        // If content is an object with sections
        contentHTML = Object.entries(slide.content).map(([title, items]) => `
            <div class="content-section-title">${title}</div>
            <ul class="standard-list">
                ${Array.isArray(items) ? items.map(item => `<li>${item}</li>`).join('') : items}
            </ul>
        `).join('');
    } else {
        // Simple text content
        contentHTML = `<p class="standard-text">${slide.content}</p>`;
    }
    
    // Determine layout based on number of images
    const layoutClass = slide.images.length > 2 ? "image-grid" : "image-grid-large";
    
    // Create image grid HTML
    const imagesHTML = slide.images.map(image => 
        `<img src="${image}" alt="${slide.title}">`
    ).join('');
    
    return `
        <div class="slide" id="slide-${index + 1}">
            <div class="lsu-header">
                <div class="lsu-logo">
                    <img src="../PNG Files/logo_gold.png" alt="LSU Electrical Engineering Logo">
                </div>
                <div>${slide.header.text}</div>
            </div>
            <div class="slide-title">${slide.title}</div>
            <div class="slide-content standard-grid-layout">
                <div class="grid-content-section">
                    ${contentHTML}
                </div>
                <div class="${layoutClass}">
                    ${imagesHTML}
                </div>
            </div>
            <div class="lsu-footer">
                <div>${slide.footer.left}</div>
                <div>${slide.footer.right || 'Page ' + (index + 1)}</div>
            </div>
        </div>
    `;
}

// Create a two-column slide
function createTwoColumnSlide(slide, index) {
    return `
        <div class="slide" id="slide-${index + 1}">
            <div class="lsu-header">
                <div class="lsu-logo">
                    <img src="../PNG Files/logo_gold.png" alt="LSU Electrical Engineering Logo">
                </div>
                <div>${slide.header.text}</div>
            </div>
            <div class="slide-title">${slide.title}</div>
            <div class="slide-content">
                <div class="column">
                    <div class="column-title">${slide.leftColumn.title}</div>
                    <ul>
                        ${slide.leftColumn.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="column">
                    <div class="column-title">${slide.rightColumn.title}</div>
                    <ul>
                        ${slide.rightColumn.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="lsu-footer">
                <div>${slide.footer.left}</div>
                <div>${slide.footer.right || 'Page ' + (index + 1)}</div>
            </div>
        </div>
    `;
}

// Create a two-column slide with a single image below
function createTwoColumnWithImageSlide(slide, index) {
    const captionHTML = slide.caption ? `<p class="caption">${slide.caption}</p>` : '';
    
    return `
        <div class="slide" id="slide-${index + 1}">
            <div class="lsu-header">
                <div class="lsu-logo">
                    <img src="../PNG Files/logo_gold.png" alt="LSU Electrical Engineering Logo">
                </div>
                <div>${slide.header.text}</div>
            </div>
            <div class="slide-title">${slide.title}</div>
            <div class="slide-content two-col-image-layout">
                <div class="columns-container">
                    <div class="column">
                        <div class="column-title">${slide.leftColumn.title}</div>
                        <ul>
                            ${slide.leftColumn.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="column">
                        <div class="column-title">${slide.rightColumn.title}</div>
                        <ul>
                            ${slide.rightColumn.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="bottom-image">
                    <img src="${slide.image}" alt="${slide.title}">
                    ${captionHTML}
                </div>
            </div>
            <div class="lsu-footer">
                <div>${slide.footer.left}</div>
                <div>${slide.footer.right || 'Page ' + (index + 1)}</div>
            </div>
        </div>
    `;
}

// Create a two-column slide with images in both columns
function createTwoColumnWithImagesSlide(slide, index) {
    return `
        <div class="slide" id="slide-${index + 1}">
            <div class="lsu-header">
                <div class="lsu-logo">
                    <img src="../PNG Files/logo_gold.png" alt="LSU Electrical Engineering Logo">
                </div>
                <div>${slide.header.text}</div>
            </div>
            <div class="slide-title">${slide.title}</div>
            <div class="slide-content">
                <div class="column column-with-image">
                    <div class="column-title">${slide.leftColumn.title}</div>
                    <ul class="compact-list">
                        ${slide.leftColumn.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <div class="slide-image flex-grow">
                        <img src="${slide.leftColumn.image}" alt="${slide.leftColumn.title}">
                    </div>
                </div>
                <div class="column column-with-image">
                    <div class="column-title">${slide.rightColumn.title}</div>
                    <ul class="compact-list">
                        ${slide.rightColumn.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <div class="slide-image flex-grow">
                        <img src="${slide.rightColumn.image}" alt="${slide.rightColumn.title}">
                    </div>
                </div>
            </div>
            <div class="lsu-footer">
                <div>${slide.footer.left}</div>
                <div>${slide.footer.right || 'Page ' + (index + 1)}</div>
            </div>
        </div>
    `;
}

// Initialize navigation
function initializeNavigation() {
    const slides = document.querySelectorAll('.slide');
    const slideContainer = document.querySelector('.slide-container');
    let currentSlide = 0;
    let currentSection = 0;
    let totalSections = 0; // Will be set for slide 2
    
    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlide = index;
        updateProgressBar(currentSlide, slides.length);
        
        // Handle video slides - pause videos on non-active slides, play on active slides
        document.querySelectorAll('.slide:not(.active) video').forEach(video => {
            video.pause();
        });
        
        // Play the video if it's a video slide
        const activeVideo = slides[index].querySelector('video');
        if (activeVideo) {
            // Reset the video to the beginning and play it
            activeVideo.currentTime = 0;
            activeVideo.play();
        }
        
        // Reset section counter when changing slides
        currentSection = 0;
        
        // Initialize the first section to be visible on slide 2
        if (index === 1) {
            const sections = slides[index].querySelectorAll('.content-section');
            totalSections = sections.length;
            
            sections.forEach((section, idx) => {
                if (idx === 0) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
            
            // Dot indicators have been removed
        }
    }
    
    // Handle section navigation for slide 2
    function showSection(sectionIndex) {
        if (currentSlide !== 1) return; // Only apply to slide 2
        
        const slide = slides[currentSlide];
        const sections = slide.querySelectorAll('.content-section');
        const dots = slide.querySelectorAll('.dot');
        
        if (sectionIndex < 0) sectionIndex = 0;
        if (sectionIndex >= sections.length) {
            // If we're at the last section, move to the next slide
            currentSection = 0;
            showSlide(currentSlide + 1);
            return;
        }
        
        // Make all sections visible to maintain layout, but only activate up to current section
        sections.forEach((section, idx) => {
            // Keep section in the DOM layout but make it invisible if not active
            if (idx <= sectionIndex) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Dots have been removed, no need to update them
        
        currentSection = sectionIndex;
    }
    
    // Click navigation (left side = previous, right side = next)
    slideContainer.addEventListener('click', function(e) {
        // Dot indicators have been removed
        
        const containerWidth = slideContainer.offsetWidth;
        const clickX = e.clientX;
        
        if (currentSlide === 1) {
            // Special handling for slide 2
            if (clickX < containerWidth / 2) {
                // Clicked on left side
                if (currentSection > 0) {
                    showSection(currentSection - 1);
                } else {
                    showSlide(currentSlide - 1);
                }
            } else {
                // Clicked on right side
                showSection(currentSection + 1);
            }
        } else {
            // Normal slide navigation
            if (clickX < containerWidth / 2) {
                // Clicked on left side
                showSlide(currentSlide - 1);
            } else {
                // Clicked on right side
                showSlide(currentSlide + 1);
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (currentSlide === 1) {
            // Special handling for slide 2
            if (e.key === 'ArrowRight' || e.key === ' ') {
                showSection(currentSection + 1);
            } else if (e.key === 'ArrowLeft') {
                if (currentSection > 0) {
                    showSection(currentSection - 1);
                } else {
                    showSlide(currentSlide - 1);
                }
            }
        } else {
            // Normal slide navigation
            if (e.key === 'ArrowRight' || e.key === ' ') {
                showSlide(currentSlide + 1);
            } else if (e.key === 'ArrowLeft') {
                showSlide(currentSlide - 1);
            }
        }
    });
}

// Create a video slide
function createVideoSlide(slide, index) {
    // Create a clean fullscreen video slide with no overlays
    return `
        <div class="slide video-slide pure-video-slide" id="slide-${index + 1}">
            <div class="pure-video-container">
                <video muted autoplay loop>
                    <source src="${slide.videoSrc}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    `;
}

// Update the progress bar
function updateProgressBar(current, total) {
    const progressBar = document.getElementById('progress-bar');
    const percentage = ((current) / (total - 1)) * 100;
    progressBar.style.width = `${percentage}%`;
}