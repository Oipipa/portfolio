document.addEventListener("DOMContentLoaded", function() {
    // Cache elements for efficiency
    const aboutBtn = document.getElementById("aboutBtn");
    const projectsBtn = document.getElementById("projectsBtn");
    const overlay = document.getElementById("overlay");
    const aboutSection = document.getElementById("aboutSection");
    const projectsSection = document.getElementById("projectsSection");
    const closeButton = document.getElementById("closeButton");
    const readmeModal = document.getElementById("readmeModal");
    const latexContent = document.getElementById("latexContent");
    const modalCloseButton = document.querySelector(".modal .close");

    // LaTeX content for each simulation
    const latexEquations = {
        doublePendulum: `
            <h3>Double Pendulum Simulation</h3>
            <p>The double pendulum system is a classic example of chaotic motion in classical mechanics. The equations governing the system are derived from the Lagrangian mechanics and are as follows:</p>
            <p>
                The angles of the two pendulums are denoted by \\(\\theta_1\\) and \\(\\theta_2\\), and their respective angular velocities by \\(\\omega_1\\) and \\(\\omega_2\\):
            </p>
            \\[
            \\begin{aligned}
            \\frac{d\\theta_1}{dt} &= \\omega_1 \\\\
            \\frac{d\\theta_2}{dt} &= \\omega_2 \\\\
            \\frac{d\\omega_1}{dt} &= \\frac{-g(2m_1+m_2)\\sin\\theta_1 - m_2g\\sin(\\theta_1-2\\theta_2) - 2\\sin(\\theta_1-\\theta_2)m_2(\\omega_2^2L_2+\\omega_1^2L_1\\cos(\\theta_1-\\theta_2))}{L_1(2m_1+m_2-m_2\\cos(2\\theta_1-2\\theta_2))} \\\\
            \\frac{d\\omega_2}{dt} &= \\frac{2\\sin(\\theta_1-\\theta_2)(\\omega_1^2L_1(m_1+m_2) + g(m_1+m_2)\\cos\\theta_1 + \\omega_2^2L_2m_2\\cos(\\theta_1-\\theta_2))}{L_2(2m_1+m_2-m_2\\cos(2\\theta_1-2\\theta_2))}
            \\end{aligned}
            \\]
            <p>The system exhibits highly sensitive dependence on initial conditions, a hallmark of chaotic systems.</p>
        `,
        blochSphere: `
            <h3>Bloch Sphere Simulation</h3>
            <p>The Bloch sphere is a geometrical representation of the pure state space of a two-level quantum system (qubit). Any pure qubit state can be represented as a point on the surface of the sphere:</p>
            \\[
            |\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle
            \\]
            <p>where:</p>
            \\[
            \\alpha = \\cos\\left(\\frac{\\theta}{2}\\right), \\quad \\beta = e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)
            \\]
            <p>Here, \\(\\theta\\) and \\(\\phi\\) are the spherical coordinates that determine the position of the qubit on the Bloch sphere. The angles are related to the quantum state parameters \\(\\alpha\\) and \\(\\beta\\) (with \\(|\\alpha|^2 + |\\beta|^2 = 1\\)). This simulation allows you to visualize how these parameters affect the qubit's position on the sphere.</p>
        `,
        galaxySimulator: `
        <h3>Galaxy Simulation</h3>
        <p>This simulation models the dynamics of particles and stars under the influence of gravity in a galaxy, particularly focusing on the interaction with a central supermassive black hole.</p>
        
        <h4>Gravitational Force</h4>
        <p>The gravitational force between any two particles in the simulation is based on Newton's law of universal gravitation:</p>
        \\[
        F = G \\frac{m_1 m_2}{r^2}
        \\]
        <p>where:</p>
        <ul>
            <li><strong>G</strong> is the gravitational constant (which is adjustable in the simulation).</li>
            <li><strong>m_1</strong> and <strong>m_2</strong> are the masses of the two interacting particles.</li>
            <li><strong>r</strong> is the distance between the centers of the two particles.</li>
        </ul>
    
        <h4>Central Mass and Bulge Mass</h4>
        <p>The galaxy contains a central mass, representing the dense core region near the galactic center, including the supermassive black hole. The effective gravitational influence of the central mass at a distance is modified to account for this bulge:</p>
        \\[
        M_{bulge} = M_{central} \\times \\left( \\frac{r}{r + 10} \\right)
        \\]
    
        <h4>Halo Mass</h4>
        <p>The simulation also includes a galactic halo, which extends beyond the central bulge and is made up of dark matter and other less dense material. The mass of this halo contributes to the gravitational forces and is calculated using a logarithmic model:</p>
        \\[
        M_{halo} = M_{halo, total} \\times \\left( \\log\\left(1 + \\frac{r}{20}\\right) - \\frac{r}{20 + r} \\right)
        \\]
        <p>This formula models how the mass of the halo influences the motion of particles as a function of their distance from the center.</p>
    
        <h4>Accretion Disk and Black Hole</h4>
        <p>The central supermassive black hole has an accretion disk, which is a region where particles move in high-speed orbits due to the black hole's strong gravitational pull. If particles move too close to the black hole (within the <em>accretion radius</em>), they are "consumed," and the mass of the black hole increases:</p>
        <ul>
            <li><strong>Accretion Disk Radius:</strong> The radius within which the gravitational pull significantly alters the velocity of particles, causing them to spiral inward.</li>
            <li><strong>Accretion Radius:</strong> The distance from the black hole within which particles are absorbed, contributing to the black hole's growth.</li>
        </ul>
        <p>Particles that come within the accretion disk radius experience increased drag, causing their velocities to decrease slightly, simulating the loss of angular momentum due to friction or other effects in real accretion disks.</p>
    
        <h4>Initial Velocity Calculation</h4>
        <p>The initial velocity of each particle is calculated to approximate a stable orbit around the galactic center. The velocity is derived from the balance between the gravitational pull and the centripetal force required for circular motion:</p>
        \\[
        v = \\sqrt{\\frac{G \\times M_{total}}{r}}
        \\]
        <p>where:</p>
        <ul>
            <li><strong>v</strong> is the orbital velocity.</li>
            <li><strong>M_{total}</strong> is the combined mass of the central mass, bulge, and halo contributing to the gravitational pull at distance <strong>r</strong>.</li>
            <li><strong>r</strong> is the distance of the particle from the galactic center.</li>
        </ul>
        
    `
    };

    // Function to show the overlay with the specified section
    function showOverlay(section) {
        // Hide all sections first
        aboutSection.classList.remove("active");
        projectsSection.classList.remove("active");
        
        // Show the overlay and the relevant section
        overlay.classList.remove("hidden");
        setTimeout(() => {
            overlay.classList.add("active");
            section.classList.add("active");
        }, 10);

        // Initialize simulations if projects section is shown
        if (section === projectsSection) {
            doublePendulumSimulation();
            blochSphereSimulation();
            galaxySimulation(); // Ensure this initializes the galaxy simulation
        }
    }

    // Function to hide the overlay
    function hideOverlay() {
        overlay.classList.remove("active");
        setTimeout(() => {
            overlay.classList.add("hidden");
            aboutSection.classList.remove("active");
            projectsSection.classList.remove("active");
        }, 500);
    }

    // Function to show the README modal
    function showReadmeModal(simulation) {
        latexContent.innerHTML = latexEquations[simulation];
        MathJax.typesetPromise(); // Render the LaTeX content
        readmeModal.style.display = "flex";
        setTimeout(() => {
            readmeModal.classList.add("active"); // Trigger fade-in effect
        }, 10);
    }

    // Function to hide the README modal
    function hideReadmeModal() {
        readmeModal.classList.remove("active");
        setTimeout(() => {
            readmeModal.style.display = "none";
        }, 300); // Match this delay to the transition duration
    }

    // Attach event listeners to buttons
    aboutBtn.addEventListener("click", function() {
        showOverlay(aboutSection);
    });

    projectsBtn.addEventListener("click", function() {
        showOverlay(projectsSection);
    });

    closeButton.addEventListener("click", hideOverlay);
    
    // Event listener for README buttons
    document.querySelectorAll(".readme-button").forEach(button => {
        button.addEventListener("click", function() {
            const simulation = this.getAttribute("data-simulation");
            showReadmeModal(simulation);
        });
    });

    // Event listener for modal close button
    modalCloseButton.addEventListener("click", hideReadmeModal);

    // Close modal on clicking outside of it
    window.addEventListener("click", function(event) {
        if (event.target === readmeModal) {
            hideReadmeModal();
        }
    });

    // Optional: Close overlay on 'Escape' key press
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            if (overlay.classList.contains("active")) {
                hideOverlay();
            }
            if (readmeModal.style.display === "flex") {
                hideReadmeModal();
            }
        }
    });
});
