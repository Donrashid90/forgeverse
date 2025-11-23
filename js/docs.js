/* ===== ForgeVerse Docs Engine ===== */
(function(){
  const cards  = document.querySelectorAll('.fv-card');
  const viewer = document.getElementById('fv-docs-viewer');
  const close  = document.getElementById('fv-close-btn');

  const panels = {
    whitepaper: document.getElementById('doc-whitepaper'),
    pitchdeck:  document.getElementById('doc-pitchdeck'),
    roadmap:    document.getElementById('doc-roadmap')
  };

  function showPanel(key){
    Object.values(panels).forEach(p=>p.style.display='none');
    panels[key].style.display='block';
    viewer.classList.add('show');
    const top = viewer.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top, behavior:'smooth' });
  }

  function hideViewer(){
    viewer.classList.remove('show');
  }

  cards.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.dataset.doc;
      if(!key || !panels[key]) return;
      // toggle
      if(viewer.classList.contains('show') && panels[key].style.display==='block'){
        hideViewer();
      }else{
        showPanel(key);
      }
    });
  });

  close?.addEventListener('click', hideViewer);
})();
