// Mint Demo
window.demoMint = function(){
  alert("Mint Demo – Candy Machine will be connected later.");
};

// Phantom connect (simple)
(function () {
  const btn = document.getElementById('connectBtn');
  if (!btn) return;

  function setInstall() {
    btn.textContent = 'Install Phantom';
    btn.disabled = false;
    btn.onclick = () => window.open('https://phantom.app/', '_blank');
  }

  const provider =
    window.solana ||
    (window.phantom && window.phantom.solana) ||
    null;

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
