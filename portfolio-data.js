window.PORTFOLIO_DATA = {
    profile: {
        name: "Anubhav Lamsal",
        role: "Junior Fullstack Developer and BSc Informatics Student",
        kicker: "PORTFOLIO",
        summary: "Computer science undergraduate based in Austria with hands-on full-stack experience in LLM voicebot systems, production APIs, web applications, and data science projects. Expected to graduate in June 2026.",
        location: "Vienna, Austria",
        email: "333anubhav@gmail.com",
        availability: "Working part-time, open to opportunities",
        links: [
            { label: "GitHub", url: "https://github.com/Oipipa" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/anubhav-lamsal-a32805296/" },
            { label: "Email", url: "mailto:333anubhav@gmail.com" }
        ]
    },
    experience: [
        {
            title: "Junior Fullstack Developer",
            organization: "Adola AI",
            location: "Vienna, Austria",
            period: "08/2025 - Current",
            description: "Working across a voice-LLM platform connected to telephony, including FastAPI services, PostgreSQL models, a React configuration UI, and deployment infrastructure.",
            highlights: [
                "Built OpenAI Realtime voicebot agents for phone-call flows such as appointment booking, prescription lookup, and support.",
                "Implemented APIs, persistence, React tooling, and business logic for doctor and tireshop products.",
                "Reduced lookup latency from about 1 second to about 50 milliseconds using cached preload data and concurrency handling."
            ],
            tags: ["OpenAI Realtime", "FastAPI", "React", "PostgreSQL", "TypeScript", "Docker"]
        }
    ],
    education: [
        {
            title: "BSc. Informatics",
            organization: "IMC FH Krems",
            location: "Austria",
            period: "2023 - 2026",
            description: "Ongoing computer science degree with about 30 ECTS remaining.",
            highlights: [
                "Awarded a merit-based scholarship for outstanding academic performance in 2024.",
                "Relevant coursework includes OOP, full-stack development, distributed systems, operating systems, data mining, machine learning, probability, linear algebra, and software engineering.",
                "Built academic projects in full-stack systems, data science, machine learning, and scientific computing."
            ],
            tags: ["Informatics", "Merit scholarship", "Software engineering", "Machine learning"]
        }
    ],
    projects: [
        {
            name: "Full-stack Flood Monitoring Application",
            kind: "University project",
            status: "Deployed",
            description: "Austrian flood map with authentication, admin tooling, and CI/CD.",
            highlights: [
                "Built the app with Angular, Express, MongoDB, Leaflet, and GeoJSON maps.",
                "Added JWT authentication, role-based routes, Docker, and GitHub Actions.",
                "Designed the database schema and Electron admin tool."
            ],
            technologies: ["Angular", "Node.js", "Express", "MongoDB", "Leaflet", "GeoJSON", "Docker", "GitHub Actions", "Electron"],
            links: [
                { label: "Live App", url: "https://floodmonitoring.fly.dev/" }
            ]
        },
        {
            name: "EEG-Based Emotional State Classification",
            kind: "Data Science Capstone",
            status: "Complete",
            description: "EEG emotion classifier reaching 96% CNN accuracy.",
            highlights: [
                "Reduced 100 raw features to 22 spectral features.",
                "Benchmarked CNN, Random Forest, XGBoost, and SVM models.",
                "Used cross-validation, early stopping, and signal/label quality checks."
            ],
            technologies: ["Python", "NumPy", "SciPy", "pandas", "scikit-learn", "XGBoost", "PyTorch", "DSP", "Fourier Transforms"],
            links: [
                { label: "GitHub", url: "https://github.com/Oipipa/EEG-emotional-state-classifier.git" }
            ]
        },
        {
            name: "Home Lab Infrastructure",
            kind: "Infrastructure project",
            status: "Active",
            description: "Self-hosted lab for services, networking, deployment, and monitoring practice.",
            highlights: [
                "Run containerized services with Linux, Docker, and reverse proxy routing.",
                "Practice deployment, TLS, DNS, backups, and monitoring.",
                "Test backend services in the lab before public deployment."
            ],
            technologies: ["Linux", "Docker", "Networking", "Reverse Proxy", "TLS", "DNS", "Monitoring"],
            links: []
        }
    ]
};
