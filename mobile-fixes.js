// Mobile fixes for Planet Clicker

// Fix energy display on mobile
function fixEnergyDisplay() {
    const energyContainer = document.getElementById('energy');
    if (!energyContainer) return;
    
    // Get or create energy elements
    let valueElement = energyContainer.querySelector('.energy-value');
    let labelElement = energyContainer.querySelector('.energy-label');
    
    // If the structure doesn't exist yet, create it
    if (!valueElement || !labelElement) {
        // Get the current text content
        const currentText = energyContainer.textContent || '';
        let energyValue = '';
        
        // Try to parse the content
        if (currentText.includes('ENERGY')) {
            energyValue = currentText.replace('ENERGY', '').trim();
        } else {
            // Just use the whole text as value
            energyValue = currentText.trim();
        }
        
        // Create the two-row structure
        energyContainer.innerHTML = `
            <div class="energy-value">${energyValue}</div>
            <div class="energy-label">ENERGY</div>
        `;
        
        // Get the newly created elements
        valueElement = energyContainer.querySelector('.energy-value');
        labelElement = energyContainer.querySelector('.energy-label');
    }
    
    // Make sure energy value is visible and properly styled
    if (valueElement) {
        valueElement.style.display = 'block';
        valueElement.style.color = '#00ffcc';
        valueElement.style.textShadow = '0 0 10px #00ffcc, 0 0 15px #00ffcc';
    }
    
    // Make sure energy label is visible
    if (labelElement) {
        labelElement.style.display = 'block';
    }
    
    // Add background on mobile
    if (window.innerWidth <= 768) {
        energyContainer.style.position = 'fixed';
        energyContainer.style.top = '60px';
        energyContainer.style.left = '50%';
        energyContainer.style.transform = 'translateX(-50%)';
        energyContainer.style.zIndex = '900';
        energyContainer.style.background = 'rgba(0, 0, 0, 0.6)';
        energyContainer.style.padding = '5px 10px';
        energyContainer.style.borderRadius = '10px';
    }
}

// Make sound button visible on mobile
function fixSoundButton() {
    const soundButton = document.querySelector('.sound-button-container');
    if (!soundButton) return;
    
    // On mobile, add styles to make it more visible
    if (window.innerWidth <= 768) {
        soundButton.style.position = 'fixed';
        soundButton.style.top = '70px';
        soundButton.style.left = '10px';
        soundButton.style.zIndex = '1100';
        soundButton.style.background = 'rgba(0, 0, 0, 0.6)';
        soundButton.style.padding = '5px';
        soundButton.style.borderRadius = '50%';
        soundButton.style.width = '40px';
        soundButton.style.height = '40px';
        soundButton.style.display = 'flex';
        soundButton.style.alignItems = 'center';
        soundButton.style.justifyContent = 'center';
        soundButton.style.border = '1px solid rgba(0, 255, 204, 0.3)';
        
        // Smaller sizes for very small screens
        if (window.innerWidth <= 480) {
            soundButton.style.width = '36px';
            soundButton.style.height = '36px';
            soundButton.style.top = '60px';
            soundButton.style.left = '5px';
        }
    }
}

