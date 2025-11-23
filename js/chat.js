/* ===== ForgeVerse Chat Toggle ===== */
(function(){
  const chatBtn = document.querySelector('[data-doc="chat"]'); // falls du Button hast
  const chatPanel = document.getElementById('chatPanel');

  if(!chatBtn || !chatPanel) return;

  chatBtn.addEventListener('click', ()=>{
    chatPanel.classList.toggle('show');
  });
})();
