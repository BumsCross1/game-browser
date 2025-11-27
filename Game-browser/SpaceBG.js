const canvas = document.getElementById('spaceBg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Partikel-System
class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speed = Math.random() * 2 + 0.5;
        this.brightness = Math.random() * 100 + 50;
        this.twinkleSpeed = Math.random() * 0.05 + 0.01;
        this.twinkleOffset = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.reset();
            this.y = 0;
        }
        
        // Twinkling effect
        this.brightness = 50 + Math.sin(Date.now() * this.twinkleSpeed + this.twinkleOffset) * 50;
    }
    
    draw() {
        ctx.fillStyle = `hsla(0, 0%, ${this.brightness}%, 0.8)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Planet class
class Planet {
    constructor() {
        this.reset();
        this.moons = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
        this.moonAngles = Array.from({length: this.moons}, () => Math.random() * Math.PI * 2);
        this.moonDistances = Array.from({length: this.moons}, () => this.radius * (1.5 + Math.random() * 1));
        this.moonSizes = Array.from({length: this.moons}, () => this.radius * (0.2 + Math.random() * 0.3));
    }
    
    reset() {
        this.radius = Math.random() * 80 + 20;
        this.x = -this.radius;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 0.3 + 0.1;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.hasRings = Math.random() > 0.7;
        this.ringColor = `hsl(${Math.random() * 360}, 60%, 70%)`;
    }
    
    update() {
        this.x += this.speed;
        this.rotation += this.rotationSpeed;
        
        if (this.x > canvas.width + this.radius) {
            this.reset();
        }
        
        // Moon angles
        this.moonAngles = this.moonAngles.map(angle => angle + 0.02);
    }
    
    draw() {
        // Planet
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Planet glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 1.2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Planet body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Rings
        if (this.hasRings) {
            ctx.strokeStyle = this.ringColor;
            ctx.lineWidth = this.radius * 0.3;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Moons
        for (let i = 0; i < this.moons; i++) {
            const moonX = Math.cos(this.moonAngles[i]) * this.moonDistances[i];
            const moonY = Math.sin(this.moonAngles[i]) * this.moonDistances[i];
            
            ctx.fillStyle = '#cccccc';
            ctx.beginPath();
            ctx.arc(moonX, moonY, this.moonSizes[i], 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Shooting stars
class ShootingStar {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.3;
        this.speedX = Math.random() * 10 + 5;
        this.speedY = Math.random() * 10 + 5;
        this.size = Math.random() * 2 + 1;
        this.length = Math.random() * 50 + 20;
        this.active = false;
        this.timer = Math.random() * 300 + 100;
    }
    
    update() {
        this.timer--;
        if (this.timer <= 0 && !this.active) {
            this.active = true;
        }
        
        if (this.active) {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.y > canvas.height) {
                this.reset();
            }
        }
    }
    
    draw() {
        if (!this.active) return;
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length, this.y - this.length * 0.5);
        ctx.stroke();
        
        // Glow effect
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = this.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length * 0.7, this.y - this.length * 0.35);
        ctx.stroke();
    }
}

// Create objects
const stars = Array.from({length: 400}, () => new Particle());
const planets = Array.from({length: 8}, () => new Planet());
const shootingStars = Array.from({length: 5}, () => new ShootingStar());

// Nebula background
function drawNebula() {
    const gradient = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.3, 0,
        canvas.width * 0.7, canvas.height * 0.3, canvas.width * 0.8
    );
    gradient.addColorStop(0, 'hsla(270, 60%, 20%, 0.1)');
    gradient.addColorStop(0.5, 'hsla(200, 60%, 15%, 0.05)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(5, 5, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawNebula();
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    planets.forEach(planet => {
        planet.update();
        planet.draw();
    });
    
    shootingStars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});