// Implement hamburger menu functionality
function setupHamburgerMenu() {
    // Get elements
    let hamburger = document.querySelector('.hamburger');
    const menuLinks = document.querySelector('.top-menu .menu-links');
    const topMenu = document.querySelector('.top-menu');
    
    if (!topMenu) return;
    
    // If hamburger doesn't exist yet, create it
    if (!hamburger && window.innerWidth <= 768) {
        // Create hamburger if it doesn't exist
        const newHamburger = document.createElement('div');
        newHamburger.className = 'hamburger';
        newHamburger.innerHTML = '<i class="fas fa-bars"></i>';
        topMenu.appendChild(newHamburger);
        
        // Update reference
        hamburger = newHamburger;
    }
    
    // Add click event to hamburger
    if (hamburger) {
        // Remove existing listeners to prevent duplicates
        const newHamburger = hamburger.cloneNode(true);
        if (hamburger.parentNode) {
            hamburger.parentNode.replaceChild(newHamburger, hamburger);
        }
        
        // Add click event
        newHamburger.addEventListener('click', function() {
            if (menuLinks) {
                menuLinks.classList.toggle('active');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (menuLinks && menuLinks.classList.contains('active')) {
            // Check if click was outside the menu
            if (!event.target.closest('.top-menu')) {
                menuLinks.classList.remove('active');
            }
        }
    });
    
    // Make the menu links hidden by default on mobile
    if (menuLinks && window.innerWidth <= 768) {
        menuLinks.classList.remove('active');
        
        // Add mobile styles to menu
        menuLinks.style.display = 'none';
        topMenu.style.flexDirection = 'column';
        topMenu.style.alignItems = 'flex-start';
    }
}

// Ensure shop text is visible or hidden as needed
function fixShopHeader() {
    // Check the new screenshot - it shows "Shop" text at the top
    // We'll keep it but style it nicely
    const shopSection = document.getElementById('shop-section');
    if (!shopSection) return;
    
    let shopHeader = shopSection.querySelector('h2');
    
    // If not found, try to find by text content
    if (!shopHeader) {
        const headers = shopSection.querySelectorAll('h2, h3, h4');
        for (let header of headers) {
            if (header.textContent.trim().toLowerCase() === 'shop') {
                shopHeader = header;
                break;
            }
        }
    }
    
    // If shop header found, style it
    if (shopHeader) {
        shopHeader.style.display = 'block';
        shopHeader.style.color = '#00ffcc';
        shopHeader.style.fontSize = window.innerWidth <= 480 ? '18px' : '24px';
        shopHeader.style.textAlign = 'center';
        shopHeader.style.margin = '5px 0 15px 0';
        shopHeader.style.textShadow = '0 0 8px #00ffcc';
    }
}

// Update energyCollected function to better update the display
function enhanceEnergyCollected() {
    // Store original function if it exists
    if (typeof window.energyCollected === 'function') {
        const originalEnergyCollected = window.energyCollected;
        
        // Replace with enhanced version
        window.energyCollected = function(amount) {
            // Call original
            originalEnergyCollected(amount);
            
            // Additional fixes for display
            fixEnergyDisplay();
        };
    } else {
        // If function doesn't exist yet, define a basic version
        window.energyCollected = function(amount) {
            if (typeof window.energy !== 'undefined') {
                window.energy += amount;
            }
            
            // Update display
            const energyContainer = document.getElementById('energy');
            if (!energyContainer) return;
            
            // Try to format energy if the function exists
            let formattedEnergy;
            if (typeof window.formatEnergy === 'function') {
                formattedEnergy = window.formatEnergy(Math.floor(window.energy));
            } else {
                // Basic formatting with dot separators
                formattedEnergy = window.energy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            
            // Get or create value element
            let valueElement = energyContainer.querySelector('.energy-value');
            if (!valueElement) {
                fixEnergyDisplay();
                valueElement = energyContainer.querySelector('.energy-value');
            }
            
            // Update text if element exists
            if (valueElement) {
                valueElement.textContent = formattedEnergy;
                
                // Add animation
                valueElement.classList.add('energy-update');
                setTimeout(() => {
                    valueElement.classList.remove('energy-update');
                }, 400);
            }
        };
    }
}

// Function to adjust layout based on orientation
function adjustLayoutForOrientation() {
    const gameWrapper = document.querySelector('.game-wrapper');
    const gameContainer = document.getElementById('game-container');
    const shopSection = document.getElementById('shop-section');
    
    if (!gameWrapper || !gameContainer || !shopSection) return;
    
    if (window.innerHeight < 500 && window.innerWidth > window.innerHeight) {
        // Landscape on small device - use side-by-side layout
        gameWrapper.style.flexDirection = 'row';
        gameContainer.style.width = '60%';
        shopSection.style.width = '40%';
        shopSection.style.maxHeight = '100vh';
        shopSection.style.borderTop = 'none';
        shopSection.style.borderLeft = '2px solid #00ffcc';
    } else if (window.innerWidth <= 768) {
        // Portrait or narrow layout - use stacked layout
        gameWrapper.style.flexDirection = 'column';
        gameContainer.style.width = '100%';
        shopSection.style.width = '100%';
        shopSection.style.maxHeight = '40vh';
        shopSection.style.borderTop = '2px solid #00ffcc';
        shopSection.style.borderLeft = 'none';
    }
}

// Add touch support for mobile
function enhanceTouchInteractions() {
    const planet = document.getElementById('planet');
    if (!planet) return;
    
    // Add touch event for planet
    planet.addEventListener('touchstart', function(e) {
        // Prevent default to avoid scrolling
        e.preventDefault();
        
        // Check if planet is clickable
        if (planet.classList.contains('locked')) return;
        
        // Get touch position
        const touch = e.touches[0];
        
        // Trigger click effect if we have a showPlusOne function
        if (typeof window.showPlusOne === 'function') {
            window.showPlusOne(touch);
        }
        
        // Update energy if we have access to it
        if (typeof window.energy !== 'undefined' && typeof window.energyPerClick !== 'undefined') {
            window.energy += window.energyPerClick;
            
            // Update display
            if (typeof window.energyCollected === 'function') {
                window.energyCollected(0);
            }
        }
        
        // Play sound if enabled
        if (typeof window.isSoundOn !== 'undefined' && window.isSoundOn) {
            const clickAudio = document.getElementById('click-audio');
            if (clickAudio) {
                clickAudio.currentTime = 0;
                clickAudio.play().catch(error => console.log("Error playing click sound:", error));
            }
        }
    });
    
    // Add swipe for planet navigation
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        let touchStartX = 0;
        
        gameContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        });
        
        gameContainer.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchEndX - touchStartX;
            
            // If significant horizontal swipe detected
            if (Math.abs(diffX) > 50) {
                // Check if we have navigation functions
                if (typeof window.currentPlanetIndex !== 'undefined' && typeof window.planets !== 'undefined') {
                    if (diffX > 0) {
                        // Swipe right - go to previous planet
                        window.currentPlanetIndex = (window.currentPlanetIndex - 1 + window.planets.length) % window.planets.length;
                    } else {
                        // Swipe left - go to next planet
                        window.currentPlanetIndex = (window.currentPlanetIndex + 1) % window.planets.length;
                    }
                    
                    // Update planet if function exists
                    if (typeof window.updatePlanet === 'function') {
                        window.updatePlanet();
                    }
                    
                    // Update shop if function exists
                    if (typeof window.updateShop === 'function') {
                        window.updateShop();
                    }
                }
            }
        });
    }
}

// Fix the viewport for mobile
function fixViewport() {
    // Check if viewport meta exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    // If it doesn't exist, create it
    if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        document.head.appendChild(viewportMeta);
    }
    
    // Set proper content
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
}

// Run all fixes
function applyAllMobileFixes() {
    fixViewport();
    fixEnergyDisplay();
    fixSoundButton();
    setupHamburgerMenu();
    fixShopHeader();
    enhanceEnergyCollected();
    adjustLayoutForOrientation();
    enhanceTouchInteractions();
}

// Call on load and resize
window.addEventListener('load', applyAllMobileFixes);
window.addEventListener('resize', applyAllMobileFixes);

// Call after a short delay to ensure DOM is ready
setTimeout(applyAllMobileFixes, 500);

// Add an observer to detect DOM changes and reapply fixes
const observer = new MutationObserver(function(mutations) {
    // Apply fixes if mutations affected relevant elements
    applyAllMobileFixes();
});

// Start observing once DOM is ready
window.addEventListener('DOMContentLoaded', function() {
    observer.observe(document.body, { 
        childList: true,
        subtree: true,
        attributes: true
    });
});