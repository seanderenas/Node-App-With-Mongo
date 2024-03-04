
const aboutMeIMG = document.querySelector('#aboutMeIMG');
const aboutMeTextHidden = document.querySelector('#aboutMeTextHidden');
var showExtra = false
aboutMeIMG.addEventListener('click', () => {
  if(showExtra){ aboutMeTextHidden.classList.add('d-none'); showExtra = false }
  else{ aboutMeTextHidden.classList.remove('d-none'); showExtra = true }
});


window.addEventListener('scroll', function(event) {
  const name = document.querySelector('#webName');
  console.log(`${window.scrollY}`);
  
  if (window.scrollY > 25) {
    if(name.classList.contains('animate__fadeIn')) { name.classList.remove('animate__animated', 'animate__fadeIn');}
    name.classList.add('animate__animated', 'animate__fadeOut');
  } 
  else if (window.scrollY < 25) {
    if(name.classList.contains('animate__fadeOut')) { name.classList.remove('animate__animated', 'animate__fadeOut');}
    name.classList.add('animate__animated', 'animate__fadeIn');
  }
 });