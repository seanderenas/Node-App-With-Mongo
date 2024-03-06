
// controls Name fading in and out
window.addEventListener('scroll', function(event) {
  const name = document.querySelector('#webName');
  if (window.scrollY > 25) {
    if(name.classList.contains('animate__fadeInLeft')) { name.classList.remove('animate__animated', 'animate__fadeInLeft');}
    name.classList.add('animate__animated', 'animate__fadeOutLeft');
  } 
  else if (window.scrollY < 25) {
    if(name.classList.contains('animate__fadeOutLeft')) { name.classList.remove('animate__animated', 'animate__fadeOutLeft');}
    name.classList.add('animate__animated', 'animate__fadeInLeft');
  }
 });

//dark / light mode control
const darkModeBtn = document.querySelector('#darkModeBtn');
const links = document.querySelectorAll('.navLink');
darkModeBtn.addEventListener('click', () => {
  //switches dark mode buuton to light mode 
  darkModeBtn.innerHTML == "<strong>Dark Mode</strong>" ? darkModeBtn.innerHTML = "<strong>Light Mode</strong>" : darkModeBtn.innerHTML = "<strong>Dark Mode</strong>"; 
  darkModeBtn.classList.toggle('dark-mode-button');
  document.querySelector('body').classList.toggle('dark-mode');
  
  document.querySelector('.offcanvas').classList.toggle('dark-mode');
  document.querySelector('.offcanvas-header').classList.toggle('dark-mode');
  document.querySelector('#hamburgerMenu').classList.toggle('dark-mode-button');
  document.querySelector('#navBtn').classList.toggle('dark-mode-button');
  document.querySelector('#closeNav').classList.toggle('dark-mode-button');
  
  document.querySelector('#footer').classList.toggle('dark-mode');
  for(var i=0; i<links.length;i++){
    links[i].classList.toggle('dark-mode');
  }
});
//used for changing nav - to +
const navLinks = document.querySelectorAll('.navLinks');
navLinks.forEach(function(link) {
  link.addEventListener('mouseover', () => {
    link.firstElementChild.firstElementChild.style.transform = 'rotate(90deg)';
    link.children[0].children[0].classList.add('navLinkHover');
    link.children[1].children[0].classList.add('navLinkHover');

  });
});
navLinks.forEach(function(link) {
  link.addEventListener('mouseout', () => {
    link.firstElementChild.firstElementChild.style.transform = 'rotate(0deg)';
    link.children[0].children[0].classList.remove('navLinkHover');
    link.children[1].children[0].classList.remove('navLinkHover');
  });
});

//used for welcome image animations 
const welcomeName = document.querySelector('#welcomeName');
const welcomeIMG = document.querySelector('#welcomeIMG');
welcomeIMG.classList.add('animate__animated');
welcomeName.addEventListener('mouseover', () => {
  welcomeIMG.classList.toggle('animate__tada');
});
welcomeIMG.addEventListener("animationend", () => {
  welcomeIMG.classList.remove('animate__tada')
});