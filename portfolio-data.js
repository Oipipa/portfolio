window.PORTFOLIO_DATA = {
    profile: {
        name: "Anubhav Lamsal",
        role: "Junior Fullstack Developer and BSc Informatics Student",
        kicker: "PORTFOLIO",
        summary: "Computer science undergraduate based in Austria with hands-on full-stack experience building 𝐋𝐋𝐌 𝐯𝐨𝐢𝐜𝐞𝐛𝐨𝐭 𝐬𝐲𝐬𝐭𝐞𝐦𝐬, 𝐩𝐫𝐨𝐝𝐮𝐜𝐭𝐢𝐨𝐧 𝐀𝐏𝐈𝐬, web applications, and data science projects. On track to graduate in 𝐉𝐮𝐧𝐞 𝟐𝟎𝟐𝟔.",
        location: "Vienna, Austria",
        email: "333anubhav@gmail.com",
        availability: "Working (Part time), open to opportunities",
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
            description: "Working across the 𝐟𝐮𝐥𝐥 𝐬𝐭𝐚𝐜𝐤 of a 𝐯𝐨𝐢𝐜𝐞-𝐋𝐋𝐌 platform connected to 𝐭𝐞𝐥𝐞𝐩𝐡𝐨𝐧𝐲, including 𝐅𝐚𝐬𝐭𝐀𝐏𝐈 services, 𝐏𝐨𝐬𝐭𝐠𝐫𝐞𝐒𝐐𝐋 data models, a 𝐑𝐞𝐚𝐜𝐭 configuration UI, and deployment infrastructure.",
            highlights: [
                "Built OpenAI Realtime voicebot agents connected to phone-call flows for appointment booking, prescription lookup, and support workflows.",
                "Implemented backend APIs, database persistence, React tooling, and domain-specific business logic across doctor and tireshop products.",
                "Reduced lookup latency from about 1 second to about 50 milliseconds with cached preload data and concurrency handling.",
                "Worked on SIPwise telephony routing, Dockerization, and development-server deployments."
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
            description: "Ongoing 𝐜𝐨𝐦𝐩𝐮𝐭𝐞𝐫 𝐬𝐜𝐢𝐞𝐧𝐜𝐞 degree with approximately 𝟑𝟎 𝐄𝐂𝐓𝐒 remaining.",
            highlights: [
                "Awarded a merit-based scholarship by the board for outstanding academic performance in the academic year 2024.",
                "Relevant courses include OOP programming, full-stack web development, distributed systems, operating systems, data mining, machine learning, probability theory, linear algebra, and software engineering practices.",
                "Built academic projects across full-stack systems, data science, machine learning, and scientific computing."
            ],
            tags: ["Informatics", "Merit scholarship", "Software engineering", "Machine learning"]
        }
    ],
    projects: [
        {
            name: "Full-stack Flood Monitoring Application",
            kind: "University project",
            status: "Deployed",
            description: "𝐀𝐮𝐬𝐭𝐫𝐢𝐚𝐧 𝐟𝐥𝐨𝐨𝐝 𝐦𝐚𝐩 with 𝐚𝐮𝐭𝐡 and 𝐂𝐈/𝐂𝐃.",
            highlights: [
                "Built Angular, Express, MongoDB, Leaflet, and GeoJSON maps.",
                "Added JWT auth, role routes, Docker, and GitHub Actions.",
                "Created the DB schema and Electron admin tool."
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
            description: "𝐄𝐄𝐆 emotion classifier with 𝟗𝟔% 𝐂𝐍𝐍 accuracy.",
            highlights: [
                "Reduced 100 raw features to 22 spectral features.",
                "Benchmarked CNN, RF, XGBoost, and SVM models.",
                "Used CV, early stopping, and signal/label checks."
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
            description: "𝐒𝐞𝐥𝐟-𝐡𝐨𝐬𝐭𝐞𝐝 lab for services, networking, and 𝐝𝐞𝐩𝐥𝐨𝐲𝐦𝐞𝐧𝐭 practice.",
            highlights: [
                "Run containerized services with Linux, Docker, and reverse proxy routing.",
                "Practice deployment, TLS, DNS, backups, and service monitoring.",
                "Use the lab to test backend services before public deployment."
            ],
            technologies: ["Linux", "Docker", "Networking", "Reverse Proxy", "TLS", "DNS", "Monitoring"],
            links: []
        }
    ]
};
