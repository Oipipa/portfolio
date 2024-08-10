function sphericalToCartesian(theta, phi, radius) {
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);
    return [x, y, z];
}

function rotate3D(x, y, z, rotationX, rotationY) {
    const xzDist = Math.sqrt(x ** 2 + z ** 2);
    let theta = Math.atan2(z, x) + rotationY;
    x = xzDist * Math.cos(theta);
    z = xzDist * Math.sin(theta);

    const yzDist = Math.sqrt(y ** 2 + z ** 2);
    theta = Math.atan2(y, z) + rotationX;
    y = yzDist * Math.sin(theta);
    z = yzDist * Math.cos(theta);

    return [x, y, z];
}

function project3DTo2D(x, y, z, width, height, cameraPos) {
    const fov = 256;
    const distance = 4;

    x -= cameraPos[0];
    y -= cameraPos[1];
    z -= cameraPos[2];

    if (z <= -distance) return null;

    const factor = fov / (distance + z);
    const x2D = x * factor + width / 2;
    const y2D = -y * factor + height / 2;

    return [x2D, y2D];
}

function colorShadeBasedOnDepth(z, radius, baseColor) {
    const shade = Math.max(0, Math.min(255, Math.round(255 * (z + radius) / (2 * radius))));
    return `rgb(${(shade * baseColor[0]) / 255}, ${(shade * baseColor[1]) / 255}, ${(shade * baseColor[2]) / 255})`;
}

function drawBlochSphere(ctx, width, height, rotationX, rotationY, cameraPos, radius) {
    const gray = [169, 169, 169];

    for (let theta = 0; theta < 360; theta += 10) {
        for (let phi = 0; phi < 360; phi += 10) {
            const thetaRad = theta * (Math.PI / 180);
            const phiRad = phi * (Math.PI / 180);
            let [x, y, z] = sphericalToCartesian(thetaRad, phiRad, radius);
            [x, y, z] = rotate3D(x, y, z, rotationX, rotationY);
            const projection = project3DTo2D(x, y, z, width, height, cameraPos);
            if (projection) {
                ctx.fillStyle = colorShadeBasedOnDepth(z, radius, gray);
                ctx.fillRect(projection[0], projection[1], 1, 1);
            }
        }
    }

    // Draw axes
    const axes = {
        'X+': [radius, 0, 0],
        'X-': [-radius, 0, 0],
        'Y+': [0, radius, 0],
        'Y-': [0, -radius, 0],
        'Z+': [0, 0, radius],
        'Z-': [0, 0, -radius],
    };

    const axisColors = {
        'X+': [255, 0, 0],
        'X-': [255, 0, 0],
        'Y+': [0, 255, 0],
        'Y-': [0, 255, 0],
        'Z+': [255, 255, 255],
        'Z-': [255, 255, 255],
    };

    ctx.font = '14px Caudex';
    ctx.textAlign = 'center';

    for (const [label, coord] of Object.entries(axes)) {
        let [x, y, z] = rotate3D(...coord, rotationX, rotationY);
        const projection = project3DTo2D(x, y, z, width, height, cameraPos);
        if (projection) {
            ctx.fillStyle = `rgb(${axisColors[label][0]}, ${axisColors[label][1]}, ${axisColors[label][2]})`;
            ctx.beginPath();
            ctx.arc(projection[0], projection[1], 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.fillText(label, projection[0] + 10, projection[1] - 10);
        }
    }
}

function drawQubitState(ctx, theta, phi, rotationX, rotationY, width, height, cameraPos, radius) {
    let [x, y, z] = sphericalToCartesian(theta * (Math.PI / 180), phi * (Math.PI / 180), radius);
    [x, y, z] = rotate3D(x, y, z, rotationX, rotationY);
    const projection = project3DTo2D(x, y, z, width, height, cameraPos);
    if (projection) {
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(projection[0], projection[1]);
        ctx.stroke();
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(projection[0], projection[1], 8, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw projections on XY, XZ, YZ planes
    const projXY = project3DTo2D(x, y, 0, width, height, cameraPos);
    const projXZ = project3DTo2D(x, 0, z, width, height, cameraPos);
    const projYZ = project3DTo2D(0, y, z, width, height, cameraPos);

    if (projXY) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(projXY[0], projXY[1], 5, 0, 2 * Math.PI);
        ctx.fill();
    }
    if (projXZ) {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(projXZ[0], projXZ[1], 5, 0, 2 * Math.PI);
        ctx.fill();
    }
    if (projYZ) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(projYZ[0], projYZ[1], 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function blochSphereSimulation() {
    const canvas = document.getElementById('blochSphereCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    let rotationX = 0,
        rotationY = 0;
    const cameraPos = [0, 0, -5];
    let theta = 45,
        phi = 45;
    const radius = 150;

    const realSlider = document.getElementById('realSlider');
    const imaginarySlider = document.getElementById('imaginarySlider');
    const realValue = document.getElementById('realValue');
    const imaginaryValue = document.getElementById('imaginaryValue');

    realSlider.addEventListener('input', updateQubitState);
    imaginarySlider.addEventListener('input', updateQubitState);

    function updateQubitState() {
        const alpha = parseFloat(realSlider.value);
        const beta = parseFloat(imaginarySlider.value);
        realValue.textContent = alpha.toFixed(2);
        imaginaryValue.textContent = beta.toFixed(2);

        // Normalize alpha and beta to ensure a valid qubit state
        const norm = Math.sqrt(alpha * alpha + beta * beta);
        const normalizedAlpha = alpha / norm;
        const normalizedBeta = beta / norm;

        theta = 2 * Math.acos(normalizedAlpha) * (180 / Math.PI);
        phi = Math.atan2(normalizedBeta, normalizedAlpha) * (180 / Math.PI);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.save();

        const scaleX = canvas.width / 500;
        const scaleY = canvas.height / 500;

        ctx.scale(scaleX, scaleY);
        ctx.translate(width / (2 * scaleX), height / (2 * scaleY));

        drawBlochSphere(ctx, width / scaleX, height / scaleY, rotationX, rotationY, cameraPos, radius);
        drawQubitState(ctx, theta, phi, rotationX, rotationY, width / scaleX, height / scaleY, cameraPos, radius);

        ctx.restore();

        requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', function (e) {
        if (e.buttons > 0) {
            rotationY += e.movementX * 0.01;
            rotationX += e.movementY * 0.01;
        }
    });

    draw();
}
