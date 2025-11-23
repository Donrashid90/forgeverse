/* ForgeVerse Pac-Forge MiniGame
   - Canvas Pac-Man style
   - Ghosts move & can leave spawn
   - Start / Reset
   - Name input + Submit Score
   - Leaderboard via localStorage
*/

(() => {
  const TILE = 18;
  const COLS = 21;
  const ROWS = 21;
  const SPEED_MS = 130;
  const POWER_MS = 6000;
  const GHOST_COUNT = 3;

  const MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,2,1,2,1,1,1,2,1,2,2,1,1,1,2,1],
    [1,3,1,0,1,2,2,2,2,2,2,2,2,2,2,2,1,0,1,3,1],
    [1,2,1,0,1,2,1,1,2,1,1,1,2,1,1,2,1,0,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,2,1,1,1,0,1,1,1,2,2,1,1,1,2,1],
    [1,2,2,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,2,2,1],
    [1,1,1,2,1,2,1,1,1,2,2,2,1,1,1,2,1,2,1,1,1],
    [1,2,2,2,2,2,1,0,2,2,0,2,2,0,1,2,2,2,2,2,1],
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

  const scoreEl = document.getElementById("scoreVal");
  const livesEl = document.getElementById("livesVal");
  const startBtn = document.getElementById("startGameBtn");
  const resetBtn = document.getElementById("resetGameBtn");
  const nameInput = document.getElementById("playerName");
  const submitBtn = document.getElementById("submitScoreBtn");
  const boardList = document.getElementById("leaderboardList");

  let grid, pac, ghosts, score, lives, running, tickTimer;
  let dir = {x:0,y:0}, nextDir = {x:0,y:0};
  let powerUntil = 0;

  function cloneMap() { return MAP.map(r => r.slice()); }
  const isWall = (x,y) => grid[y]?.[x] === 1;
  const cellVal = (x,y) => grid[y]?.[x];

  function resetGame() {
    grid = cloneMap();
    score = 0; lives = 3; running = false; powerUntil = 0;
    pac = {x:10, y:15};

    ghosts = [];
    const spawns = [{x:10,y:9},{x:9,y:9},{x:11,y:9}];
    for (let i=0;i<GHOST_COUNT;i++){
      ghosts.push({
        x: spawns[i].x, y: spawns[i].y, vx:0, vy:0,
        color: ["#ff5a5a","#5affc7","#c58cff"][i], scared:false
      });
    }

    dir={x:0,y:0}; nextDir={x:0,y:0};
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

  window.addEventListener("keydown",(e)=>{
    const k=e.key.toLowerCase();
    if(k==="arrowleft"||k==="a") nextDir={x:-1,y:0};
    if(k==="arrowright"||k==="d") nextDir={x:1,y:0};
    if(k==="arrowup"||k==="w") nextDir={x:0,y:-1};
    if(k==="arrowdown"||k==="s") nextDir={x:0,y:1};
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
          lives--; updateHud();
          if(lives<=0) stopGame();
          else { pac.x=10; pac.y=15; dir={x:0,y:0}; nextDir={x:0,y:0}; }
        }
      }
    });

    updateHud(); draw();
  }

  function startGame(){
    if(running) return;
    running=true;
    tickTimer=setInterval(step,SPEED_MS);
  }

  function stopGame(){
    running=false;
    clearInterval(tickTimer);
    tickTimer=null;
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
    ctx.beginPath();
    ctx.arc(pac.x*TILE+TILE/2,pac.y*TILE+TILE/2,TILE*0.38,0,Math.PI*2);
    ctx.fill();

    ghosts.forEach(g=>{
      const gx=g.x*TILE+TILE/2, gy=g.y*TILE+TILE/2;
      ctx.fillStyle=g.scared?"#66FAFF":g.color;
      ctx.beginPath(); ctx.arc(gx,gy,TILE*0.38,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#000";
      ctx.beginPath();
      ctx.arc(gx-3,gy-2,2,0,Math.PI*2);
      ctx.arc(gx+3,gy-2,2,0,Math.PI*2);
      ctx.fill();
    });

    if(!running && lives<=0){
      ctx.fillStyle="rgba(0,0,0,0.6)";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="#FFB347";
      ctx.font="16px 'Press Start 2P', monospace";
      ctx.textAlign="center";
      ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    }
  }

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
  }

  startBtn?.addEventListener("click", startGame);
  resetBtn?.addEventListener("click", ()=>{ stopGame(); resetGame(); });
  submitBtn?.addEventListener("click", submitScore);

  resetGame();
  renderBoard();
})();
