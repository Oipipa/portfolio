const skills = document.querySelectorAll('.skills-list li');

skills.forEach(skill => {
    skill.addEventListener('mouseover', () => {
        skill.style.backgroundColor = '#f0a383';
    });

    skill.addEventListener('mouseout', () => {
        skill.style.backgroundColor = '#de5568';
    });
});
