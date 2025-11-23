(function(){
  const cards  = document.querySelectorAll('#fv-docs-cards .fv-card');
  const viewer = document.getElementById('fv-docs-viewer');
  const close  = document.getElementById('fv-close-btn');

  const panels = {
    whitepaper: document.getElementById('doc-whitepaper'),
    pitchdeck:  document.getElementById('doc-pitchdeck'),
    roadmap:    document.getElementById('doc-roadmap'),
  };

  function showPanel(key){
    // toggle viewer
    if(viewer.classList.contains('show') && panels[key].classList.contains('active')){
      hideViewer();
      return;
    }
    Object.values(panels).forEach(p => p.classList.remove('active'));
    panels[key].classList.add('active');
    viewer.classList.add('show');

    const top = viewer.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top, behavior:'smooth' });
  }

  function hideViewer(){
    viewer.classList.remove('show');
    Object.values(panels).forEach(p => p.classList.remove('active'));
  }

  cards.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      showPanel(btn.dataset.doc);
    });
  });
  close.addEventListener('click', hideViewer);


  /* -------- Pitchdeck Slides ---------- */
  const slides = [
    { title:"Problem", body:[
      "Web3 games lack real utility",
      "NFT ecosystems often unsustainable",
      "No skill-based earning loops"
    ]},
    { title:"Solution", body:[
      "Builders with roles",
      "Traders → $DOLLAR",
      "Farmers → $FOOD",
      "Workers → $METAL"
    ]},
    { title:"Core Loop", body:[
      "Mint → Stake → Earn → Upgrade → Fuse → Play"
    ]},
    { title:"NFT Supply", body:[
      "1000 Genesis Builders",
      "10% Traders / 30% Farmers / 60% Workers"
    ]},
    { title:"Resources", body:[
      "$DOLLAR for upgrades & trading power",
      "$FOOD for feeding & efficiency boosts",
      "$METAL for tools & crafting"
    ]},
    { title:"Sinks & Balance", body:[
      "Each token feeds its own sink",
      "Burn mechanics prevent inflation"
    ]},
    { title:"Fusion Lab", body:[
      "Fuse 2 Builders + resources",
      "Creates stronger NFT",
      "Burn reduces supply"
    ]},
    { title:"Pac-Forge Game", body:[
      "Skill mini-game rewards boosts",
      "Keeps gameplay fun & active"
    ]},
    { title:"Social Layer", body:[
      "Chat, guilds, ranking seasons",
      "Retention & community"
    ]},
    { title:"Marketplace Utility", body:[
      "Resources tradable on DEX",
      "NFT holder perks"
    ]},
    { title:"Roadmap", body:[
      "Genesis → Economy → Fusion → Game → Social → DAO-lite"
    ]},
    { title:"Team", body:[
      "ForgeVerse Labs",
      "Community driven"
    ]},
    { title:"Call to Action", body:[
      "Mint Genesis",
      "Join the pixel economy"
    ]},
  ];

  let idx = 0;
  const slideEl = document.getElementById("pitchSlide");
  const counterEl = document.getElementById("pitchCounter");
  const prevBtn = document.getElementById("pitchPrev");
  const nextBtn = document.getElementById("pitchNext");

  function renderSlide(){
    const s = slides[idx];
    counterEl.textContent = `Slide ${idx+1}/${slides.length}`;
    slideEl.innerHTML = `
      <h4>${s.title}</h4>
      <ul>
        ${s.body.map(x=>`<li>${x}</li>`).join("")}
      </ul>
      <div class="pitch-cover"></div>
    `;
  }

  prevBtn?.addEventListener("click", ()=>{
    idx = (idx-1+slides.length)%slides.length;
    renderSlide();
  });
  nextBtn?.addEventListener("click", ()=>{
    idx = (idx+1)%slides.length;
    renderSlide();
  });

  renderSlide();
})();
