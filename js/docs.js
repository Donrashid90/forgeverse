/* ============================================================
   ForgeVerse – Docs Handler (Whitepaper / Pitchdeck / Roadmap)
   Whitepaper = HTML Block (kein PDF)
   ============================================================ */

const docsCards = document.querySelectorAll('#fv-docs-cards .fv-card');

const pitchdeckSection   = document.getElementById('pitchdeck');
const roadmapSection     = document.getElementById('fv-roadmap');
const roadmapCloseBtn    = document.getElementById('fv-roadmap-close');

const whitepaperSection  = document.getElementById('fv-whitepaper');
const whitepaperCloseBtn = document.getElementById('fv-whitepaper-close');

/* Whitepaper open/close */
function openWhitepaper(){
  whitepaperSection.classList.add('show');
  const top = whitepaperSection.getBoundingClientRect().top + window.pageYOffset - 90;
  window.scrollTo({ top, behavior:'smooth' });
}
function closeWhitepaper(){
  whitepaperSection.classList.remove('show');
}

/* Pitchdeck open */
function openPitchdeck(){
  pitchdeckSection.style.maxHeight = "2000px";
  pitchdeckSection.style.opacity = "1";
  pitchdeckSection.style.padding = "40px 0 80px 0";

  const top = pitchdeckSection.getBoundingClientRect().top + window.pageYOffset - 90;
  window.scrollTo({ top, behavior:'smooth' });
}

/* Roadmap open/close */
function openRoadmap(){
  roadmapSection.classList.add('show');
  const top = roadmapSection.getBoundingClientRect().top + window.pageYOffset - 90;
  window.scrollTo({ top, behavior:'smooth' });
}
function closeRoadmap(){
  roadmapSection.classList.remove('show');
}

/* Button events */
docsCards.forEach(card=>{
  card.addEventListener('click', ()=>{
    const type = card.getAttribute('data-doc');
    if(type === 'whitepaper') openWhitepaper();
    if(type === 'pitchdeck')  openPitchdeck();
    if(type === 'roadmap')    openRoadmap();
  });
});

whitepaperCloseBtn.addEventListener('click', closeWhitepaper);
roadmapCloseBtn.addEventListener('click', closeRoadmap);

/* optional export */
window.ForgeDocs = {
  openWhitepaper, closeWhitepaper,
  openPitchdeck,
  openRoadmap, closeRoadmap
};

