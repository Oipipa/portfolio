let projectIndex = 0
let isAnimating = false

let projectsData = [
    {
    title: "Nepal Incident Reporting Platform",
    techStack: ["FastAPI", "Postgres", "NextJS", "Websockets", "GeoJSON"],
    description: `
    Source code at <a href="https://github.com/Oipipa/protest_backend.git">here</a> and <a href="https://github.com/Oipipa/status-dispay.git">here</a> (Not in production)
      <ul>
        <li>Incident/road blockage reporting application for the September 2025 protest in Nepal.</li>
        <li>Features allowed users to place pins on Nepal's map to pinpoint and speak out on their issue. </li>
        <li>Websockets used to continuously update due to the sensitive nature of the situation.</li>
      </ul>
    <img
        src="demos/nepal.png"
        alt="Bytsey homepage"
        loading="lazy" decoding="async"
        style="
          display:block;
          max-width:100%;
          width:100%;
          height:auto;
          max-height:60vh;         /* never taller than the viewport */
          background:#000;         /* looks clean if it doesn’t fill */
          border-radius:8px;
          margin-top:12px;
        "
      />
    `
  },
              {
    title: "EEG Emotional State Classification",
    techStack: ["Ensembling Methods", "Tensorflow", "Numpy", "Matplotlib", "Logistic Regression"],
    description: `
    Notebooks and report are over <a href="https://github.com/Oipipa/EEG-emotional-state-classifier.git">here</a>
      <ul>
<li>Built an end-to-end EEG classification pipeline in Python; aggregated raw time-series signals into tabular
form by computing band power features (delta to gamma) via Welch's method.</li>
<li>Generated 22 domain-specific features (20 brain, 2 machine) and trained multiple classifiers; CNN achieved
top accuracy (96%), outperforming Random Forest, XGBoost, and SVM models.</li>
<li>Applied cross-validation, dropout regularization, and early stopping to prevent overfitting; validated results
across held-out test sets.</li>
<li>Demonstrated that deep models could generalize EEG-based intent detection with minimal preprocessing
and hand-crafted features.</li>
      </ul>

      <img
        src="demos/Jupyternotebook.png"
        alt="Bytsey homepage"
        loading="lazy" decoding="async"
        style="
          display:block;
          max-width:100%;
          width:100%;
          height:auto;
          max-height:60vh;         /* never taller than the viewport */
          background:#000;         /* looks clean if it doesn’t fill */
          border-radius:8px;
          margin-top:12px;
        "
      />
    `
  },
  {
    title: "Bytsey Artstore",
    techStack: ["NextJS", "EmailJS", "Color Theory"],
    description: `
    Deployed <a href="https://bytsey.vercel.app/">here</a>
      <ul>
        <li>Built and designed an artstore with a dynamically shifting colour palette moving along a spectrum.</li>
        <li>Used EmailJS to redirect clients to email to inquire about specific products.</li>
      </ul>

      <video controls playsinline
            style="display:block;width:100%;max-width:100%;height:auto;max-height:60vh;
                    background:#000;border-radius:8px;margin-top:12px;">
        <source src="demos/bytsey.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `
  },
      {
    title: "Flood Monitoring Application",
    techStack: ["Express", "Angular", "GeoJSON", "MongoDB", "Websockets"],
    description: `
    Deployed at <a href="https://floodmonitoring.fly.dev/">here</a>
      <ul>
        <li>Built a flood monitoring system in Austria, integrating real-time water level data into a map.</li>
        <li>Basic Authentication method (email, OTP, registered, make flood reports)</li>
      </ul>

      <img
        src="demos/Flood.png"
        alt="Bytsey homepage"
        loading="lazy" decoding="async"
        style="
          display:block;
          max-width:100%;
          width:100%;
          height:auto;
          max-height:60vh;         /* never taller than the viewport */
          background:#000;         /* looks clean if it doesn’t fill */
          border-radius:8px;
          margin-top:12px;
        "
      />
    `
  },
        {
    title: "AutoCensor in MP3 Files",
    techStack: ["FastAPI", "PyDub", "WhisperModel", "NextJS"],
    description: `
    Deployed at <a href="https://mp3-censor.vercel.app/">here</a>
      <ul>
        <li>Detects words in an mp3, generates diagnostics and auto censors selected words</li>
        <li>Allows users to adjust padding before/after words, beep frequency, add custom SFX for censoring. </li>
      </ul>

      <img
        src="demos/mp3_censor.png"
        alt="Bytsey homepage"
        loading="lazy" decoding="async"
        style="
          display:block;
          max-width:100%;
          width:100%;
          height:auto;
          max-height:60vh;         /* never taller than the viewport */
          background:#000;         /* looks clean if it doesn’t fill */
          border-radius:8px;
          margin-top:12px;
        "
      />
    `
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
