diff --git a/js/swap.js b/js/swap.js
index 531471bd3dd1de6fb7e47ee8fd25118126f676f3..2628284be1b315b94f04dcef42970c2d1026a569 100644
--- a/js/swap.js
+++ b/js/swap.js
@@ -1,19 +1,28 @@
 (function(){
   const fromAmt = document.getElementById("swapFromAmt");
   const fromTok = document.getElementById("swapFromToken");
   const toTok   = document.getElementById("swapToToken");
   const toAmt   = document.getElementById("swapToAmt");
   const btn     = document.getElementById("swapBtn");
   const msg     = document.getElementById("swapMsg");
   if(!btn) return;
 
-  btn.addEventListener("click", ()=>{
+  const rates = {
+    DOLLAR: { FOOD: 1.2, METAL: 0.9 },
+    FOOD:   { DOLLAR: 0.8, METAL: 1.1 },
+    METAL:  { DOLLAR: 1.05, FOOD: 0.92 },
+  };
+
+  function calc(){
     const a = Number(fromAmt.value||0);
-    if(a<=0){ msg.textContent="Enter amount."; return; }
-    if(fromTok.value===toTok.value){ msg.textContent="Choose different token."; return; }
-    // demo rate
-    const rate = 1;
+    if(!a){ toAmt.value = ""; msg.textContent=""; return; }
+    if(fromTok.value===toTok.value){ msg.textContent="Choose two different tokens."; return; }
+    const rate = rates[fromTok.value]?.[toTok.value];
+    if(!rate){ msg.textContent="Rate missing (edit js/swap.js)."; return; }
     toAmt.value = (a*rate).toFixed(2);
-    msg.textContent="Demo swap calculated. Real DEX later.";
-  });
+    msg.textContent = `Demo swap: 1 ${fromTok.value} = ${rate} ${toTok.value}`;
+  }
+
+  [fromAmt, fromTok, toTok].forEach(el=> el?.addEventListener('input', calc));
+  btn.addEventListener("click", calc);
 })();
