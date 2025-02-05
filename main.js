
document.addEventListener('DOMContentLoaded', () => {
  const scrollArrow = document.querySelector('.scroll-arrow')
  scrollArrow.addEventListener('click', () => {
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' })
  })
})

window.addEventListener('DOMContentLoaded', () => {
  const textWrapper = document.querySelector('.title')
  textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g,"<span class='letter'>$&</span>")
  anime.timeline()
    .add({
      targets:'.title .letter',
      translateY:[100,0],
      opacity:[0,1],
      easing:'easeOutExpo',
      duration:750,
      delay:(el,i)=>50*i
    })

  setupPingPong()
  setupPendulum()

  const container = document.querySelector('.container')
  const sections = document.querySelectorAll('.section')
  const indicatorDots = document.querySelectorAll('.indicator-dot')

  const observerOptions = {
    root: container,
    threshold: 0.5
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let id = entry.target.getAttribute('id')
        indicatorDots.forEach(dot => {
          dot.classList.remove('active','animate__animated','animate__pulse')
          if(dot.getAttribute('data-target') === '#' + id){
            dot.classList.add('active','animate__animated','animate__pulse')
          }
        })
        if (id === 'hero') {
          startPingPong()
          stopPendulum()
        } else if (id === 'about') {
          stopPingPong()
          startPendulum()
        } else {
          stopPingPong()
          stopPendulum()
        }
      }
    })
  }, observerOptions)

  sections.forEach(section => {
    observer.observe(section)
  })

  indicatorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetId = e.target.getAttribute('data-target')
      document.querySelector(targetId).scrollIntoView({behavior:'smooth'})
    })
  })
})
