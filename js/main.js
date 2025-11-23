diff --git a/js/main.js b/js/main.js
index 3119e3cf9ec80452f19fe2131b860ba94b30ec2d..8fd9247bfd0b3f9c2d03a17f40b0786be52cf1a4 100644
--- a/js/main.js
+++ b/js/main.js
@@ -21,25 +21,36 @@ window.demoMint = function(){
 
   if (!provider || !provider.isPhantom) {
     setInstall();
     return;
   }
 
   btn.addEventListener('click', async () => {
     try {
       const resp = await provider.connect({ onlyIfTrusted: false });
       const pubkey = resp.publicKey.toString();
       const short = pubkey.slice(0, 4) + '...' + pubkey.slice(-4);
       btn.textContent = 'Connected: ' + short;
       btn.disabled = true;
     } catch (e) {
       alert('Wallet connection canceled.');
     }
   });
 
   if (provider.isConnected && provider.publicKey) {
     const pk = provider.publicKey.toString();
     const short = pk.slice(0, 4) + '...' + pk.slice(-4);
     btn.textContent = 'Connected: ' + short;
     btn.disabled = true;
   }
 })();
+
+// Mobile nav toggle
+(function(){
+  const navToggle = document.getElementById('navToggle');
+  const nav = document.querySelector('.nav');
+  if(!navToggle || !nav) return;
+
+  navToggle.addEventListener('click', ()=> nav.classList.toggle('show'));
+  nav.querySelectorAll('a').forEach(link=> link.addEventListener('click', ()=> nav.classList.remove('show')));
+  window.addEventListener('resize', ()=>{ if(window.innerWidth>600) nav.classList.remove('show'); });
+})();
