diff --git a/js/demos.js b/js/demos.js
new file mode 100644
index 0000000000000000000000000000000000000000..11979489ee31c80cdf5b065a057915f37e7a263a
--- /dev/null
+++ b/js/demos.js
@@ -0,0 +1,235 @@
+(() => {
+  const STORE_KEY = "fv_demo_nfts";
+  const statsEl = document.getElementById("nftStats");
+  const listEl = document.getElementById("nftList");
+  const stakeEl = document.getElementById("stakeList");
+  const stakeLog = document.getElementById("stakeLog");
+  const fusionA = document.getElementById("fusionA");
+  const fusionB = document.getElementById("fusionB");
+  const fusionMsg = document.getElementById("fusionMsg");
+  const mintMsg = document.getElementById("mintMsg");
+
+  if (!listEl) return; // page not loaded
+
+  const roles = {
+    Trader: { resource: "$DOLLAR", rate: 4, color: "#66FAFF" },
+    Farmer: { resource: "$FOOD", rate: 6, color: "#9cff7a" },
+    Worker: { resource: "$METAL", rate: 5, color: "#ffb347" },
+    Fusion: { resource: "Boost", rate: 8, color: "#c58cff" },
+  };
+
+  function load() {
+    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
+    catch { return []; }
+  }
+  function save() {
+    localStorage.setItem(STORE_KEY, JSON.stringify(nfts));
+  }
+
+  let nfts = load();
+
+  function shortId() {
+    return "FV" + Math.random().toString(16).slice(2, 8).toUpperCase();
+  }
+
+  function addNft(role, name = "") {
+    const meta = roles[role];
+    if (!meta) return;
+    const nft = {
+      id: shortId(),
+      role,
+      name: name || `${role} #${nfts.length + 1}`,
+      level: 1,
+      staked: false,
+      fused: false,
+      created: Date.now(),
+    };
+    nfts.push(nft);
+    save();
+    renderAll();
+    setMsg(mintMsg, `Minted ${nft.name} (${role}).`, false);
+  }
+
+  function seedDemo() {
+    nfts = [
+      { id: shortId(), role: "Trader", name: "FlipFox", level: 2, staked: false, fused: false, created: Date.now() },
+      { id: shortId(), role: "Farmer", name: "HarvestHero", level: 1, staked: true, stakedAt: Date.now() - 12_000, fused: false, created: Date.now() },
+      { id: shortId(), role: "Worker", name: "MineMage", level: 1, staked: false, fused: false, created: Date.now() },
+      { id: shortId(), role: "Worker", name: "DrillDuck", level: 3, staked: false, fused: false, created: Date.now() },
+    ];
+    save();
+    renderAll();
+    setMsg(mintMsg, "Demo set loaded. Fuse or stake them to see flows.", false);
+  }
+
+  function setMsg(el, msg, isError) {
+    if (!el) return;
+    el.textContent = msg;
+    el.classList.toggle("error", !!isError);
+  }
+
+  function formatTime(ts) {
+    return new Date(ts).toLocaleTimeString();
+  }
+
+  function renderStats() {
+    if (!statsEl) return;
+    const total = nfts.length;
+    const staked = nfts.filter(n => n.staked).length;
+    const fused = nfts.filter(n => n.fused).length;
+    statsEl.innerHTML = `
+      <span>${total} total</span>
+      <span>${staked} staked</span>
+      <span>${fused} fused</span>
+    `;
+  }
+
+  function renderList() {
+    listEl.innerHTML = "";
+    if (!nfts.length) {
+      listEl.innerHTML = "<p class='muted'>Mint something to populate this grid.</p>";
+      return;
+    }
+
+    nfts.forEach(nft => {
+      const card = document.createElement("div");
+      card.className = "nft-card";
+      card.innerHTML = `
+        <div class="nft-card__top">
+          <span class="badge" style="border-color:${roles[nft.role].color}; color:${roles[nft.role].color}">${nft.role}</span>
+          <span class="muted-small">${nft.id}</span>
+        </div>
+        <div class="mint-title" style="margin-bottom:4px">${nft.name}</div>
+        <div class="muted-small">Level ${nft.level}</div>
+        <div style="margin-top:8px">
+          ${nft.staked ? `<span class="pill">Staked</span>` : `<span class="pill good">Ready</span>`}
+          ${nft.fused ? `<span class="pill alert">Fused out</span>` : ""}
+        </div>
+        <div class="muted-small" style="margin-top:8px">Minted at ${formatTime(nft.created)}</div>
+      `;
+      listEl.appendChild(card);
+    });
+  }
+
+  function renderStake() {
+    if (!stakeEl) return;
+    stakeEl.innerHTML = "";
+    if (!nfts.length) {
+      stakeEl.innerHTML = "<p class='muted'>No NFTs yet. Mint first.</p>";
+      return;
+    }
+
+    nfts.forEach(nft => {
+      const row = document.createElement("div");
+      row.className = "list-row";
+      row.innerHTML = `
+        <div class="label">
+          <div class="mint-title" style="margin:0">${nft.name}</div>
+          <div class="muted-small">${nft.role} • Level ${nft.level}</div>
+        </div>
+        <button class="btn btn--small ${nft.staked ? "btn--secondary" : "btn--primary"}" data-stake="${nft.id}">
+          ${nft.staked ? "Unstake" : "Stake"}
+        </button>
+      `;
+      stakeEl.appendChild(row);
+    });
+
+    stakeEl.querySelectorAll("[data-stake]").forEach(btn => {
+      btn.addEventListener("click", () => toggleStake(btn.dataset.stake));
+    });
+  }
+
+  function toggleStake(id) {
+    const nft = nfts.find(n => n.id === id);
+    if (!nft || nft.fused) return;
+    const now = Date.now();
+    if (!nft.staked) {
+      nft.staked = true;
+      nft.stakedAt = now;
+      setMsg(stakeLog, `${nft.name} is now staked and earning ${roles[nft.role].resource}.`, false);
+    } else {
+      const seconds = nft.stakedAt ? Math.max(1, Math.round((now - nft.stakedAt) / 1000)) : 1;
+      const earned = seconds * roles[nft.role].rate;
+      nft.staked = false;
+      delete nft.stakedAt;
+      nft.lastEarned = earned;
+      setMsg(stakeLog, `${nft.name} unstaked. Earned ~${earned} ${roles[nft.role].resource} (demo).`, false);
+    }
+    save();
+    renderAll();
+  }
+
+  function renderFusion() {
+    if (!fusionA || !fusionB) return;
+    const options = nfts.filter(n => !n.fused && !n.staked);
+    function fill(select) {
+      select.innerHTML = "";
+      const placeholder = document.createElement("option");
+      placeholder.value = ""; placeholder.textContent = "Select";
+      select.appendChild(placeholder);
+      options.forEach(n => {
+        const opt = document.createElement("option");
+        opt.value = n.id;
+        opt.textContent = `${n.name} (${n.role} • L${n.level})`;
+        select.appendChild(opt);
+      });
+    }
+    fill(fusionA); fill(fusionB);
+    if (options.length < 2) {
+      setMsg(fusionMsg, "Need at least 2 unstaked NFTs to fuse.", true);
+    } else {
+      setMsg(fusionMsg, "Pick any two to craft an upgraded Fusion NFT.", false);
+    }
+  }
+
+  function fuseSelected() {
+    const a = fusionA.value; const b = fusionB.value;
+    if (!a || !b || a === b) {
+      setMsg(fusionMsg, "Choose two different NFTs.", true);
+      return;
+    }
+    const first = nfts.find(n => n.id === a);
+    const second = nfts.find(n => n.id === b);
+    if (!first || !second) return;
+    first.fused = true; second.fused = true;
+    const newLevel = Math.max(first.level, second.level) + 1;
+    const fusedName = `${first.role}+${second.role} Mk.${newLevel}`;
+    const fusionNft = {
+      id: shortId(),
+      role: "Fusion",
+      name: fusedName,
+      level: newLevel,
+      staked: false,
+      fused: false,
+      created: Date.now(),
+    };
+    nfts.push(fusionNft);
+    save();
+    renderAll();
+    setMsg(fusionMsg, `Fusion complete! New NFT ${fusedName} (L${newLevel}) added.`, false);
+  }
+
+  function renderAll() {
+    renderStats();
+    renderList();
+    renderStake();
+    renderFusion();
+  }
+
+  // Mint buttons
+  const mintBtn = document.getElementById("mintBtn");
+  const seedBtn = document.getElementById("seedBtn");
+  const nameInput = document.getElementById("mintName");
+  const fusionBtn = document.getElementById("fusionBtn");
+
+  mintBtn?.addEventListener("click", () => {
+    const roleInput = document.querySelector("input[name='mintRole']:checked");
+    const role = roleInput?.value || "Trader";
+    addNft(role, nameInput?.value.trim());
+    if (nameInput) nameInput.value = "";
+  });
+  seedBtn?.addEventListener("click", seedDemo);
+  fusionBtn?.addEventListener("click", fuseSelected);
+
+  renderAll();
+})();
