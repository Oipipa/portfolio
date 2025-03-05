let projectIndex = 0
let isAnimating = false

let projectsData = [
  {
    title: "Villain Management App",
    techStack: ["Javascript", "Cloud Computing"],
    description: 
    "<ul><li>A serverless web application enabling users to sign up, log in, and upload pictures and descriptions of their favorite villains.</li> <li>Built with AWS Lambda for backend logic, API Gateway for routing, and S3 for secure image storage.</li> <li>Implements DynamoDB for user and villain data management</li></ul>"
  },
  {
    title: "Anti-VM Malware and Obfuscation detector",
    techStack: ["C/C++", "CPUID", "Ghidra"],
    description: 
    "Devised a toy 'malware' capable of retrieving system-level artefacts to deduce a virtual environment. Then, devised a binary analyzer capable of generating detailed reports. <br> <br> The project can be found <a href=https://github.com/Oipipa/anti-vm.git>here</a>"
  },
  {
    title: "Room Defense System",
    techStack: ["Arduino", "C/C++", "Sensors"],
    description: "An Arduino-based room defense system uses a PIR motion sensor and a laser tripwire to detect intrusions, triggering an alarm and optionally activating a servo lock mechanism. It can also include an LCD display for status updates and remote notifications for real-time alerts."
  },
  {
    title: "Maze-Solving Snake",
    techStack: ["Python", "Heuristics", "C++"],
    description: "Developed a maze-solving AI using a randomized DFS algorithm and a specialized A* algorithm, resulting in a 30% faster pathfinding solution compared to traditional methods. <br><br> The project can be found <a href=https://github.com/Oipipa/maze-solving-snake.git>here</a>"
  },
  {
    title: "Custom Communication Protocol",
    techStack: ["Python", "TCP/UDP"],
    description: "A university project that implemented a simple messaging protocol (SIMP) over UDP using a client-daemon architecture, enabling users to initiate, accept, and conduct text-based conversations with reliability mechanisms such as a three-way handshake, stop-and-wait retransmission, and timeout handling. The daemon manages communication, enforces protocol rules, and interacts with the client via TCP, while a shell script simplifies testing by automating daemon and client startup."
  },
  {
    title: "LED Snake Game",
    techStack: ["Arduino", "C/C++"],
    description: "An embedded systems project for engineering a matrix of LED lights to move a snake along the path of illuminating LEDs to simulate the snake game. <br> <br> The project can be found <a href=https://github.com/Oipipa/8x8-LED-snake.git>here</a>"
  },
  {
    title: "RFID-Based Access Control System",
    techStack: ["Raspberry Pi", "C/C++", "ChibiOS"],
    description: "<ul><li> Designed a secure RFID-based access control system using an ESP32 microcontroller and MFRC522 RFID module to regulate entry to restricted lab areas.</li><li>Implemented AES-256 encryption to securely store and transmit user credentials to a PostgreSQL database hosted on a Raspberry Pi server</li><li>Developed a Python-based backend with Flask to manage access logs and provide real-time monitoring of entry attempts.</li><li>Optimized database queries using indexing and caching techniques, reducing authentication time from 500ms to 200ms.</li></ul>"
  }
]

let projectCard, flipInner, cardFront, cardBack, projectTitle, readmeBtn, techStackList
let cardLeftBtn, cardRightBtn
let modal, modalTitle, modalDescription, closeModal

function updateCardContent(index) {
  let p = projectsData[index]
  projectTitle.innerText = p.title
  techStackList.innerHTML = ""
  p.techStack.forEach(tech => {
    let li = document.createElement("li")
    li.innerText = tech
    techStackList.appendChild(li)
  })
}
function flipCard() {
  if (isAnimating) return
  flipInner.classList.toggle("is-flipped")
}

function slideTransition(direction, newIndex) {
  if (isAnimating) return
  isAnimating = true

  flipInner.classList.remove("is-flipped")

  let offset = 400
  let startX = 0
  let endX = direction === "left" ? -offset : offset

  anime({
    targets: "#projectCard",
    translateX: [startX, endX],
    opacity: [1, 0],
    duration: 250,
    easing: "easeInOutQuad",
    complete: () => {
      projectIndex = newIndex
      updateCardContent(projectIndex)

      projectCard.style.transform = direction === "left"
        ? `translateX(${offset}px)`
        : `translateX(${-offset}px)`
      projectCard.style.opacity = "0"

      anime({
        targets: "#projectCard",
        translateX: [direction === "left" ? offset : -offset, 0],
        opacity: [0, 1],
        duration: 250,
        easing: "easeInOutQuad",
        complete: () => {
          projectCard.style.transform = ""
          isAnimating = false
        }
      })
    }
  })
}

function navigateLeft() {
  if (projectIndex > 0 && !isAnimating) {
    slideTransition("left", projectIndex - 1)
  } else {
    cardLeftBtn.classList.add("animate__animated","animate__headShake")
    setTimeout(() => {
      cardLeftBtn.classList.remove("animate__animated","animate__headShake")
    }, 500)
  }
}

function navigateRight() {
  if (projectIndex < projectsData.length - 1 && !isAnimating) {
    slideTransition("right", projectIndex + 1)
  } else {
    cardRightBtn.classList.add("animate__animated","animate__headShake")
    setTimeout(() => {
      cardRightBtn.classList.remove("animate__animated","animate__headShake")
    }, 500)
  }
}

function showModal(index) {
    let p = projectsData[index]
    modalTitle.textContent = p.title
    modalDescription.innerHTML = p.description
  
    modal.style.display = "block"
    modal.style.opacity = "0"
  
    anime({
      targets: modal,
      opacity: [0, 1],
      duration: 300,
      easing: "easeOutQuad"
    })
  }

function hideModal() {
  modal.style.display = "none"
}

window.addEventListener("DOMContentLoaded", () => {
  projectCard = document.getElementById("projectCard")
  flipInner = document.getElementById("flipInner")
  cardFront = document.getElementById("cardFront")
  cardBack = document.getElementById("cardBack")
  projectTitle = document.getElementById("projectTitle")
  readmeBtn = document.getElementById("readmeBtn")
  techStackList = document.getElementById("techStackList")

  cardLeftBtn = document.getElementById("cardLeftBtn")
  cardRightBtn = document.getElementById("cardRightBtn")

  modal = document.getElementById("projectModal")
  modalTitle = document.getElementById("modalTitle")
  modalDescription = document.getElementById("modalDescription")
  closeModal = document.getElementById("closeModal")

  // Initialize card content
  updateCardContent(projectIndex)

  // Flip inner on card click
  projectCard.addEventListener("click", flipCard)

  cardLeftBtn.addEventListener("click", navigateLeft)
  cardRightBtn.addEventListener("click", navigateRight)

  readmeBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    showModal(projectIndex)
  })

  closeModal.addEventListener("click", hideModal)
  window.addEventListener("click", (e) => {
    if (e.target === modal) hideModal()
  })
})
