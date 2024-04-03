const darkModeBtn = document.querySelector('#darkModeBtn');
const links = document.querySelectorAll('.navLink');
const navLinks = document.querySelectorAll('.navLinks');
const welcomeName = document.querySelector('#welcomeName');
const welcomeIMG = document.querySelector('#welcomeIMG');
const icons = document.querySelectorAll('.icons img');
let animate = true;

//sleep function for async functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
darkModeBtn.addEventListener('click', darkModeToggle);
function darkModeToggle(){
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
  document.querySelector('#signInBtn').classList.toggle('dark-mode');
  for(var i=0; i<links.length;i++){links[i].classList.toggle('dark-mode');}
  for(var i=0; i<icons.length;i++){icons[i].classList.toggle('iconsBlack');}
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log('dark mode engage');
  darkModeToggle();
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  console.log('light mode initiated');
} else {
  console.log('default');
}

//used for Rotating nav <'s 
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
welcomeIMG.classList.add('animate__animated');
welcomeName.addEventListener('mouseover', () => {
  if (animate) welcomeIMG.classList.toggle('animate__tada');
  animate = false;
});
welcomeIMG.addEventListener("animationend", () => {
  welcomeIMG.classList.remove('animate__tada')
  animate = true;
});

/* used for typing hello world on landing page */
let typed = new Typed('#typed', {
  strings: [`“Hello Borl`, `“Hello World!” `],
  startDelay: 400,
  typeSpeed: 70,
  backSpeed: 100,
  backDelay: 10,
  smartBackspace: true, // start where first string ends
  onComplete: (self) => { // turn cursor into space text
    sleep(2000).then(() => {
      document.querySelector('.typed-cursor').classList.add('animate__animated', 'animate__fadeOut'); // typed-cursor--blink      
      document.querySelector('.typed-cursor').classList.remove('typed-cursor--blink');
    });
  }
});


