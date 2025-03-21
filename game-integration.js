// Functions to integrate visual effects with the main game

// Enhance the planet click function
function enhancePlanetClick() {
    const planet = document.getElementById('planet');
    
    // Remove any existing event listeners and create a new planet element
    const newPlanet = planet.cloneNode(true);
    planet.parentNode.replaceChild(newPlanet, planet);
    
    // Add enhanced click event
    newPlanet.addEventListener('click', (event) => {
        if (!planets[currentPlanetIndex].unlocked) return;
        
        // Original click functionality
        energy += energyPerClick;
        document.getElementById('energy').textContent = `${formatEnergy(Math.floor(energy))} ENERGY`;
        
        // Show plus one text
        showPlusOne(event);
        
        // Play sound
        if (isSoundOn) {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(error => console.log("Error playing click sound:", error));
        }
        
        // Add visual ripple effect
        addPlanetRipple(event);
        
        // Sometimes add energy pulse
        if (Math.random() > 0.7) {
            addEnergyPulse();
        }
        
        // Update game state
        energyCollected(0);
    });
}

// Add ripple effect to planet click
function addPlanetRipple(event) {
    const planet = document.getElementById('planet');
    const rect = planet.getBoundingClientRect();
    
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.className = 'planet-ripple';
    
    // Position ripple at click point
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Add to planet and remove after animation
    planet.appendChild(ripple);
    setTimeout(() => {
        ripple.remove();
    }, 2000);
}

// Add energy pulse effect
function addEnergyPulse() {
    const planet = document.getElementById('planet');
    
    // Create pulse element
    const pulse = document.createElement('div');
    pulse.className = 'energy-pulse';
    
    // Add to planet and remove after animation
    planet.appendChild(pulse);
    setTimeout(() => {
        pulse.remove();
    }, 1000);
}

// Add background stars
function addBackgroundStars() {
    const container = document.querySelector('.game-wrapper');
    
    // Clear any existing stars
    const existingStars = document.querySelectorAll('.star');
    existingStars.forEach(star => star.remove());
    
    // Add new stars with varied animations
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Randomize star properties
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Randomize animation delay
        star.style.animationDelay = `${Math.random() * 4}s`;
        
        // Add to container
        container.appendChild(star);
    }
}

// Enhance energy collection with visual feedback
function enhanceEnergyCollection() {
    // Store original function to call it
    const originalEnergyCollected = window.energyCollected;
    
    // Override with enhanced version
    window.energyCollected = (amount) => {
        // Call original function
        originalEnergyCollected(amount);
        
        // Check for milestones
        checkEnergyMilestones();
    };
}

// Add planet energy boost effect on milestone
function addPlanetEnergyBoost() {
    const planet = document.getElementById('planet');
    planet.classList.add('planet-energy-boost');
    
    // Remove class after animation completes
    setTimeout(() => {
        planet.classList.remove('planet-energy-boost');
    }, 2000);
}

// Enhanced shop item purchase effect
function enhanceShopPurchase() {
    // First, store original flash purchase function
    const originalFlashPurchase = window.flashPurchase;
    
    // Override with enhanced version
    window.flashPurchase = (elementId) => {
        // Call original function
        originalFlashPurchase(elementId);
        
        // Add additional effects
        const element = document.getElementById(elementId);
        
        // Create particles around purchased item
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'shop-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            element.appendChild(particle);
            
            // Remove particles after animation
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
        
        // Add planet energy boost for significant purchases
        if (elementId === 'stellar-wind-turbine-item' || elementId === 'galactic-forge-item') {
            addPlanetEnergyBoost();
        }
    };
}

// Initialize all enhanced visuals
function initEnhancedVisuals() {
    // Add background stars
    addBackgroundStars();
    
    // Enhance planet click
    enhancePlanetClick();
    
    // Enhance energy collection
    enhanceEnergyCollection();
    
    // Enhance shop purchases
    enhanceShopPurchase();
    
    // Initialize space effects
    initSpaceEffects();
    
    // Add window resize handler
    window.addEventListener('resize', () => {
        addBackgroundStars();
    });
}

// Generate a random meteor at regular intervals
function startRandomSpaceEvents() {
    setInterval(() => {
        // Randomly decide whether to create a meteor or shooting star
        const randomChance = Math.random();
        
        if (randomChance < 0.3) {
            createMeteor();
        } else if (randomChance < 0.6) {
            createShootingStar();
        }
    }, 10000); // Every 10 seconds
}

// Add this to window.onload
const originalWindowOnload = window.onload;
window.onload = function() {
    // Call the original onload function
    if (originalWindowOnload) {
        originalWindowOnload();
    }
    
    // Add our enhancements
    initEnhancedVisuals();
    startRandomSpaceEvents();
    
    // Show welcome milestone
    setTimeout(() => {
        showMilestoneNotification("Welcome to Planet Clicker!");
    }, 1500);
};