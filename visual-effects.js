// Space Visual Effects - Meteors, Shooting Stars, and Milestone Celebrations

// Track previous energy for milestone detection
let previousEnergy = 0;

// Configuration for visual effects
const spaceEffects = {
    shootingStar: {
        minSize: 2,
        maxSize: 4,
        minSpeed: 15,
        maxSpeed: 25,
        tailLength: 150,
        frequency: 0.05, // chance per frame
        color: '#ffffff'
    },
    meteor: {
        minSize: 6,
        maxSize: 12,
        minSpeed: 5,
        maxSpeed: 12,
        tailLength: 30,
        frequency: 0.02, // chance per frame
        color: '#ff5500'
    },
    energyMilestones: [
        { threshold: 1000, effect: 'shootingStarShower' },
        { threshold: 10000, effect: 'meteorShower' },
        { threshold: 100000, effect: 'cosmicExplosion' },
        { threshold: 1000000, effect: 'galaxyBurst' },
        { threshold: 10000000, effect: 'supernova' }
    ]
};

// Arrays to store active space objects
let shootingStars = [];
let meteors = [];
let specialEffects = [];

// Initialize space effects
function initSpaceEffects() {
    // Get canvas context if not already available
    if (!ctx) {
        const canvas = document.getElementById('effects-canvas');
        ctx = canvas.getContext('2d');
    }
    
    // Reset canvas dimensions on window resize
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('effects-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Start animation loop if not already running
    if (!window.spaceEffectsInterval) {
        window.spaceEffectsInterval = setInterval(updateSpaceEffects, 30);
    }
    
    // Set initial energy for milestone detection
    previousEnergy = energy;
}

// Create a shooting star
function createShootingStar() {
    const canvas = document.getElementById('effects-canvas');
    const size = Math.random() * (spaceEffects.shootingStar.maxSize - spaceEffects.shootingStar.minSize) + spaceEffects.shootingStar.minSize;
    const speed = Math.random() * (spaceEffects.shootingStar.maxSpeed - spaceEffects.shootingStar.minSpeed) + spaceEffects.shootingStar.minSpeed;
    const angle = Math.PI / 4 + (Math.random() * Math.PI / 4); // Angle between 45 and 90 degrees
    
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: 0,
        size: size,
        speed: speed,
        angle: angle,
        tailLength: spaceEffects.shootingStar.tailLength,
        color: spaceEffects.shootingStar.color,
        opacity: 1
    });
}

// Create a meteor
function createMeteor() {
    const canvas = document.getElementById('effects-canvas');
    const size = Math.random() * (spaceEffects.meteor.maxSize - spaceEffects.meteor.minSize) + spaceEffects.meteor.minSize;
    const speed = Math.random() * (spaceEffects.meteor.maxSpeed - spaceEffects.meteor.minSpeed) + spaceEffects.meteor.minSpeed;
    const angle = Math.PI / 4 + (Math.random() * Math.PI / 2); // Varied angles
    
    meteors.push({
        x: Math.random() * canvas.width,
        y: 0,
        size: size,
        speed: speed,
        angle: angle,
        tailLength: spaceEffects.meteor.tailLength,
        color: spaceEffects.meteor.color,
        opacity: 1,
        rotation: Math.random() * Math.PI * 2
    });
}

// Create a shooting star shower
function createShootingStarShower() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createShootingStar();
        }, i * 200); // Stagger creation
    }
}

// Create a meteor shower
function createMeteorShower() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createMeteor();
        }, i * 300); // Stagger creation
    }
}

// Create a cosmic explosion effect
function createCosmicExplosion() {
    const canvas = document.getElementById('effects-canvas');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const speed = Math.random() * 5 + 2;
        
        specialEffects.push({
            type: 'particle',
            x: centerX,
            y: centerY,
            targetX: centerX + Math.cos(angle) * distance,
            targetY: centerY + Math.sin(angle) * distance,
            size: Math.random() * 4 + 2,
            speed: speed,
            color: `hsl(${Math.random() * 60 + 200}, 100%, 70%)`,
            opacity: 1,
            life: 100
        });
    }
}

// Create a galaxy burst effect
function createGalaxyBurst() {
    const canvas = document.getElementById('effects-canvas');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 200 + 100;
        const speed = Math.random() * 3 + 1;
        
        specialEffects.push({
            type: 'spiral',
            x: centerX,
            y: centerY,
            angle: angle,
            distance: Math.random() * 50,
            maxDistance: distance,
            size: Math.random() * 3 + 1,
            speed: speed,
            color: `hsl(${Math.random() * 360}, 100%, 70%)`,
            opacity: 1,
            life: 200
        });
    }
}

// Create a supernova effect
function createSupernova() {
    const canvas = document.getElementById('effects-canvas');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create expanding ring
    specialEffects.push({
        type: 'ring',
        x: centerX,
        y: centerY,
        radius: 10,
        maxRadius: Math.min(canvas.width, canvas.height) * 0.8,
        speed: 5,
        width: 5,
        color: '#ffffff',
        opacity: 1,
        life: 100
    });
    
    // Create particles
    for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 300 + 100;
        const speed = Math.random() * 4 + 2;
        
        specialEffects.push({
            type: 'particle',
            x: centerX,
            y: centerY,
            targetX: centerX + Math.cos(angle) * distance,
            targetY: centerY + Math.sin(angle) * distance,
            size: Math.random() * 5 + 2,
            speed: speed,
            color: `hsl(${Math.random() * 60}, 100%, ${Math.random() * 30 + 70}%)`,
            opacity: 1,
            life: 150
        });
    }
}

