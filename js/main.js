diff --git a/js/main.js b/js/main.js
index 3119e3cf9ec80452f19fe2131b860ba94b30ec2d..14e75308993f1707da6e93ead0c65b118e10765f 100644
--- a/js/main.js
+++ b/js/main.js
@@ -1,45 +1,90 @@
-// Mint Demo
-window.demoMint = function(){
-  alert("Mint Demo – Candy Machine will be connected later.");
-};
-
 // Phantom connect (simple)
 (function () {
   const btn = document.getElementById('connectBtn');
+  const status = document.getElementById('walletStatus');
   if (!btn) return;
 
+  function setStatus(msg) {
+    if (status) status.textContent = `Wallet: ${msg}`;
+  }
+
   function setInstall() {
     btn.textContent = 'Install Phantom';
     btn.disabled = false;
     btn.onclick = () => window.open('https://phantom.app/', '_blank');
+    setStatus('Phantom not detected');
   }
 
   const provider =
     window.solana ||
     (window.phantom && window.phantom.solana) ||
     null;
 
   if (!provider || !provider.isPhantom) {
     setInstall();
     return;
   }
 
-  btn.addEventListener('click', async () => {
+  async function connect() {
     try {
       const resp = await provider.connect({ onlyIfTrusted: false });
       const pubkey = resp.publicKey.toString();
       const short = pubkey.slice(0, 4) + '...' + pubkey.slice(-4);
-      btn.textContent = 'Connected: ' + short;
-      btn.disabled = true;
+      btn.textContent = 'Disconnect';
+      btn.dataset.connected = 'true';
+      setStatus(`Connected: ${short}`);
+      btn.disabled = false;
     } catch (e) {
-      alert('Wallet connection canceled.');
+      setStatus('Connection canceled');
+    }
+  }
+
+  async function disconnect() {
+    try { await provider.disconnect(); } catch { /* noop */ }
+    btn.textContent = 'Connect Wallet';
+    btn.dataset.connected = '';
+    setStatus('Disconnected');
+  }
+
+  btn.addEventListener('click', async () => {
+    if (btn.dataset.connected) {
+      await disconnect();
+    } else {
+      await connect();
     }
   });
 
   if (provider.isConnected && provider.publicKey) {
     const pk = provider.publicKey.toString();
     const short = pk.slice(0, 4) + '...' + pk.slice(-4);
-    btn.textContent = 'Connected: ' + short;
-    btn.disabled = true;
+    btn.textContent = 'Disconnect';
+    btn.dataset.connected = 'true';
+    setStatus(`Connected: ${short}`);
+  } else {
+    setStatus('Ready to connect');
   }
+
+  provider.on?.('connect', publicKey => {
+    const pk = publicKey?.toString?.() || '';
+    const short = pk ? pk.slice(0, 4) + '...' + pk.slice(-4) : 'Connected';
+    btn.textContent = 'Disconnect';
+    btn.dataset.connected = 'true';
+    setStatus(`Connected: ${short}`);
+  });
+  provider.on?.('disconnect', () => {
+    btn.textContent = 'Connect Wallet';
+    btn.dataset.connected = '';
+    setStatus('Disconnected');
+  });
+})();
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
 })();
