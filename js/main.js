(() => {

  /* Mobile Nav toggle */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if(toggle && nav){
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a=>{
      a.addEventListener("click", ()=> nav.classList.remove("open"));
    });
  }

  /* Docs switcher */
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
    const top = viewer.getBoundingClientRect().top + window.scrollY - 90;
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


  /* Pitchdeck slides (13) */
  const slides = [
    {title:"ForgeVerse", text:"A Pixel Economy on Solana"},
    {title:"Problem", text:"Web3 games lack sustainable utility and real loops."},
    {title:"Solution", text:"NFT roles produce resources: Traders, Farmers, Workers."},
    {title:"Core Loop", text:"Mint → Stake → Earn → Upgrade → Fuse → Repeat."},
    {title:"Roles", text:"Traders=$DOLLAR • Farmers=$FOOD • Workers=$METAL"},
    {title:"Token Sinks", text:"Each resource fuels its own sink to prevent runaway inflation."},
    {title:"Fusion Lab", text:"Burn 2 NFTs + resources to create a stronger Builder."},
    {title:"Mini-Game", text:"Pac-Forge boosts rewards & keeps gameplay skill-based."},
    {title:"Marketplace", text:"Trade Builders, tools, and resources with real utility."},
    {title:"Roadmap", text:"Genesis → Economy → Fusion → Game Expansion → Social Forge."},
    {title:"Community", text:"Guilds, ranking seasons, and in-site chat."},
    {title:"Why Solana", text:"Fast, cheap, and perfect for high-frequency game actions."},
    {title:"Call to Action", text:"Join early, mint Genesis Builders, and shape the economy."}
  ];

  let pdIndex = 0;
  const pdSlide = document.getElementById("pdSlide");
  const pdCounter = document.getElementById("pdCounter");
  const pdPrev = document.getElementById("pdPrev");
  const pdNext = document.getElementById("pdNext");

  function renderSlide(){
    const s = slides[pdIndex];
    pdSlide.innerHTML = `
      <h2>${s.title}</h2>
      <p>${s.text}</p>
    `;
    pdCounter.textContent = `Slide ${pdIndex+1}/${slides.length}`;
  }
  if(pdSlide){
    renderSlide();
    pdPrev.addEventListener("click", ()=>{
      pdIndex = (pdIndex-1+slides.length)%slides.length;
      renderSlide();
    });
    pdNext.addEventListener("click", ()=>{
      pdIndex = (pdIndex+1)%slides.length;
      renderSlide();
    });
  }


  /* Mint Demo */
  const mintBtn = document.getElementById("mintDemoBtn");
  if(mintBtn){
    mintBtn.addEventListener("click", ()=>{
      alert("Mint Demo: Coming soon. Genesis mint will be enabled after launch.");
    });
  }


  /* Phantom connect (simple) */
  const connectBtn = document.getElementById("connectBtn");
  if(connectBtn){
    const provider = window.solana || (window.phantom && window.phantom.solana) || null;

    function setInstall(){
      connectBtn.textContent = "Install Phantom";
      connectBtn.onclick = ()=> window.open("https://phantom.app/","_blank");
      connectBtn.style.backgroundColor = "#FFB347";
      connectBtn.disabled = false;
    }

    if(!provider || !provider.isPhantom){
      setInstall();
    } else {
      connectBtn.addEventListener("click", async ()=>{
        try{
          const resp = await provider.connect({ onlyIfTrusted:false });
          const pk = resp.publicKey.toString();
          connectBtn.textContent = "Connected: " + pk.slice(0,4)+"..."+pk.slice(-4);
          connectBtn.disabled = true;
          connectBtn.style.backgroundColor = "#66FAFF";
        } catch(e){
          alert("Wallet connection cancelled.");
        }
      });
    }
  }

})();
