diff --git a/js/game.js b/js/game.js
index 84155038eeb395c1283dbc8662715afb58761940..6367e1dc9d143a9dbb3ccd57a7780b5d9088d75f 100644
--- a/js/game.js
+++ b/js/game.js
@@ -28,172 +28,206 @@
     [1,2,1,1,1,2,1,0,1,1,0,1,1,0,1,2,1,1,1,2,1],
     [1,2,2,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,2,2,1],
     [1,2,1,2,1,1,1,1,1,2,2,2,1,1,1,1,1,2,1,2,1],
     [1,2,1,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,1,2,1],
     [1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1],
     [1,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,1],
     [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
     [1,3,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,1],
     [1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1],
     [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
   ];
 
   const mount = document.getElementById("gameMount");
   if (!mount) return console.warn("gameMount not found.");
   mount.innerHTML = "";
 
   const canvas = document.createElement("canvas");
   canvas.width = COLS * TILE;
   canvas.height = ROWS * TILE;
   canvas.style.display = "block";
   canvas.style.margin = "0 auto";
   mount.appendChild(canvas);
   const ctx = canvas.getContext("2d");
 
-  const scoreEl = document.getElementById("scoreVal");
-  const livesEl = document.getElementById("livesVal");
-  const startBtn = document.getElementById("startGameBtn");
-  const resetBtn = document.getElementById("resetGameBtn");
+  const scoreEl = document.getElementById("scoreEl");
+  const livesEl = document.getElementById("livesEl");
+  const statusEl = document.getElementById("gameStatus");
+  const startBtn = document.getElementById("gameStartBtn");
+  const resetBtn = document.getElementById("gameResetBtn");
   const nameInput = document.getElementById("playerName");
   const submitBtn = document.getElementById("submitScoreBtn");
+  const submitMsg = document.getElementById("submitMsg");
   const boardList = document.getElementById("leaderboardList");
+  const touchBtns = document.querySelectorAll(".game-btn");
 
   let grid, pac, ghosts, score, lives, running, tickTimer;
   let dir = {x:0,y:0}, nextDir = {x:0,y:0};
   let powerUntil = 0;
 
+  const setStatus = (msg) => { statusEl && (statusEl.textContent = msg); };
+
   function cloneMap() { return MAP.map(r => r.slice()); }
   const isWall = (x,y) => grid[y]?.[x] === 1;
   const cellVal = (x,y) => grid[y]?.[x];
 
+  const ghostSpawns = [{x:10,y:9},{x:9,y:9},{x:11,y:9}];
+
+  function createGhosts(){
+    const colors = ["#ff5a5a","#5affc7","#c58cff"];
+    return ghostSpawns.map((s,i)=>({ x:s.x, y:s.y, vx:0, vy:0, color: colors[i], scared:false }));
+  }
+
   function resetGame() {
     grid = cloneMap();
     score = 0; lives = 3; running = false; powerUntil = 0;
     pac = {x:10, y:15};
 
-    ghosts = [];
-    const spawns = [{x:10,y:9},{x:9,y:9},{x:11,y:9}];
-    for (let i=0;i<GHOST_COUNT;i++){
-      ghosts.push({
-        x: spawns[i].x, y: spawns[i].y, vx:0, vy:0,
-        color: ["#ff5a5a","#5affc7","#c58cff"][i], scared:false
-      });
-    }
+    ghosts = createGhosts();
 
     dir={x:0,y:0}; nextDir={x:0,y:0};
+    if(submitMsg) submitMsg.textContent = "";
+    setStatus("Press Start or arrow keys to begin.");
     updateHud(); draw();
   }
 
   function updateHud(){
     scoreEl && (scoreEl.textContent = score);
     livesEl && (livesEl.textContent = lives);
   }
 
   function tryMove(e, vx, vy){
     const nx=e.x+vx, ny=e.y+vy;
     if(!isWall(nx,ny)){ e.x=nx; e.y=ny; return true; }
     return false;
   }
 
   function availableDirs(x,y, forbidReverse){
     const dirs=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
     return dirs.filter(d=>{
       if(isWall(x+d.x,y+d.y)) return false;
       if(forbidReverse && d.x===-forbidReverse.x && d.y===-forbidReverse.y) return false;
       return true;
     });
   }
 
   const manhattan=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
 
+  function setDirection(dirKey){
+    if(dirKey==="left") nextDir={x:-1,y:0};
+    if(dirKey==="right") nextDir={x:1,y:0};
+    if(dirKey==="up") nextDir={x:0,y:-1};
+    if(dirKey==="down") nextDir={x:0,y:1};
+  }
+
   window.addEventListener("keydown",(e)=>{
     const k=e.key.toLowerCase();
-    if(k==="arrowleft"||k==="a") nextDir={x:-1,y:0};
-    if(k==="arrowright"||k==="d") nextDir={x:1,y:0};
-    if(k==="arrowup"||k==="w") nextDir={x:0,y:-1};
-    if(k==="arrowdown"||k==="s") nextDir={x:0,y:1};
+    if(k==="arrowleft"||k==="a") setDirection("left");
+    if(k==="arrowright"||k==="d") setDirection("right");
+    if(k==="arrowup"||k==="w") setDirection("up");
+    if(k==="arrowdown"||k==="s") setDirection("down");
+    if(!running && (k.startsWith("arrow") || ["w","a","s","d"].includes(k))) startGame();
   });
 
   function step(){
     if(!isWall(pac.x+nextDir.x,pac.y+nextDir.y)) dir=nextDir;
     tryMove(pac,dir.x,dir.y);
 
     const v=cellVal(pac.x,pac.y);
     if(v===2){ grid[pac.y][pac.x]=0; score+=10; }
     if(v===3){ grid[pac.y][pac.x]=0; score+=50; powerUntil=Date.now()+POWER_MS; }
 
     const powered=Date.now()<powerUntil;
 
     ghosts.forEach(g=>{
       g.scared=powered;
       const blocked=isWall(g.x+g.vx,g.y+g.vy);
       const choices=availableDirs(g.x,g.y, blocked?null:{x:g.vx,y:g.vy});
 
       if(blocked || choices.length>=3 || (choices.length>1 && Math.random()<0.25)){
         let best=choices[0];
         if(!g.scared){
           best=choices.reduce((acc,d)=>{
             const dist=manhattan({x:g.x+d.x,y:g.y+d.y},pac);
             return dist<manhattan({x:g.x+acc.x,y:g.y+acc.y},pac)?d:acc;
           },choices[0]);
         } else {
           best=choices.reduce((acc,d)=>{
             const dist=manhattan({x:g.x+d.x,y:g.y+d.y},pac);
             return dist>manhattan({x:g.x+acc.x,y:g.y+acc.y},pac)?d:acc;
           },choices[0]);
         }
         g.vx=best.x; g.vy=best.y;
       }
       tryMove(g,g.vx,g.vy);
     });
 
     ghosts.forEach(g=>{
       if(g.x===pac.x && g.y===pac.y){
         if(powered){
           score+=200; g.x=10; g.y=9; g.vx=0; g.vy=0;
         } else {
-          lives--; updateHud();
-          if(lives<=0) stopGame();
-          else { pac.x=10; pac.y=15; dir={x:0,y:0}; nextDir={x:0,y:0}; }
+          handleLifeLoss();
         }
       }
     });
 
     updateHud(); draw();
   }
 
+  function handleLifeLoss(){
+    lives--; updateHud();
+    if(lives<=0){
+      stopGame("Game over! Press Start to play again.");
+      draw();
+      return;
+    }
+
+    running=false;
+    clearInterval(tickTimer); tickTimer=null;
+    pac={x:10,y:15}; dir={x:0,y:0}; nextDir={x:0,y:0};
+    ghosts=createGhosts();
+    powerUntil=0;
+    setStatus(`Life lost. Lives left: ${lives}. Press Start or use arrows/D-pad to resume.`);
+    draw();
+  }
+
   function startGame(){
     if(running) return;
+    if(lives<=0) resetGame();
+    if(nextDir.x===0 && nextDir.y===0) nextDir={x:1,y:0};
     running=true;
+    setStatus("Game running! Eat dots, grab power pellets, avoid ghosts.");
     tickTimer=setInterval(step,SPEED_MS);
   }
 
-  function stopGame(){
+  function stopGame(message){
     running=false;
     clearInterval(tickTimer);
     tickTimer=null;
+    if(message) setStatus(message);
   }
 
   function draw(){
     ctx.clearRect(0,0,canvas.width,canvas.height);
     ctx.fillStyle="#050508";
     ctx.fillRect(0,0,canvas.width,canvas.height);
 
     for(let y=0;y<ROWS;y++){
       for(let x=0;x<COLS;x++){
         const c=grid[y][x];
         const px=x*TILE, py=y*TILE;
         if(c===1){
           ctx.fillStyle="#66FAFF"; ctx.fillRect(px,py,TILE,TILE);
           ctx.fillStyle="#081014"; ctx.fillRect(px+3,py+3,TILE-6,TILE-6);
         } else if(c===2){
           ctx.fillStyle="#fff"; ctx.beginPath();
           ctx.arc(px+TILE/2,py+TILE/2,2,0,Math.PI*2); ctx.fill();
         } else if(c===3){
           ctx.fillStyle="#FFB347"; ctx.beginPath();
           ctx.arc(px+TILE/2,py+TILE/2,4,0,Math.PI*2); ctx.fill();
         }
       }
     }
 
     ctx.fillStyle="#FFB347";
@@ -224,34 +258,44 @@
 
   function loadBoard(){
     try{ return JSON.parse(localStorage.getItem("fv_pac_board")||"[]"); }
     catch{ return []; }
   }
   function saveBoard(list){
     localStorage.setItem("fv_pac_board", JSON.stringify(list.slice(0,10)));
   }
   function renderBoard(){
     if(!boardList) return;
     const list=loadBoard();
     boardList.innerHTML="";
     list.forEach((e,i)=>{
       const li=document.createElement("li");
       li.textContent=`${i+1}. ${e.name} — ${e.score}`;
       boardList.appendChild(li);
     });
   }
   function submitScore(){
     const name=(nameInput?.value||"").trim()||"Anon";
     const list=loadBoard();
     list.push({name, score, t:Date.now()});
     list.sort((a,b)=>b.score-a.score);
     saveBoard(list);
     renderBoard();
+    if(submitMsg){
+      submitMsg.textContent = `Gespeichert: ${name} (${score} Punkte)`;
+      setTimeout(()=>{ if(submitMsg.textContent.startsWith("Gespeichert")) submitMsg.textContent=""; }, 2500);
+    }
   }
 
   startBtn?.addEventListener("click", startGame);
   resetBtn?.addEventListener("click", ()=>{ stopGame(); resetGame(); });
   submitBtn?.addEventListener("click", submitScore);
+  touchBtns.forEach(btn=>{
+    btn.addEventListener("click", ()=>{
+      setDirection(btn.dataset.dir);
+      startGame();
+    });
+  });
 
   resetGame();
   renderBoard();
 })();
