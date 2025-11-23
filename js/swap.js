(function(){
  const fromAmt = document.getElementById("swapFromAmt");
  const fromTok = document.getElementById("swapFromToken");
  const toTok   = document.getElementById("swapToToken");
  const toAmt   = document.getElementById("swapToAmt");
  const btn     = document.getElementById("swapBtn");
  const msg     = document.getElementById("swapMsg");
  if(!btn) return;

  btn.addEventListener("click", ()=>{
    const a = Number(fromAmt.value||0);
    if(a<=0){ msg.textContent="Enter amount."; return; }
    if(fromTok.value===toTok.value){ msg.textContent="Choose different token."; return; }
    // demo rate
    const rate = 1;
    toAmt.value = (a*rate).toFixed(2);
    msg.textContent="Demo swap calculated. Real DEX later.";
  });
})();
