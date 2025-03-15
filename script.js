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

let currentPlanetIndex = 0;
let energy = 0;
let energyPerClick = 1;
let nanoBotHarvesterLevel = 0;
let nanoBotEnergyPerSecond = 0;
let solarCollectorLevel = 0;
let lunarBioDomeLevel = 0;
let stellarWindTurbineLevel = 0;
let galacticEnergyForgeLevel = 0;
let isMeteorShowerActive = false;
let isSoundOn = true;
let meteorInterval = null;
let autoClickInterval = null;
const spaceAudio = document.getElementById('space-audio');
const clickAudio = document.getElementById('click-audio');
const successAudio = document.getElementById('success-audio');

// Canvas setup cho hiệu ứng tuyết rơi
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

function startMeteorShower() {
    if (isMeteorShowerActive && !meteorInterval) {
        const baseInterval = 1000;
        const intervalIncrease = currentPlanetIndex * 300;
        const intervalTime = baseInterval + intervalIncrease;

        meteorInterval = setInterval(() => {
            if (snowflakes.length < 20) {
                createSnowflakeCanvas();
            }
        }, intervalTime);

        setInterval(drawSnowflakes, 16);
        console.log(`Meteor Shower started with interval: ${intervalTime}ms`);
    }
}

function stopMeteorShower() {
    if (meteorInterval) {
        clearInterval(meteorInterval);
        meteorInterval = null;
        snowflakes = [];
        console.log('Meteor Shower stopped');
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
        isMeteorShowerActive,
        currentPlanetIndex,
        planets: planets.map(p => ({ ...p }))
    };
    //localStorage.setItem('planetClickerSave', JSON.stringify(gameState));
    sessionStorage.setItem('planetClickerSave', JSON.stringify(gameState));
}

function loadGame() {
    //const savedState = localStorage.getItem('planetClickerSave');
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
        isMeteorShowerActive = gameState.isMeteorShowerActive;
        currentPlanetIndex = gameState.currentPlanetIndex;
        planets.forEach((planet, index) => {
            planet.unlocked = gameState.planets[index].unlocked;
        });
    }
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

let lastShopState = '';

function updateShop() {
    const shopItems = document.getElementById('shop-items');
    const priceMultiplier = getPriceMultiplier();

    const meteorShowerCost = 500 * priceMultiplier;
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

    const shopState = `${meteorShowerCost}-${clickPowerCost}-${nanoBotCost}-${solarCollectorCost}-${lunarBioDomeCost}-${stellarWindTurbineCost}-${galacticEnergyForgeCost}-${energy}`;
    if (shopState === lastShopState) return;
    lastShopState = shopState;

    shopItems.innerHTML = `
        <div class="shop-item">
            <div class="item-name"><i class="fas fa-meteor"></i> Cosmic Meteor Shower</div>
            <div class="item-details">${isMeteorShowerActive ? 'Active' : meteorShowerCost.toLocaleString() + ' Energy'}</div>
            <button id="buy-meteor-shower" ${isMeteorShowerActive || energy < meteorShowerCost ? 'disabled' : ''}>
                ${isMeteorShowerActive ? 'Active' : 'Buy'}
            </button>
        </div>
        <div class="shop-item">
            <div class="item-name"><i class="fas fa-bolt"></i> 2X Click Power</div>
            <div class="item-details">[x${energyPerClick}] +${clickPowerGain.toLocaleString()} Energy/click</div>
            <button id="buy-click-power" ${energy < clickPowerCost ? 'disabled' : ''}>${clickPowerCost.toLocaleString()} Energy</button>
        </div>
        <div class="shop-item">
            <div class="item-name"><i class="fas fa-robot"></i> Nano-Bot Harvester</div>
            <div class="item-details">[${nanoBotHarvesterLevel}] +${nanoBotGain.toLocaleString()} Energy/s</div>
            <button id="buy-nano-bot" ${energy < nanoBotCost ? 'disabled' : ''}>${nanoBotCost.toLocaleString()} Energy</button>
        </div>
        <div class="shop-item">
            <div class="item-name"><i class="fas fa-solar-panel"></i> Solar Energy Collector</div>
            <div class="item-details">[${solarCollectorLevel}] +${solarGain.toLocaleString()} Energy/s</div>
            <button id="buy-solar-collector" ${energy < solarCollectorCost ? 'disabled' : ''}>${solarCollectorCost.toLocaleString()} Energy</button>
        </div>
        <div class="shop-item">
            <div class="item-name"><i class="fas fa-leaf"></i> Lunar Bio-Dome</div>
            <div class="item-details">[${lunarBioDomeLevel}] +${lunarGain.toLocaleString()} Energy/s</div>
            <button id="buy-lunar-biodome" ${energy < lunarBioDomeCost ? 'disabled' : ''}>${lunarBioDomeCost.toLocaleString()} Energy</button>
        </div>
        <div class="shop-item">
            <div class="item-name"><i class="fas fa-wind"></i> Stellar Wind Turbine</div>
            <div class="item-details">[${stellarWindTurbineLevel}] +${stellarGain.toLocaleString()} Energy/s</div>
            <button id="buy-stellar-wind-turbine" ${energy < stellarWindTurbineCost ? 'disabled' : ''}>${stellarWindTurbineCost.toLocaleString()} Energy</button>
        </div>
        <div class="shop-item">
            <div class="item-name"><i class="fas fa-industry"></i> Galactic Energy Forge</div>
            <div class="item-details">[${galacticEnergyForgeLevel}] +${galacticGain.toLocaleString()} Energy/s</div>
            <button id="buy-galactic-forge" ${energy < galacticEnergyForgeCost ? 'disabled' : ''}>${galacticEnergyForgeCost.toLocaleString()} Energy</button>
        </div>`;

    document.getElementById('buy-meteor-shower').addEventListener('click', () => {
        if (!isMeteorShowerActive && energy >= meteorShowerCost) {
            energy -= meteorShowerCost;
            isMeteorShowerActive = true;
            stopMeteorShower();
            startMeteorShower();
            energyCollected(0);
        }
    });

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
        energyCollected(totalAutoEnergy);
    }, 2000);
}

