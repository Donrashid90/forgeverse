(() => {
  const viewer = document.getElementById("docsViewer");
  const closeBtn = document.getElementById("docsClose");
  const cards = document.querySelectorAll(".docs__card");

  const docs = {
    whitepaper: document.getElementById("doc-whitepaper"),
    pitchdeck: document.getElementById("doc-pitchdeck"),
    roadmap: document.getElementById("doc-roadmap"),
  };

  function showDoc(key){
    Object.values(docs).forEach(d => d.classList.remove("active"));
    docs[key].classList.add("active");
    viewer.classList.add("show");
    const top = viewer.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior:"smooth" });
  }
  function hideDocs(){
    viewer.classList.remove("show");
    Object.values(docs).forEach(d => d.classList.remove("active"));
  }

  cards.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const key = btn.dataset.doc;
      if(viewer.classList.contains("show") && docs[key].classList.contains("active")){
        hideDocs();
      } else {
        showDoc(key);
      }
    });
  });
  closeBtn.addEventListener("click", hideDocs);

  // Mini pitchdeck
  const slides = [
    {t:"ForgeVerse", x:"A Pixel Economy on Solana"},
    {t:"Problem", x:"Web3 games lack sustainable utility."},
    {t:"Solution", x:"NFT roles produce real resources."},
    {t:"Core Loop", x:"Mint → Earn → Upgrade → Fuse → Play"},
    {t:"Fusion", x:"Burn 2 NFTs to create stronger units."},
    {t:"Call to Action", x:"Join early and shape the economy."},
  ];

  let i = 0;
  const pdSlide = document.getElementById("pdSlide");
  const pdCounter = document.getElementById("pdCounter");
  const pdPrev = document.getElementById("pdPrev");
  const pdNext = document.getElementById("pdNext");

  function render(){
    if(!pdSlide) return;
    pdSlide.innerHTML = `<h2>${slides[i].t}</h2><p>${slides[i].x}</p>`;
    pdCounter.textContent = `Slide ${i+1}/${slides.length}`;
  }
  if(pdSlide){
    render();
    pdPrev.onclick = ()=>{ i=(i-1+slides.length)%slides.length; render(); };
    pdNext.onclick = ()=>{ i=(i+1)%slides.length; render(); };
  }
})();
