(function(){
  const btn = document.getElementById("chatToggleBtn");
  const panel = document.getElementById("chatPanel");
  if(!btn || !panel) return;

  btn.addEventListener("click", ()=>{
    panel.classList.toggle("show");
    btn.textContent = panel.classList.contains("show") ? "Close Chat" : "Open Chat";
    // Minnit span anzeigen wenn geöffnet
    const span = panel.querySelector(".minnit-chat-sembed");
    if(span) span.style.display = panel.classList.contains("show") ? "inline-block" : "none";
  });
})();
