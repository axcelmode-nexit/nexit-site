
const bg = document.getElementById("heroBg");

document.addEventListener("mousemove",(e)=>{
 const x = e.clientX / window.innerWidth - 0.5;
 const y = e.clientY / window.innerHeight - 0.5;

 bg.style.transform =
 `scale(1) translate(${x * 18}px, ${y * 18}px)`;
});
