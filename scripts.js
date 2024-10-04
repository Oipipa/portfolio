document.addEventListener("DOMContentLoaded", function() {
    const aboutBtn = document.getElementById("aboutBtn");
    const projectsBtn = document.getElementById("projectsBtn");
    const overlay = document.getElementById("overlay");
    const aboutSection = document.getElementById("aboutSection");
    const projectsSection = document.getElementById("projectsSection");
    const closeButton = document.getElementById("closeButton");
    const readmeModal = document.getElementById("readmeModal");
    const latexContent = document.getElementById("latexContent");
    const modalCloseButton = document.querySelector(".modal .close");

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
            <p>These equations take into account the masses \\(m_1\\) and \\(m_2\\) of the pendulums, the lengths \\(L_1\\) and \\(L_2\\) of their arms, and the acceleration due to gravity \\(g\\). The system exhibits highly sensitive dependence on initial conditions, a hallmark of chaotic systems.</p>
        `,
        blochSphere: `
            <h3>Bloch Sphere Simulation</h3>
            <p>The Bloch sphere is a geometrical representation of the pure state space of a two-level quantum system (qubit). Any pure qubit state can be represented as a point on the surface of the sphere:</p>
            \\[
            |\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle
            \\]
            <p>where:</p>
            \\[
            \\alpha = \\cos\\left(\\frac{\\theta}{2}\\right), \\beta = e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)
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
        <p>This formula decreases the influence of the central mass as the distance increases, simulating the gravitational pull exerted by the dense core or bulge.</p>
    
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
        `,
        proceduralMazeSolver: `
        <p>The project uses a combination of DFS and A* algorithms to procedurally generate mazes with given constraints and render it in a videogame interface, spawning a snake randomly in the environment as it navigates through to find food. You can find the project <a href="https://github.com/Oipipa/maze-solving-snake">here</a>. If you are interested in how it works, I hope the explanation below suffices.</p>
        <h4>Mazes Connectivity</h4>
        <p>A maze can be mathematically represented as a finite, simple, undirected graph </p>
        \\[G = (V, E) 
        \\]
        <p> Each vertex \\( v \\in V \\) is associated with a unique coordinate pair \\( (x, y) \\) within a 2D grid, where \\( 0 \\leq x < \\text{width} \\) and \\( 0 \\leq y < \\text{height} \\). The grid structure imposes a local neighborhood relation on each vertex, wherein each vertex can be connected to up to four neighboring vertices (up, down, left, right).</p>
        In the context of maze generation, a DFS algorithm has been applied that operates as follows:
        <ul>
            <li>Initialization: We begin at an initial vertex \\( v_0 \\) within the graph \\( G \\). This vertex is marked as visited and serves as the starting point of our traversal.</li>
            <li>Recursive Exploration**: From the current vertex \\( v \\), we randomly select one of its unvisited neighbors \\( u \\) and traverse to it, marking \\( u \\) as visited and creating an edge between \\( v \\) and \\( u \\) by removing the wall separating the corresponding cells in the grid.</li>
            <li>Backtracking: If all neighbors of \\( v \\) have been visited, the algorithm backtracks to the previous vertex, effectively exploring the graph in a depth-first manner until all vertices are visited.</li>
        </ul>
        The DFS traversal makes sure that the resulting graph is a spanning tree of \\( G \\), meaning that all vertices are connected, and there are no cycles (i.e., exactly one path exists between any two vertices).
        <p>A uniform random selector has also been implemented At each step in the DFS, the choice of the next vertex to explore is made uniformly at random from the set of unvisited neighbors. Formally, if a vertex \\( v \\) has \\( k \\) unvisited neighbors, the probability \\( P(u) \\) of selecting any specific neighbor \\( u \\) is given simply by:</p>
        \\[
        P(u) = \\frac{1}{k}
        \\]
        Though, the expression can be modified for more complexity, the program keeps things simple. 
        <h4>How the Snake navigates the maze using a star</h4>
        <p>The core of the A* algorithm is pretty much its heuristic function, which estimates the cost from a node to the goal:</p>
        \\[
        h(a, b) = |a_x - b_x| + |a_y - b_y|
        \\]
        <p>This is known as the so-called 'Manhattan distance'. It's a good fit for grid-based paths where only horizontal and vertical moves are allowed, and it provides an admissible heuristic—one that never overestimates the actual minimal cost to reach the goal.
        </p>
            <h4>Cost functions</h4>
            <ul>
            <li>\\( g(n) \\): The cost to reach node \( n \) from the start node. This is incremented by 1 for each move from the current node to a neighboring node.</li>
            \\( f(n) = g(n) + h(n) \\): The estimated total cost to reach the goal from the start node via \\( n \\).
            </ul>
        <p> The algorithm uses a priority queue (implemented as a min-heap) to explore nodes with the smallest \( f \)-value first, ensuring that the first time the goal is reached, it is through the optimal path.</p>
        `, 
        proceduralCity: `
        A procedural generation algorithm leveraging on different flavors of algorithms. Project can be found <a href="https://github.com/Oipipa/ProceduralCityGenerator">here</a>.
        <h4>Iterative Expansion: String Generation</h4>
        <p>
        L-systems generate strings in steps. Starting with an initial string \\( \\omega \\), each iteration replaces symbols based on the rules in \\( P \\), resulting in a new string \\( S_n \\) after \\( n \\) iterations:
        </p>
        \\[S_{n+1} = \\prod_{v \\in S_n} P(v)\\]
        <p>
        After \\( k \\) iterations, the final string \\( S_k \\) serves as instructions for generating city elements like buildings, roads, or parks.
        </p>
        <p>
        The turtle's position on the grid is \\( \\mathbf{p} = (x, y) \\), and its orientation is \\( \\theta \\). Movement is represented as:
        </p>
        \\[ \\mathbf{p}' = \\mathbf{p} + d \\cdot \\mathbf{v} \\]
        <p>
        where \\( d \\) is the step size, and \\( \\mathbf{v} = (\\cos \\theta, \\sin \\theta) \\) is the direction vector.
        </p>

        <h4>Road Network Design</h4>
        <p>
        The city's road network is modeled as a graph \\( G = (V, E) \\), where:
        <ul>
            <li> \\( V \\) represents intersections, road endpoints, or key locations. </li>
            <li> \\( E \\) represents the roads connecting these points. </li>
        </ul>
        </p>
        <p>
        Each edge \\( e \\in E \\) has a weight \\( w(e) \\), indicating the road's length or cost.
        </p>
        <p>
        Random graphs can be generated using different models:
        </p>
        <ul>
        <li><strong>Erdős–Rényi Model:</strong> The Erdős–Rényi model \\( G(n, p) \\) connects nodes with a probability \\( p \\).</li>
        <li><strong>Geometric Random Graph:</strong> The geometric random graph \\( G(n, r) \\) connects nodes within a distance \\( r \\).</li>
        </ul>
        <p>
        An edge exists between nodes \\( v_i \\) and \\( v_j \\) if:
        </p>
        \\[ \\| \\mathbf{p}_i - \\mathbf{p}_j \\| \\leq r \\]
        <p>
        To optimize the road network, we aim to minimize the total road length while keeping all nodes connected, which is an MST (Minimum Spanning Tree) problem.
        </p>
        <p>
        Algorithms like <strong>Prim's</strong> or <strong>Kruskal's</strong> can find the MST, representing the most efficient road network. Utility networks like electricity or water supply can be modeled similarly.
        </p>

        <h4>Terrain and Area Constraints</h4>
        <p>
        Geographical constraints ensure realistic city layouts. Each area in the city has specific terrain-based restrictions:
        </p>
        <ul>
            <li><strong>Hills and Mountains:</strong> These areas restrict building types and influence road placement, often leading to winding roads.</li>
        </ul>
        <p>
        These restrictions are defined as permissible configurations:
        </p>
        \\[ C(A_i) = \\{(b, f) \\mid \\text{building } b \\text{ and feature } f \\text{ are compatible with terrain } A_i\\} \\]
        <p>
        For example, in mountainous areas, \\( C(A_i) \\) might include only small-footprint buildings and roads with gentle slopes.
        </p>
        <p>
        Population distribution is modeled with a density function \\( P(A_i) \\), which affects building types in each area:
        </p>
        <ul>
            <li>High-density areas have taller buildings.</li>
            <li>Low-density areas feature smaller structures.</li>
        </ul>
        <p>
        The total population \\( P_T \\) of the city is calculated as:
        </p>
        <p style="text-align: center;">
        \\[ P_T = \\sum_{i=1}^k P(A_i) \\quad \\text{where } k \\text{ is the number of areas} \\]
        </p>

        <h4><strong>Urban Planning Constraints</strong></h4>
        <p>
        All buildings need to be accessible via the road network, which requires solving pathfinding problems:
        </p>
        <ul>
            <li><strong>Shortest Path Algorithms:</strong> Algorithms like Dijkstra’s or A* are used to find the shortest paths in the city, respecting the road network and terrain constraints.</li>
        </ul>
        <p>
        Accessibility for a building \\( b_i \\) at \\( \\mathbf{p}_i \\) from a central point \\( \\mathbf{p}_0 \\) is determined by finding the shortest path \\( d(\\mathbf{p}_0, \\mathbf{p}_i) \\) in the graph \\( G_R \\).
        </p>
        <p>
        Building arrangements within each area are optimized to reduce travel distances and use space efficiently. This is done using optimization techniques like simulated annealing or genetic algorithms, which refine the layout to meet these goals.
        </p>
        `,
        cellularAutomaton: `
        <h4>What Is a Cellular Automaton?</h4>
        <p>A cellular automaton (CA) is a model used to simulate how simple rules can lead to complex patterns and behaviors over time. Imagine a grid made up of tiny squares, like a chessboard but with many more squares. Each square is called a “cell,” and it can be in one of several states, like "on" or "off," "alive" or "dead," or different colors.</p>

        These cells don’t live in isolation. Each cell’s future depends on the state of its neighboring cells, according to a set of rules. These rules are like the “laws of nature” in the cellular automaton’s world, dictating how each cell changes from one moment to the next, some rules leading to turing complete systems, even.</p>

        <p><strong>The backgrounds within this overlay and the other one are two variations of cellular automata: this being brian's brain and the other being the famous conway's game of life.</strong></p>

        <h4>Project Description</h4>
        <p>Using the turing complete nature of Conway's game of life to simulate some cool phenomenon (technologies used: golly, python and some very basic assembly for writing algorithms in a low-level setting. A tokenizer made in python capable of tokenizing low-level code to instructions for the automaton. The architecture itself is scaleable but it is worth noting that I did not make it myself as I have used existing attempts to
        simulate computer systems in gol as a reference and have also used (slightly modified) an existing tokenizer used for simulating algorithms in factorio.</p>
        <h4>Examples</h4>
        <img src="res/display.png" width="800" height="600">
        This is an example display grid for output representation.
        <video src="res/12.mp4" width="800" height="600" loop muted autoplay></video>
        A group of self-sustaining pixels. 
        `,
        universityProjects: `
        <h4>The Villain Management App</h4>
        A RESTful API with a simple, cute interface that uses the MVC pattern to facilitate CRUD operations on villains including data validation. The repository for this is public and can be found <a href="https://github.com/Oipipa/villain-management">here</a>
        <h4>Multiplayer turn-based Game</h4>
        A python-based game that uses websockets to create network protocols, state validation and parallel processing to faciliate a turn-based multiplayer game. Features include matchmaking, parallel state transmissions and a somewhat mediocre turn-based game mechanic.
        <h4>Train Ticketing System</h4>
        A back-end application that uses geographical reasoning to parse queries for a hypothetical train network.
        `,
        precisionAnalysis: `
        <h4>Precision Analysis of Rare Particle Decay Channels</h4>
        The primary goal of this project was to identify and analyze rare particle decay channels, particularly those beyond the Standard Model (BSM) predictions, using collision data from the ATLAS detector. In the vast dataset generated by ATLAS, rare decays—such as the possible interactions involving long-lived particles (LLPs) or lepton-flavor violating decays—are often overshadowed by more common Standard Model events.
        <h4>Data Source</h4>
        The analysis used the Open Data from the ATLAS Experiment at CERN. Specifically, the project made use of datasets from proton-proton collisions at a center-of-mass energy of 13 TeV, which were recorded during Run 2 of the Large Hadron Collider (LHC). You can find the dataset <a href="https://opendata.cern.ch/record/80000">here</a>.
        <h4>Approach</h4>
        <ul>
        <li>Data Filtering & Selection: Developed a data pipeline to filter through billions of collision events, focusing on identifying signatures specific to these rare decays, such as displaced vertices or anomalous energy distributions.</li>
        <li>Model Training: Implemented machine learning techniques to classify rare decay events based on existing data from ATLAS, refining models to distinguish these events from noise or more common decays.</li>
        </ul>
        `
    };

    function showOverlay(section) {
        aboutSection.classList.remove("active");
        projectsSection.classList.remove("active");
        
        overlay.classList.remove("hidden");
        setTimeout(() => {
            overlay.classList.add("active");
            section.classList.add("active");
        }, 10);

        if (section === projectsSection) {
            doublePendulumSimulation();
            blochSphereSimulation();
            galaxySimulation(); 
        }
    }

    function hideOverlay() {
        overlay.classList.remove("active");
        setTimeout(() => {
            overlay.classList.add("hidden");
            aboutSection.classList.remove("active");
            projectsSection.classList.remove("active");
        }, 500);
    }

    function showReadmeModal(simulation) {
        latexContent.innerHTML = latexEquations[simulation];
        MathJax.typesetPromise(); 
        readmeModal.style.display = "flex";
        setTimeout(() => {
            readmeModal.classList.add("active"); 
        }, 10);
    }

    function hideReadmeModal() {
        readmeModal.classList.remove("active");
        setTimeout(() => {
            readmeModal.style.display = "none";
        }, 300); 
    }

    aboutBtn.addEventListener("click", function() {
        showOverlay(aboutSection);
    });

    projectsBtn.addEventListener("click", function() {
        showOverlay(projectsSection);
    });

    closeButton.addEventListener("click", hideOverlay);
    
    document.querySelectorAll(".readme-button").forEach(button => {
        button.addEventListener("click", function() {
            const simulation = this.getAttribute("data-simulation");
            showReadmeModal(simulation);
        });
    });

    modalCloseButton.addEventListener("click", hideReadmeModal);

    window.addEventListener("click", function(event) {
        if (event.target === readmeModal) {
            hideReadmeModal();
        }
    });

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

    document.getElementById('cv-button').addEventListener('click', function() {
        window.location.href = 'cv.html';
    });    
});

document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.project-card');
    let currentIndex = 0;

    function showCard(index) {
        currentIndex = (index + cards.length) % cards.length;  
        cards.forEach((card, i) => {
            card.style.display = 'none'; 
            card.classList.remove('active');
        });
        cards[currentIndex].style.display = 'block';
        setTimeout(() => cards[currentIndex].classList.add('active'), 10); 
    }

    document.getElementById('arrowDown').addEventListener('click', function() {
        showCard(currentIndex + 1);
    });

    document.getElementById('arrowUp').addEventListener('click', function() {
        showCard(currentIndex - 1);
    });

    showCard(0);
});
