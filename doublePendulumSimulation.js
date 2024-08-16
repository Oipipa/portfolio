class DoublePendulum {
    constructor(m1, m2, L1, L2, theta1, theta2) {
        this.m1 = m1;
        this.m2 = m2;
        this.L1 = L1;
        this.L2 = L2;
        this.theta1 = theta1;
        this.theta2 = theta2;
        this.omega1 = 0;
        this.omega2 = 0;
        this.g = 9.81;
        this.path1 = [];
        this.path2 = [];
    }

    derivatives(theta1, theta2, omega1, omega2) {
        const delta = theta2 - theta1;

        const denom1 = (this.m1 + this.m2) * this.L1 - this.m2 * this.L1 * Math.cos(delta) ** 2;
        const denom2 = (this.L2 / this.L1) * denom1;

        const d_omega1 = (this.m2 * this.L1 * omega1 ** 2 * Math.sin(delta) * Math.cos(delta) +
            this.m2 * this.g * Math.sin(theta2) * Math.cos(delta) +
            this.m2 * this.L2 * omega2 ** 2 * Math.sin(delta) -
            (this.m1 + this.m2) * this.g * Math.sin(theta1)) / denom1;

        const d_omega2 = (-this.m2 * this.L2 * omega2 ** 2 * Math.sin(delta) * Math.cos(delta) +
            (this.m1 + this.m2) * this.g * Math.sin(theta1) * Math.cos(delta) -
            (this.m1 + this.m2) * this.L1 * omega1 ** 2 * Math.sin(delta) -
            (this.m1 + this.m2) * this.g * Math.sin(theta2)) / denom2;

        return [omega1, omega2, d_omega1, d_omega2];
    }

    step(dt) {
        const rk4_step = (theta1, theta2, omega1, omega2, dt) => {
            const [k1_omega1, k1_omega2, k1_d_omega1, k1_d_omega2] = this.derivatives(theta1, theta2, omega1, omega2);
            const [k2_omega1, k2_omega2, k2_d_omega1, k2_d_omega2] = this.derivatives(
                theta1 + 0.5 * k1_omega1 * dt,
                theta2 + 0.5 * k1_omega2 * dt,
                omega1 + 0.5 * k1_d_omega1 * dt,
                omega2 + 0.5 * k1_d_omega2 * dt
            );
            const [k3_omega1, k3_omega2, k3_d_omega1, k3_d_omega2] = this.derivatives(
                theta1 + 0.5 * k2_omega1 * dt,
                theta2 + 0.5 * k2_omega2 * dt,
                omega1 + 0.5 * k2_d_omega1 * dt,
                omega2 + 0.5 * k2_d_omega2 * dt
            );
            const [k4_omega1, k4_omega2, k4_d_omega1, k4_d_omega2] = this.derivatives(
                theta1 + k3_omega1 * dt,
                theta2 + k3_omega2 * dt,
                omega1 + k3_d_omega1 * dt,
                omega2 + k3_d_omega2 * dt
            );

            theta1 += (k1_omega1 + 2 * k2_omega1 + 2 * k3_omega1 + k4_omega1) * dt / 6;
            theta2 += (k1_omega2 + 2 * k2_omega2 + 2 * k3_omega2 + k4_omega2) * dt / 6;
            omega1 += (k1_d_omega1 + 2 * k2_d_omega1 + 2 * k3_d_omega1 + k4_d_omega1) * dt / 6;
            omega2 += (k1_d_omega2 + 2 * k2_d_omega2 + 2 * k3_d_omega2 + k4_d_omega2) * dt / 6;

            return [theta1, theta2, omega1, omega2];
        };

        [this.theta1, this.theta2, this.omega1, this.omega2] = rk4_step(this.theta1, this.theta2, this.omega1, this.omega2, dt);
        this.updatePosition();
    }

    updatePosition() {
        const x1 = this.L1 * Math.sin(this.theta1);
        const y1 = this.L1 * Math.cos(this.theta1);
        const x2 = x1 + this.L2 * Math.sin(this.theta2);
        const y2 = y1 + this.L2 * Math.cos(this.theta2);

        this.path1.push([x1, y1]);
        this.path2.push([x2, y2]);
    }

    position() {
        return [this.path1[this.path1.length - 1], this.path2[this.path2.length - 1]];
    }

    getPaths() {
        return [this.path1, this.path2];
    }
}

function doublePendulumSimulation() {
    const canvas = document.getElementById('doublePendulumCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let m1 = parseFloat(document.getElementById('mass1').value);
    let m2 = parseFloat(document.getElementById('mass2').value);
    let L1 = 100, L2 = 100, theta1 = Math.PI / 2, theta2 = Math.PI / 2;
    let pendulum = new DoublePendulum(m1, m2, L1, L2, theta1, theta2);
    const timeStep = 0.4;

    const mass1Slider = document.getElementById('mass1');
    const mass2Slider = document.getElementById('mass2');
    const mass1Value = document.getElementById('mass1Value');
    const mass2Value = document.getElementById('mass2Value');

    mass1Slider.addEventListener('input', function() {
        m1 = parseFloat(this.value);
        mass1Value.textContent = m1.toFixed(1);
        pendulum = new DoublePendulum(m1, m2, L1, L2, theta1, theta2);
    });

    mass2Slider.addEventListener('input', function() {
        m2 = parseFloat(this.value);
        mass2Value.textContent = m2.toFixed(1);
        pendulum = new DoublePendulum(m1, m2, L1, L2, theta1, theta2);
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);
        pendulum.step(timeStep);

        const [[x1, y1], [x2, y2]] = pendulum.position();
        const [path1, path2] = pendulum.getPaths();

        const scaleX = canvas.width / 400;
        const scaleY = canvas.height / 400;

        ctx.save();
        ctx.scale(scaleX, scaleY);
        ctx.translate(width / (2 * scaleX), height / (2 * scaleY));

        ctx.strokeStyle = 'red';
        ctx.beginPath();
        path1.forEach(([px, py], index) => {
            if (index === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.stroke();

        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        path2.forEach(([px, py], index) => {
            if (index === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.stroke();

        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x1, y1, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();

        requestAnimationFrame(draw);
    }

    draw();
}
