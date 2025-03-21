// Fix for energy display on mobile
function fixMobileEnergyDisplay() {
    // Get or create energy container
    const energyContainer = document.getElementById('energy');
    if (!energyContainer) return;
    
    // Check if we need to create the elements
    if (energyContainer.querySelector('.energy-value') === null || 
        energyContainer.querySelector('.energy-label') === null) {
        
        // Get the current text content (might just be a number)
        const currentText = energyContainer.textContent || '';
        
        // Parse out the energy value if it's in standard format
        let energyValue = '';
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
    }
    
    // Ensure the sound button is visible
    const soundButton = document.querySelector('.sound-button-container');
    if (soundButton) {
        // Make sure it has proper z-index and position
        soundButton.style.zIndex = '1100';
        
        // On mobile, move it to a better position if the screen is narrow
        if (window.innerWidth <= 768) {
            soundButton.style.position = 'fixed';
            soundButton.style.top = '70px';
            soundButton.style.left = '10px';
        }
    }
}

// Replace energyCollected function to ensure proper update
function energyCollected(amount) {
    energy += amount;
    
    // Update energy display
    const energyContainer = document.getElementById('energy');
    const formattedEnergy = formatEnergy(Math.floor(energy));
    
    // Update the value
    const valueElement = energyContainer.querySelector('.energy-value');
    if (valueElement) {
        valueElement.textContent = formattedEnergy;
        
        // Add animation class
        valueElement.classList.add('energy-update');
        
        // Remove animation class after it completes
        setTimeout(() => {
            valueElement.classList.remove('energy-update');
        }, 400);
    } else {
        // If structure doesn't exist yet, create it
        fixMobileEnergyDisplay();
    }
    
    throttledUpdate();
    saveGame();
}

// Run on page load and window resize
window.addEventListener('load', fixMobileEnergyDisplay);
window.addEventListener('resize', fixMobileEnergyDisplay);

// Also fix after short delay to ensure DOM is fully loaded
setTimeout(fixMobileEnergyDisplay, 500);