
// controls Name fading in and out
window.addEventListener('scroll', function(event) {
  const name = document.querySelector('#webName');
  if (window.scrollY > 25) {
    if(name.classList.contains('animate__fadeIn')) { name.classList.remove('animate__animated', 'animate__fadeIn');}
    name.classList.add('animate__animated', 'animate__fadeOut');
  } 
  else if (window.scrollY < 25) {
    if(name.classList.contains('animate__fadeOut')) { name.classList.remove('animate__animated', 'animate__fadeOut');}
    name.classList.add('animate__animated', 'animate__fadeIn');
  }
 });

//dark / light mode control
const darkModeBtn = document.querySelector('#darkModeBtn');
darkModeBtn.addEventListener('click', () => {
  //switches dark mode buuton to light mode 
  darkModeBtn.innerHTML == "Dark Mode" ? darkModeBtn.innerHTML = "Light Mode" : darkModeBtn.innerHTML = "Dark Mode"; 
  darkModeBtn.classList.toggle('dark-mode-button');
  document.querySelector('body').classList.toggle('dark-mode');
  
  document.querySelector('.offcanvas').classList.toggle('dark-mode');
  document.querySelector('.offcanvas-header').classList.toggle('dark-mode');
  document.querySelector('#hamburgerMenu').classList.toggle('dark-mode-button');
  document.querySelector('#navBtn').classList.toggle('dark-mode-button');
  document.querySelector('#closeNav').classList.toggle('dark-mode-button');
  
  document.querySelector('#footer').classList.toggle('dark-mode');
  
});