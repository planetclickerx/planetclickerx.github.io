// Mobile touch interaction improvements

// Improve planet clicking on touch devices
function enhanceMobileTouchInteractions() {
    const planet = document.getElementById('planet');
    
    // Add touch-specific events
    planet.addEventListener('touchstart', function(e) {
        // Prevent default to avoid scrolling
        e.preventDefault();
        
        // Only process if planet is unlocked
        if (!planets[currentPlanetIndex].unlocked) return;
        
        // Get touch position
        const touch = e.touches[0];
        const rect = planet.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Create visual feedback
        addPlanetRipple({ clientX: touch.clientX, clientY: touch.clientY });
        
        // Process the click
        energy += energyPerClick;
        showPlusOne({ clientX: touch.clientX, clientY: touch.clientY });
        
        // Play sound if enabled
        if (isSoundOn) {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(error => console.log("Error playing click sound:", error));
        }
        
        // Update game state
        energyCollected(0);
    });
    
    // Add mobile swipe for planet navigation
    let touchStartX = 0;
    const gameContainer = document.getElementById('game-container');
    
    gameContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    });
    
    gameContainer.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - touchStartX;
        
        // If significant horizontal swipe detected
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe right - go to previous planet
                currentPlanetIndex = (currentPlanetIndex - 1 + planets.length) % planets.length;
            } else {
                // Swipe left - go to next planet
                currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
            }
            updatePlanet();
            updateShop();
        }
    });
    
    // Make shop items bigger touch targets
    const shopItems = document.querySelectorAll('.shop-item');
    shopItems.forEach(item => {
        item.style.minHeight = '60px'; // Ensure minimum height for touch
    });
    
    // Add viewport meta tag for proper scaling if not already present
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewportMeta);
    }
    
    // Detect orientation changes and adjust layout
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            // Give browser time to update dimensions
            adjustLayoutForOrientation();
        }, 200);
    });
    
    // Initial check
    adjustLayoutForOrientation();
}

// Adjust layout based on orientation
function adjustLayoutForOrientation() {
    const gameWrapper = document.querySelector('.game-wrapper');
    const gameContainer = document.getElementById('game-container');
    const shopSection = document.getElementById('shop-section');
    
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

// Call this on window load
window.addEventListener('load', enhanceMobileTouchInteractions);