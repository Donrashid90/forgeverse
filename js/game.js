// AFTER canvas creation:
const mount = document.getElementById("gameMount");
if(mount){
  mount.innerHTML = "";
  mount.appendChild(canvas);
}
