(() => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if(toggle && nav){
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a=>{
      a.addEventListener("click", ()=> nav.classList.remove("open"));
    });
  }

  const mintBtn = document.getElementById("mintDemoBtn");
  if(mintBtn){
    mintBtn.addEventListener("click", ()=>{
      alert("Mint Demo: Genesis mint goes live soon.");
    });
  }
})();
