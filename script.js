// Planet configurations
const planets = [
    { name: "Mercury", image: "1.png", unlocked: true, price: 0, shadowColor: '#d3d3d3', textShadow: '#d3d3d3' },
    { name: "Venus", image: "2.png", unlocked: false, price: 5000000, shadowColor: '#ffa500', textShadow: '#ffa500' },
    { name: "Earth", image: "earth.png", unlocked: false, price: 100000000, shadowColor: '#00ff00', textShadow: '#00ff00' },
    { name: "Mars", image: "3.png", unlocked: false, price: 5000000000, shadowColor: '#ff4500', textShadow: '#ff4500' },
    { name: "Jupiter", image: "4.png", unlocked: false, price: 20000000000, shadowColor: '#d2b48c', textShadow: '#d2b48c' },
    // { name: "Saturn", image: "earth.png", unlocked: false, price: 1000000000, shadowColor: '#ffd700', textShadow: '#ffd700' },
    // { name: "Uranus", image: "earth.png", unlocked: false, price: 5000000000, shadowColor: '#add8e6', textShadow: '#add8e6' },
    // { name: "Neptune", image: "earth.png", unlocked: false, price: 20000000000, shadowColor: '#0000ff', textShadow: '#0000ff' },
    // { name: "Pluto", image: "earth.png", unlocked: false, price: 100000000000, shadowColor: '#dcdcdc', textShadow: '#dcdcdc' }
];

// Game state variables
let currentPlanetIndex = 0;
let energy = 0;
let energyPerClick = 1;
let nanoBotHarvesterLevel = 0;
let nanoBotEnergyPerSecond = 0;
let solarCollectorLevel = 0;
let lunarBioDomeLevel = 0;
let stellarWindTurbineLevel = 0;
let galacticEnergyForgeLevel = 0;
let isSoundOn = true;
let autoClickInterval = null;

// Audio elements
const spaceAudio = document.getElementById('space-audio');
const clickAudio = document.getElementById('click-audio');
const successAudio = document.getElementById('success-audio');

// Canvas setup for effects
const canvas = document.getElementById('effects-canvas');
const ctx = canvas.getContext('2d');
let snowflakes = [];

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function createSnowflakeCanvas() {
    const size = Math.floor(Math.random() * 6) + 3;
    const x = Math.random() * canvas.width;
    const y = -size;
    snowflakes.push({ x, y, size, speed: Math.random() * 3 + 2 });
}

function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes = snowflakes.filter(s => s.y < canvas.height + s.size);
    snowflakes.forEach(s => {
        s.y += s.speed;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
    });
}

// Format energy numbers with appropriate suffixes
function formatEnergy(number) {
    const suffixes = [
        { threshold: 1e12, suffix: 'trillion' },
        { threshold: 1e9, suffix: 'billion' },
        { threshold: 1e6, suffix: 'million' },
        { threshold: 1e3, suffix: 'thousand' },
        { threshold: 1, suffix: '' }
    ];

    for (let i = 0; i < suffixes.length; i++) {
        if (number >= suffixes[i].threshold) {
            const value = number / suffixes[i].threshold;
            return value % 1 === 0 ? `${value} ${suffixes[i].suffix}` : `${value.toFixed(1)} ${suffixes[i].suffix}`;
        }
    }
    return number.toString();
}

function createStaticStars(count) {
    const container = document.getElementById('game-container');
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.floor(Math.random() * 4) + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        const maxWidth = container.offsetWidth;
        star.style.left = `${Math.random() * maxWidth}px`;
        star.style.top = `${Math.random() * container.offsetHeight}px`;
        container.appendChild(star);
    }
}