window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const preloadImages = ['earth.png'];
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    const preloadAudios = ['space-ambience.mp3', 'sci-fi-button-click.mp3', 'success-sound.mp3'];
    preloadAudios.forEach(src => {
        const audio = new Audio();
        audio.src = src;
    });

    Promise.all([]).then(() => {
        loadingScreen.style.display = 'none';
        loadGame();
        setupCanvas();
        createStaticStars(50);
        updatePlanet();

        if (isSoundOn) {
            spaceAudio.play().catch(error => {
                console.log("Error playing space audio on load:", error);
                console.log("Autoplay might be blocked by the browser. Please interact with the page to enable sound.");
            });
        }

        const toggleSoundButton = document.getElementById('toggle-sound');
        toggleSoundButton.innerHTML = '<i class="fas fa-volume-up"></i>';

        const planet = document.getElementById('planet');
        const energyDisplay = document.getElementById('energy');

        planet.addEventListener('click', (event) => {
            if (!planets[currentPlanetIndex].unlocked) return;
            energy += energyPerClick;
            energyDisplay.textContent = `${Math.floor(energy)} ENERGY`;
            showPlusOne(event);
            if (isSoundOn) {
                clickAudio.currentTime = 0;
                clickAudio.play().catch(error => console.log("Error playing click sound:", error));
            }
            energyCollected(0);
        });

        const prevButton = document.getElementById('prev-planet');
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentPlanetIndex = (currentPlanetIndex - 1 + planets.length) % planets.length;
                updatePlanet();
                updateShop();
            });
        } else {
            console.error('prev-planet button not found!');
        }

        const nextButton = document.getElementById('next-planet');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
                updatePlanet();
                updateShop();
            });
        } else {
            console.error('next-planet button not found!');
        }

        const shopModal = document.getElementById('shop-modal');
        const openShopButton = document.getElementById('open-shop');
        const closeShopButton = document.getElementById('close-shop');

        openShopButton.addEventListener('click', () => {
            shopModal.style.display = 'block';
            updateShop();
        });

        closeShopButton.addEventListener('click', () => {
            shopModal.style.display = 'none';
        });

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

        document.addEventListener('click', (event) => {
            if (shopModal.style.display === 'block' && !shopModal.contains(event.target) && event.target !== openShopButton) {
                shopModal.style.display = 'none';
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopMeteorShower();
                clearInterval(autoClickInterval);
            } else {
                startMeteorShower();
                startAutoClickInterval();
            }
        });

        startAutoClickInterval();
    });
};