// Update and draw all space effects
function updateSpaceEffects() {
    const canvas = document.getElementById('effects-canvas');
    if (!canvas || !ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Check for energy milestone
    checkEnergyMilestones();
    
    // Randomly create new space objects
    if (Math.random() < spaceEffects.shootingStar.frequency) {
        createShootingStar();
    }
    
    if (Math.random() < spaceEffects.meteor.frequency) {
        createMeteor();
    }
    
    // Update and draw shooting stars
    updateAndDrawShootingStars();
    
    // Update and draw meteors
    updateAndDrawMeteors();
    
    // Update and draw special effects
    updateAndDrawSpecialEffects();
    
    // Update previous energy
    previousEnergy = energy;
}

// Update and draw shooting stars
function updateAndDrawShootingStars() {
    shootingStars = shootingStars.filter(star => {
        // Update position
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        
        // Draw tail (line)
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        const tailX = star.x - Math.cos(star.angle) * star.tailLength;
        const tailY = star.y - Math.sin(star.angle) * star.tailLength;
        ctx.lineTo(tailX, tailY);
        
        // Create gradient for tail
        const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.size / 2;
        ctx.stroke();
        
        // Draw star (circle)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Remove if off screen
        if (star.y > canvas.height || star.x > canvas.width || star.x < 0) {
            return false;
        }
        
        return true;
    });
}

// Update and draw meteors
function updateAndDrawMeteors() {
    meteors = meteors.filter(meteor => {
        // Update position
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.rotation += 0.05;
        
        // Draw tail (triangle)
        ctx.save();
        ctx.translate(meteor.x, meteor.y);
        
        // Draw tail
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const tailX = -Math.cos(meteor.angle) * meteor.tailLength;
        const tailY = -Math.sin(meteor.angle) * meteor.tailLength;
        const perpX = -Math.sin(meteor.angle) * meteor.size;
        const perpY = Math.cos(meteor.angle) * meteor.size;
        ctx.lineTo(tailX + perpX/2, tailY + perpY/2);
        ctx.lineTo(tailX - perpX/2, tailY - perpY/2);
        ctx.closePath();
        
        // Create gradient for tail
        const gradient = ctx.createLinearGradient(0, 0, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 100, 0, ${meteor.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw meteor (circle)
        ctx.beginPath();
        ctx.arc(0, 0, meteor.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 100, ${meteor.opacity})`;
        ctx.fill();
        
        ctx.restore();
        
        // Remove if off screen
        if (meteor.y > canvas.height || meteor.x > canvas.width || meteor.x < 0) {
            return false;
        }
        
        return true;
    });
}

// Update and draw special effects
function updateAndDrawSpecialEffects() {
    specialEffects = specialEffects.filter(effect => {
        effect.life--;
        
        if (effect.type === 'particle') {
            // Calculate current position
            const progress = 1 - (effect.life / 100);
            effect.x = effect.x + (effect.targetX - effect.x) * effect.speed / 20;
            effect.y = effect.y + (effect.targetY - effect.y) * effect.speed / 20;
            effect.opacity = 1 - progress;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
            ctx.fillStyle = effect.color.replace(')', `, ${effect.opacity})`).replace('rgb', 'rgba');
            ctx.fill();
        } 
        else if (effect.type === 'spiral') {
            // Calculate current position
            effect.angle += effect.speed / 20;
            effect.distance += effect.speed;
            if (effect.distance > effect.maxDistance) {
                effect.distance = effect.maxDistance;
            }
            
            const x = effect.x + Math.cos(effect.angle) * effect.distance;
            const y = effect.y + Math.sin(effect.angle) * effect.distance;
            effect.opacity = 1 - (effect.life / 200);
            
            // Draw spiral particle
            ctx.beginPath();
            ctx.arc(x, y, effect.size, 0, Math.PI * 2);
            ctx.fillStyle = effect.color.replace(')', `, ${effect.opacity})`).replace('rgb', 'rgba').replace('hsl', 'hsla');
            ctx.fill();
        }
        else if (effect.type === 'ring') {
            // Update ring
            effect.radius += effect.speed;
            effect.opacity = 1 - (effect.radius / effect.maxRadius);
            
            // Draw ring
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            ctx.strokeStyle = effect.color.replace(')', `, ${effect.opacity})`).replace('rgb', 'rgba');
            ctx.lineWidth = effect.width;
            ctx.stroke();
        }
        
        return effect.life > 0;
    });
}

// Check for energy milestones
function checkEnergyMilestones() {
    spaceEffects.energyMilestones.forEach(milestone => {
        // If we just crossed a milestone
        if (previousEnergy < milestone.threshold && energy >= milestone.threshold) {
            console.log(`Milestone reached: ${milestone.threshold}`);
            
            // Trigger the appropriate effect
            switch (milestone.effect) {
                case 'shootingStarShower':
                    createShootingStarShower();
                    break;
                case 'meteorShower':
                    createMeteorShower();
                    break;
                case 'cosmicExplosion':
                    createCosmicExplosion();
                    break;
                case 'galaxyBurst':
                    createGalaxyBurst();
                    break;
                case 'supernova':
                    createSupernova();
                    break;
            }
            
            // Show milestone notification
            showMilestoneNotification(milestone.threshold);
        }
    });
}

// Show milestone notification
function showMilestoneNotification(milestone) {
    const container = document.createElement('div');
    container.className = 'milestone-notification';
    container.innerHTML = `
        <div class="milestone-icon"><i class="fas fa-trophy"></i></div>
        <div class="milestone-text">Energy Milestone: ${formatEnergy(milestone)}</div>
    `;
    
    document.body.appendChild(container);
    
    // Remove after animation
    setTimeout(() => {
        container.classList.add('hide');
        setTimeout(() => {
            container.remove();
        }, 1000);
    }, 4000);
}

// Call this function when the window loads to initialize effects
window.addEventListener('load', initSpaceEffects);