function updatePlanet() {
    const planetDiv = document.getElementById('planet');
    const planetNameDiv = document.getElementById('planet-name');
    const unlockButton = document.getElementById('unlock-button');
    const priceInfo = document.getElementById('price-info');
    const lockOverlay = document.querySelector('.lock-overlay');
    const energyDisplay = document.getElementById('energy');
    const navButtons = document.querySelectorAll('.nav-button');
    const currentPlanet = planets[currentPlanetIndex];

    // Make sure the first planet is unlocked
    if (currentPlanetIndex === 0) {
        planets[0].unlocked = true;
    }

    planetDiv.style.backgroundImage = `url('${currentPlanet.image}')`;
    planetDiv.style.boxShadow = `0 0 20px ${currentPlanet.shadowColor}`;
    planetDiv.style.borderColor = currentPlanet.shadowColor;

    energyDisplay.style.color = currentPlanet.shadowColor;
    energyDisplay.style.textShadow = `0 0 10px ${currentPlanet.shadowColor}`;

    navButtons.forEach(button => {
        button.style.color = currentPlanet.shadowColor;
        button.style.textShadow = `0 0 5px ${currentPlanet.shadowColor}`;
    });

    planetNameDiv.textContent = currentPlanet.name;
    planetNameDiv.style.color = currentPlanet.textShadow;
    planetNameDiv.style.textShadow = `0 0 5px ${currentPlanet.textShadow}`;

    if (!currentPlanet.unlocked) {
        planetDiv.classList.add('locked');
        unlockButton.style.display = 'block';
        priceInfo.style.display = 'block';
        lockOverlay.style.display = 'block';
        unlockButton.textContent = 'BUY';
        priceInfo.textContent = `PRICE: ${formatEnergy(currentPlanet.price)} ENERGY`;
        unlockButton.disabled = energy < currentPlanet.price;
        unlockButton.style.color = currentPlanet.shadowColor;
        priceInfo.style.color = currentPlanet.shadowColor;
        priceInfo.style.textShadow = `0 0 5px ${currentPlanet.shadowColor}`;
        unlockButton.onclick = () => {
            if (energy >= currentPlanet.price) {
                energy -= currentPlanet.price;
                currentPlanet.unlocked = true;
                energyCollected(0);
                updatePlanet();
                if (isSoundOn) {
                    successAudio.currentTime = 0;
                    successAudio.play().catch(error => console.log("Error playing success sound:", error));
                }
            }
        };
    } else {
        planetDiv.classList.remove('locked');
        unlockButton.style.display = 'none';
        priceInfo.style.display = 'none';
        lockOverlay.style.display = 'none';
    }
}

function showPlusOne(event) {
    const planet = document.getElementById('planet');
    if (!planets[currentPlanetIndex].unlocked) return;
    
    const plusOne = document.createElement('div');
    plusOne.className = 'plus-one';
    plusOne.textContent = `+${Math.round(energyPerClick)}`;
    
    // Calculate position relative to the planet
    const rect = planet.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    plusOne.style.left = `${x}px`;
    plusOne.style.top = `${y}px`;
    planet.appendChild(plusOne);
    
    plusOne.addEventListener('animationend', () => plusOne.remove());
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

const throttledUpdate = throttle(() => {
    updateShop();
    updatePlanet();
}, 100);

function saveGame() {
    const gameState = {
        energy,
        energyPerClick,
        nanoBotHarvesterLevel,
        nanoBotEnergyPerSecond,
        solarCollectorLevel,
        lunarBioDomeLevel,
        stellarWindTurbineLevel,
        galacticEnergyForgeLevel,
        currentPlanetIndex,
        planets: planets.map(p => ({ ...p }))
    };
    sessionStorage.setItem('planetClickerSave', JSON.stringify(gameState));
}

function loadGame() {
    const savedState = sessionStorage.getItem('planetClickerSave');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        energy = gameState.energy;
        energyPerClick = gameState.energyPerClick;
        nanoBotHarvesterLevel = gameState.nanoBotHarvesterLevel;
        nanoBotEnergyPerSecond = gameState.nanoBotEnergyPerSecond;
        solarCollectorLevel = gameState.solarCollectorLevel;
        lunarBioDomeLevel = gameState.lunarBioDomeLevel;
        stellarWindTurbineLevel = gameState.stellarWindTurbineLevel;
        galacticEnergyForgeLevel = gameState.galacticEnergyForgeLevel;
        currentPlanetIndex = gameState.currentPlanetIndex;
        planets.forEach((planet, index) => {
            if (index < gameState.planets.length) {
                planet.unlocked = gameState.planets[index].unlocked;
            }
        });
    }
    
    // Always ensure the first planet is unlocked
    planets[0].unlocked = true;
}

