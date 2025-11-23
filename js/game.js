(function(){
  const mount = document.getElementById("gameMount");
  if(!mount) return;

  const scoreEl = document.getElementById("scoreEl");
  const livesEl = document.getElementById("livesEl");
  const startBtn = document.getElementById("gameStartBtn");
  const resetBtn = document.getElementById("gameResetBtn");

  const nameInput = document.getElementById("playerName");
  const submitBtn = document.getElementById("submitScoreBtn");
  const submitMsg = document.getElementById("submitMsg");
  const listEl = document.getElementById("leaderboardList");

  // Simple leaderboard localStorage
  function loadBoard(){
    return JSON.parse(localStorage.getItem("fv_board")||"[]");
  }
  function saveBoard(b){
    localStorage.setItem("fv_board", JSON.stringify(b.slice(0,10)));
  }
  function renderBoard(){
    const b = loadBoard();
    listEl.innerHTML = b.map(x=>`<li>${x.name} – ${x.score}</li>`).join("");
  }
  renderBoard();

  submitBtn.addEventListener("click", ()=>{
    const name = (nameInput.value||"anon").trim().slice(0,12);
    const b = loadBoard();
    b.push({name, score});
    b.sort((a,b)=>b.score-a.score);
    saveBoard(b);
    renderBoard();
    submitMsg.textContent = "Saved!";
    setTimeout(()=>submitMsg.textContent="",1200);
  });

  // Canvas
  const tile = 20;
  const cols = 21;
  const rows = 21;
  const w = cols*tile;
  const h = rows*tile;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  mount.innerHTML = "";
  mount.appendChild(canvas);

  // Map (0 empty, 1 wall, 2 pellet, 3 power, 4 ghost gate)
  const map = [
    "111111111111111111111",
    "122222222111222222221",
    "121111112111211111121",
    "123222212222212222321",
    "121111212111212111121",
    "122222212111212222221",
    "111111212111212111111",
    "000001212222212100000",
    "111101211111112101111",
    "000001214444412100000",
    "111101214000412101111",
    "000001214000412100000",
    "111101211111112101111",
    "000001212222212100000",
    "111111212111212111111",
    "122222212111212222221",
    "121111212111212111121",
    "123222212222212222321",
    "121111112111211111121",
    "122222222111222222221",
    "111111111111111111111",
  ].map(r=>r.split("").map(n=>+n));

  let score = 0;
  let lives = 3;
  let running = false;

  const player = {x:10,y:15,dir:{x:0,y:0},next:{x:0,y:0}};
  const ghosts = [
    {x:10,y:10,dir:{x:1,y:0},color:"#ff5c5c",out:false},
    {x:9,y:10, dir:{x:-1,y:0},color:"#66FAFF",out:false},
    {x:11,y:10,dir:{x:0,y:1},color:"#ffb347",out:false},
  ];

  function isWall(x,y){
    return map[y]?.[x]===1;
  }

  function draw(){
    ctx.clearRect(0,0,w,h);

    // draw map
    for(let y=0;y<rows;y++){
      for(let x=0;x<cols;x++){
        const v = map[y][x];
        if(v===1){
          ctx.fillStyle="#0b5560";
          ctx.fillRect(x*tile,y*tile,tile,tile);
        }else if(v===2){
          ctx.fillStyle="#fff";
          ctx.fillRect(x*tile+8,y*tile+8,4,4);
        }else if(v===3){
          ctx.fillStyle="#FFB347";
          ctx.beginPath();
          ctx.arc(x*tile+10,y*tile+10,5,0,Math.PI*2);
          ctx.fill();
        }else if(v===4){
          // ghost gate
          ctx.fillStyle="#0b5560";
          ctx.fillRect(x*tile,y*tile+8,tile,4);
        }
      }
    }

    // player
    ctx.fillStyle="#FFEB3B";
    ctx.beginPath();
    ctx.arc(player.x*tile+10, player.y*tile+10, 8, 0, Math.PI*2);
    ctx.fill();

    // ghosts
    ghosts.forEach(g=>{
      ctx.fillStyle=g.color;
      ctx.beginPath();
      ctx.arc(g.x*tile+10, g.y*tile+10, 8, 0, Math.PI*2);
      ctx.fill();
    });
  }

  function moveEntity(ent){
    // allow turning if next is free
    const nx = ent.x + ent.next.x;
    const ny = ent.y + ent.next.y;
    if(!isWall(nx,ny) && map[ny][nx]!==4){
      ent.dir = {...ent.next};
    }

    const tx = ent.x + ent.dir.x;
    const ty = ent.y + ent.dir.y;

    if(!isWall(tx,ty) && map[ty][tx]!==4){
      ent.x = tx; ent.y = ty;
    }
  }

  function playerStep(){
    moveEntity(player);
    const v = map[player.y][player.x];
    if(v===2){ map[player.y][player.x]=0; score+=10; }
    if(v===3){ map[player.y][player.x]=0; score+=50; }
  }

  function ghostStep(g){
    // first: get them out of pen through gate line (v=4)
    if(!g.out){
      // move upward until leaving gate area
      if(map[g.y][g.x]===0){
        g.out=true;
      }else{
        // inside pen, move up to gate opening
        const upFree = map[g.y-1][g.x]!==1;
        if(upFree){ g.y -= 1; }
        return;
      }
    }

    // random turn at intersections
    const dirs = [
      {x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}
    ].filter(d=>{
      const nx=g.x+d.x, ny=g.y+d.y;
      return !isWall(nx,ny) && map[ny][nx]!==4;
    });

    // choose new dir sometimes
    if(dirs.length>=3 || Math.random()<0.25){
      g.dir = dirs[Math.floor(Math.random()*dirs.length)];
    }

    const nx=g.x+g.dir.x, ny=g.y+g.dir.y;
    if(!isWall(nx,ny) && map[ny][nx]!==4){
      g.x=nx; g.y=ny;
    }else{
      if(dirs.length) g.dir=dirs[Math.floor(Math.random()*dirs.length)];
    }
  }

  function checkCollisions(){
    for(const g of ghosts){
      if(g.x===player.x && g.y===player.y){
        lives--;
        livesEl.textContent=lives;
        player.x=10; player.y=15; player.dir={x:0,y:0}; player.next={x:0,y:0};
        if(lives<=0){ running=false; }
      }
    }
  }

  function loop(){
    if(!running) return;
    playerStep();
    ghosts.forEach(ghostStep);
    checkCollisions();

    scoreEl.textContent=score;
    livesEl.textContent=lives;
    draw();

    requestAnimationFrame(loop);
  }

  // input
  window.addEventListener("keydown",(e)=>{
    const k=e.key.toLowerCase();
    if(k==="arrowleft"||k==="a") player.next={x:-1,y:0};
    if(k==="arrowright"||k==="d") player.next={x:1,y:0};
    if(k==="arrowup"||k==="w") player.next={x:0,y:-1};
    if(k==="arrowdown"||k==="s") player.next={x:0,y:1};
  });

  startBtn.addEventListener("click",()=>{
    if(running) return;
    running=true;
    loop();
  });

  resetBtn.addEventListener("click",()=>{
    // reset state
    score=0; lives=3; running=false;
    player.x=10; player.y=15; player.dir={x:0,y:0}; player.next={x:0,y:0};
    ghosts.forEach((g,i)=>{
      g.x=10+(i-1); g.y=10; g.dir={x:1,y:0}; g.out=false;
    });
    // restore pellets quickly
    for(let y=0;y<rows;y++){
      for(let x=0;x<cols;x++){
        if(map[y][x]===0 && (y>0&&y<rows-1&&x>0&&x<cols-1)){
          // don't refill walls or gate
          if(!isWall(x,y)) map[y][x]=2;
        }
      }
    }
    draw();
    scoreEl.textContent=score;
    livesEl.textContent=lives;
  });

  draw();
})();
