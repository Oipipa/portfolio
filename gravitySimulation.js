document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');

    let NUM_PARTICLES = 8000;
    let G = 1;
    let CENTRAL_MASS = 50000;
    const BLACK_HOLE_MASS_INITIAL = 100000;
    let BLACK_HOLE_MASS = BLACK_HOLE_MASS_INITIAL;
    const HALO_MASS = 300000;
    const PARTICLE_MASS = 1.0;
    const TIME_STEP = 0.1;
    const ACCRETION_DISK_RADIUS = 50;
    const ACCRETION_RADIUS = 5;

    class Particle {
        constructor(x, y, vx, vy, mass = PARTICLE_MASS, color = 'white') {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.ax = 0;
            this.ay = 0;
            this.mass = mass;
            this.color = color;
        }

        applyForce(fx, fy) {
            this.ax += fx / this.mass;
            this.ay += fy / this.mass;
        }

        update() {
            this.vx += this.ax * TIME_STEP;
            this.vy += this.ay * TIME_STEP;
            this.x += this.vx * TIME_STEP;
            this.y += this.vy * TIME_STEP;
            this.ax = 0;
            this.ay = 0;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI);
            ctx.fill();
        }

        distanceToCenter() {
            const dx = this.x - canvas.width / 2;
            const dy = this.y - canvas.height / 2;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    function calculateGravity(particle) {
        const dx = canvas.width / 2 - particle.x;
        const dy = canvas.height / 2 - particle.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < 1) return [0, 0]; // Prevent division by zero

        let force;
        if (dist < ACCRETION_DISK_RADIUS) {
            force = G * BLACK_HOLE_MASS * particle.mass / distSq;
        } else {
            const bulge_mass = CENTRAL_MASS * (dist / (dist + 10));
            const halo_mass = HALO_MASS * (Math.log(1 + dist / 20) - (dist / 20) / (1 + dist / 20));
            const total_mass = bulge_mass + halo_mass + BLACK_HOLE_MASS;
            force = G * total_mass * particle.mass / distSq;
        }

        const fx = force * dx / dist;
        const fy = force * dy / dist;

        return [fx, fy];
    }

    function initialVelocity(x, y, mass) {
        const dx = x - canvas.width / 2;
        const dy = y - canvas.height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist === 0) return [0, 0];

        let velocity;
        if (dist < ACCRETION_DISK_RADIUS) {
            velocity = Math.sqrt(G * BLACK_HOLE_MASS / dist);
        } else {
            const bulge_mass = CENTRAL_MASS * (dist / (dist + 10));
            const halo_mass = HALO_MASS * (Math.log(1 + dist / 20) - (dist / 20) / (1 + dist / 20));
            const total_mass = bulge_mass + halo_mass + BLACK_HOLE_MASS;
            velocity = Math.sqrt(G * total_mass / dist);
        }

        const angle = Math.atan2(dy, dx);
        const vx = -velocity * Math.sin(angle);
        const vy = velocity * Math.cos(angle);

        return [vx, vy];
    }

    function updateParticle(particle) {
        const [fx, fy] = calculateGravity(particle);
        particle.applyForce(fx, fy);

        const distance_to_center = particle.distanceToCenter();

        if (distance_to_center < ACCRETION_RADIUS) {
            BLACK_HOLE_MASS += particle.mass;
            particles = particles.filter(p => p !== particle);
        } else {
            if (distance_to_center < ACCRETION_DISK_RADIUS) {
                particle.vx *= 0.99;
                particle.vy *= 0.99;
            }

            const brightness = Math.min(255, 255 * (ACCRETION_DISK_RADIUS / distance_to_center));
            particle.color = `rgb(${brightness}, ${brightness}, ${brightness})`;

            particle.update();
        }
    }

    let particles = [];

    function generateParticles() {
        particles = [];
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const r = randomGaussian(100, 100);
            const theta = Math.random() * 2 * Math.PI;

            const x = canvas.width / 2 + r * Math.cos(theta);
            const y = canvas.height / 2 + r * Math.sin(theta);

            const [vx, vy] = initialVelocity(x, y, PARTICLE_MASS);

            let color = 'white';
            if (r < ACCRETION_DISK_RADIUS) {
                color = 'rgb(255, 100, 100)';
            }

            particles.push(new Particle(x, y, vx, vy, PARTICLE_MASS, color));
        }
    }

    function randomGaussian(mean, stdDev) {
        let u1 = Math.random();
        let u2 = Math.random();
        let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        return mean + stdDev * randStdNormal;
    }

    function resizeCanvas() {
        const scale = Math.min(window.innerWidth * 0.9 / 800, window.innerHeight * 0.9 / 800);
        canvas.style.width = `${800 * scale}px`;
        canvas.style.height = `${800 * scale}px`;
    }

    window.addEventListener('resize', resizeCanvas);

    function mainLoop() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            updateParticle(particle);
            particle.draw();
        });

        requestAnimationFrame(mainLoop);
    }

    document.getElementById('numParticles').addEventListener('input', function() {
        NUM_PARTICLES = this.value;
        generateParticles();
    });

    document.getElementById('gravity').addEventListener('input', function() {
        G = this.value;
    });

    document.getElementById('centralMass').addEventListener('input', function() {
        CENTRAL_MASS = this.value;
    });

    resizeCanvas();
    generateParticles();
    mainLoop();
});