function energyCollected(amount) {
    energy += amount;
    document.getElementById('energy').textContent = `${formatEnergy(Math.floor(energy))} ENERGY`;
    throttledUpdate();
    saveGame();
}

function getPriceMultiplier() {
    return 1 + currentPlanetIndex;
}

// Track last shop state to prevent unnecessary updates
let lastShopState = '';

// Update the shop display with current items and prices
function updateShop() {
    const shopItems = document.getElementById('shop-items');
    const priceMultiplier = getPriceMultiplier();

    const clickPowerCost = 40 * energyPerClick * priceMultiplier;
    const clickPowerGain = energyPerClick * 2;
    const nanoBotBaseGain = 1 * (currentPlanetIndex + 1);
    const nanoBotCost = 75 * (nanoBotHarvesterLevel + 1) * priceMultiplier;
    const nanoBotGain = nanoBotBaseGain * (nanoBotHarvesterLevel + 1);
    const solarBaseGain = 10 * (currentPlanetIndex + 1);
    const solarCollectorCost = 500 * (solarCollectorLevel + 1) * priceMultiplier;
    const solarGain = solarBaseGain * (solarCollectorLevel + 1);
    const lunarBaseGain = 120 * (currentPlanetIndex + 1);
    const lunarBioDomeCost = 1000 * (lunarBioDomeLevel + 1) * priceMultiplier;
    const lunarGain = lunarBaseGain * (lunarBioDomeLevel + 1);
    const stellarBaseGain = 1000 * (currentPlanetIndex + 1);
    const stellarWindTurbineCost = 10000 * (stellarWindTurbineLevel + 1) * priceMultiplier;
    const stellarGain = stellarBaseGain * (stellarWindTurbineLevel + 1);
    const galacticBaseGain = 5000 * (currentPlanetIndex + 1);
    const galacticEnergyForgeCost = 30000 * (galacticEnergyForgeLevel + 1) * priceMultiplier;
    const galacticGain = galacticBaseGain * (galacticEnergyForgeLevel + 1);

    // Check if shop state has changed to avoid unnecessary DOM updates
    const shopState = `${clickPowerCost}-${nanoBotCost}-${solarCollectorCost}-${lunarBioDomeCost}-${stellarWindTurbineCost}-${galacticEnergyForgeCost}-${energy}`;
    if (shopState === lastShopState) return;
    lastShopState = shopState;

    // First 2 features are always unlocked, rest are locked based on energy
    const clickPowerLocked = false; // Always unlocked
    const nanoBotLocked = false; // Always unlocked
    const solarCollectorLocked = energy < solarCollectorCost;
    const lunarBioDomeLocked = energy < lunarBioDomeCost;
    const stellarWindTurbineLocked = energy < stellarWindTurbineCost;
    const galacticEnergyForgeLocked = energy < galacticEnergyForgeCost;

    shopItems.innerHTML = `
        <div class="shop-item">
            <div class="item-icon"><i class="fas fa-bolt"></i></div>
            <div class="item-name">2X Click Power</div>
            <div class="item-details">+${clickPowerGain.toLocaleString()} Energy/click</div>
            <button id="buy-click-power" ${energy < clickPowerCost ? 'disabled' : ''}>
                ${clickPowerCost + ' Energy'}
            </button>
        </div>
        <div class="shop-item">
            <div class="item-icon"><i class="fas fa-robot"></i></div>
            <div class="item-name">Nano-Bot Harvester</div>
            <div class="item-details">+${nanoBotGain.toLocaleString()} Energy/s</div>
            <button id="buy-nano-bot" ${energy < nanoBotCost ? 'disabled' : ''}>
                ${nanoBotCost + ' Energy'}
            </button>
        </div>
        <div class="shop-item ${solarCollectorLocked ? 'locked' : ''}">
            <div class="item-icon"><i class="fas fa-solar-panel"></i></div>
            <div class="item-name">${solarCollectorLocked ? '???' : 'Solar Energy Collector'}</div>
            <div class="item-details">${solarCollectorLocked ? '??? ???/s' : `+${solarGain.toLocaleString()} Energy/s`}</div>
            <button id="buy-solar-collector" ${solarCollectorLocked ? 'disabled' : ''}>
                ${solarCollectorCost + ' Energy'}
            </button>
        </div>
        <div class="shop-item ${lunarBioDomeLocked ? 'locked' : ''}">
            <div class="item-icon"><i class="fas fa-leaf"></i></div>
            <div class="item-name">${lunarBioDomeLocked ? '???' : 'Lunar Bio-Dome'}</div>
            <div class="item-details">${lunarBioDomeLocked ? '??? ???/s' : `+${lunarGain.toLocaleString()} Energy/s`}</div>
            <button id="buy-lunar-biodome" ${lunarBioDomeLocked ? 'disabled' : ''}>
                ${lunarBioDomeCost + ' Energy'}
            </button>
        </div>
        <div class="shop-item ${stellarWindTurbineLocked ? 'locked' : ''}">
            <div class="item-icon"><i class="fas fa-wind"></i></div>
            <div class="item-name">${stellarWindTurbineLocked ? '???' : 'Stellar Wind Turbine'}</div>
            <div class="item-details">${stellarWindTurbineLocked ? '??? ???/s' : `+${stellarGain.toLocaleString()} Energy/s`}</div>
            <button id="buy-stellar-wind-turbine" ${stellarWindTurbineLocked ? 'disabled' : ''}>
                ${stellarWindTurbineCost + ' Energy'}
            </button>
        </div>
        <div class="shop-item ${galacticEnergyForgeLocked ? 'locked' : ''}">
            <div class="item-icon"><i class="fas fa-industry"></i></div>
            <div class="item-name">${galacticEnergyForgeLocked ? '???' : 'Galactic Energy Forge'}</div>
            <div class="item-details">${galacticEnergyForgeLocked ? '??? ???/s' : `+${galacticGain.toLocaleString()} Energy/s`}</div>
            <button id="buy-galactic-forge" ${galacticEnergyForgeLocked ? 'disabled' : ''}>
                ${galacticEnergyForgeCost + ' Energy'}
            </button>
        </div>`;

    // Add event listeners for shop items
    document.getElementById('buy-click-power').addEventListener('click', () => {
        if (energy >= clickPowerCost) {
            energy -= clickPowerCost;
            energyPerClick *= 2;
            energyCollected(0);
        }
    });

    document.getElementById('buy-nano-bot').addEventListener('click', () => {
        if (energy >= nanoBotCost) {
            energy -= nanoBotCost;
            nanoBotHarvesterLevel += 1;
            nanoBotEnergyPerSecond = nanoBotBaseGain * nanoBotHarvesterLevel;
            energyCollected(0);
        }
    });

    document.getElementById('buy-solar-collector').addEventListener('click', () => {
        if (energy >= solarCollectorCost) {
            energy -= solarCollectorCost;
            solarCollectorLevel += 1;
            energyCollected(0);
        }
    });

    document.getElementById('buy-lunar-biodome').addEventListener('click', () => {
        if (energy >= lunarBioDomeCost) {
            energy -= lunarBioDomeCost;
            lunarBioDomeLevel += 1;
            energyCollected(0);
        }
    });

    document.getElementById('buy-stellar-wind-turbine').addEventListener('click', () => {
        if (energy >= stellarWindTurbineCost) {
            energy -= stellarWindTurbineCost;
            stellarWindTurbineLevel += 1;
            energyCollected(0);
        }
    });

    document.getElementById('buy-galactic-forge').addEventListener('click', () => {
        if (energy >= galacticEnergyForgeCost) {
            energy -= galacticEnergyForgeCost;
            galacticEnergyForgeLevel += 1;
            energyCollected(0);
        }
    });
}

function startAutoClickInterval() {
    if (autoClickInterval) clearInterval(autoClickInterval);
    autoClickInterval = setInterval(() => {
        const nanoBotGain = (1 * (currentPlanetIndex + 1)) * nanoBotHarvesterLevel;
        const solarGain = (10 * (currentPlanetIndex + 1)) * solarCollectorLevel;
        const lunarGain = (120 * (currentPlanetIndex + 1)) * lunarBioDomeLevel;
        const stellarGain = (1000 * (currentPlanetIndex + 1)) * stellarWindTurbineLevel;
        const galacticGain = (5000 * (currentPlanetIndex + 1)) * galacticEnergyForgeLevel;
        
        const totalAutoEnergy = (nanoBotGain + solarGain + lunarGain + stellarGain + galacticGain) * 2;
        if (totalAutoEnergy > 0) {
            energyCollected(totalAutoEnergy);
        }
    }, 2000);
}

// Initialize the game when the window loads
window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Preload images for smoother gameplay
    const preloadImages = ['earth.png', '1.png', '2.png', '3.png', '4.png'];
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Preload audio files
    const preloadAudios = ['space-ambience.mp3', 'sci-fi-button-click.mp3', 'success-sound.mp3'];
    preloadAudios.forEach(src => {
        const audio = new Audio();
        audio.src = src;
    });

    // Remove loading screen as soon as possible
    loadingScreen.style.display = 'none';
    
    // Initialize game state and UI
    loadGame();
    setupCanvas();
    createStaticStars(50);
    updatePlanet();
    updateShop();

    // Start background music if sound is enabled
    if (isSoundOn) {
        spaceAudio.play().catch(error => {
            console.log("Error playing space audio on load:", error);
            console.log("Autoplay might be blocked by the browser. Please interact with the page to enable sound.");
        });
    }

    // Setup sound toggle button
    const toggleSoundButton = document.getElementById('toggle-sound');
    toggleSoundButton.innerHTML = '<i class="fas fa-volume-up"></i>';

    // Setup planet click handler
    const planet = document.getElementById('planet');
    const energyDisplay = document.getElementById('energy');

    // Remove any existing click listeners
    planet.replaceWith(planet.cloneNode(true));
    
    // Get the new planet element reference
    const newPlanet = document.getElementById('planet');
    
    // Add click event listener with debugging
    newPlanet.addEventListener('click', (event) => {
        console.log("Planet clicked!");
        console.log("Current planet unlocked:", planets[currentPlanetIndex].unlocked);
        
        if (!planets[currentPlanetIndex].unlocked) {
            console.log("Planet is locked, returning without action");
            return;
        }
        
        console.log("Processing click...");
        energy += energyPerClick;
        energyDisplay.textContent = `${formatEnergy(Math.floor(energy))} ENERGY`;
        showPlusOne(event);
        if (isSoundOn) {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(error => console.log("Error playing click sound:", error));
        }
        energyCollected(0);
        console.log("Click processed, new energy:", energy);
    });

    // Planet navigation buttons
    const prevButton = document.getElementById('prev-planet');
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentPlanetIndex = (currentPlanetIndex - 1 + planets.length) % planets.length;
            updatePlanet();
            updateShop();
        });
    }

    const nextButton = document.getElementById('next-planet');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
            updatePlanet();
            updateShop();
        });
    }

    // Setup sound toggle
    toggleSoundButton.addEventListener('click', () => {
        isSoundOn = !isSoundOn;
        if (isSoundOn) {
            spaceAudio.play().catch(error => console.log("Error playing space audio:", error));
            toggleSoundButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            clickAudio.muted = false;
            successAudio.muted = false;
        } else {
            spaceAudio.pause();
            toggleSoundButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            clickAudio.muted = true;
            successAudio.muted = true;
        }
    });

    // Handle visibility changes (pause/resume game)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(autoClickInterval);
        } else {
            startAutoClickInterval();
        }
    });

    // Start auto-click interval for passive income
    startAutoClickInterval();
};