// ─── UI.JS — loading, panel, HUD, proximity prompt ──────────────────────────
// Depends on: LOADING_MSGS, ZONES (from data.js)

window.UI = (function () {

  // ── Loading screen ────────────────────────────────────────────────────────
  const loadingEl  = document.getElementById('loading');
  const fillEl     = document.getElementById('loading-fill');
  const pctEl      = document.getElementById('loading-pct');
  const statusEl   = document.getElementById('loading-status');
  const falconRing = document.getElementById('falcon-ring');
  const cockpitRing= document.getElementById('cockpit-ring');

  // Falcon ring total dash lengths
  const RING_LEN    = 450;
  const COCKPIT_LEN = 90;

  let loadProgress = 0;
  let msgIdx = 0;
  let msgTimer = null;
  let loadDone = false;
  let onDoneCallback = null;

  function cycleMsgs() {
    msgIdx = (msgIdx + 1) % LOADING_MSGS.length;
    statusEl.textContent = LOADING_MSGS[msgIdx];
  }

  function startLoading(onDone) {
    onDoneCallback = onDone;
    statusEl.textContent = LOADING_MSGS[0];
    msgTimer = setInterval(cycleMsgs, 900);

    // Skip on any key/click
    const skip = () => { if (!loadDone) finishLoading(); };
    window.addEventListener('keydown', skip, { once: true });
    loadingEl.addEventListener('click', skip, { once: true });

    // Simulate load progress
    const interval = setInterval(() => {
      loadProgress += Math.random() * 14 + 3;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(interval);
        setTimeout(finishLoading, 350);
      }
      updateProgress(loadProgress);
    }, 90);
  }

  function updateProgress(pct) {
    const p = Math.min(100, pct);
    fillEl.style.width = p + '%';
    pctEl.textContent  = Math.round(p) + '%';

    // Animate falcon ring (draw stroke from 450→0 as load goes 0→100)
    const ringOffset = RING_LEN * (1 - p / 100);
    falconRing.style.strokeDashoffset = ringOffset;

    // Cockpit fills earlier (complete at 60%)
    const cockpitOffset = COCKPIT_LEN * Math.max(0, 1 - (p / 60));
    cockpitRing.style.strokeDashoffset = cockpitOffset;

    // Status glow at 100
    if (p >= 100) statusEl.textContent = '// READY FOR TAKEOFF';
  }

  function finishLoading() {
    if (loadDone) return;
    loadDone = true;
    clearInterval(msgTimer);
    updateProgress(100);
    setTimeout(() => {
      loadingEl.classList.add('hidden');
      if (onDoneCallback) onDoneCallback();
    }, 500);
  }

  // ── Panel ─────────────────────────────────────────────────────────────────
  const panelEl  = document.getElementById('panel');
  const titleEl  = document.getElementById('panel-title');
  const subEl    = document.getElementById('panel-sub');
  const descEl   = document.getElementById('panel-desc');
  const tagEl    = document.getElementById('panel-tag');
  const tagsEl   = document.getElementById('panel-tags');
  let panelOpen  = false;

  function openPanel(data) {
    tagEl.textContent  = data.tag;
    titleEl.textContent = data.title;
    subEl.textContent  = data.sub;
    descEl.textContent = data.desc;
    tagsEl.innerHTML   = '';
    (data.tags || []).forEach(t => {
      const s = document.createElement('span');
      s.className = 'ptag';
      s.textContent = t;
      tagsEl.appendChild(s);
    });
    panelEl.classList.add('open');
    panelOpen = true;
  }

  function closePanel() {
    panelEl.classList.remove('open');
    panelOpen = false;
  }

  window.closePanel = closePanel;

  window.addEventListener('escape', closePanel);
  window.addEventListener('interact', () => {
    if (panelOpen) { closePanel(); return; }
    // Signal to main to try open nearest component
    window.dispatchEvent(new Event('try_open_panel'));
  });

  // ── Proximity prompt ──────────────────────────────────────────────────────
  const promptEl    = document.getElementById('prompt');
  const promptLabel = document.getElementById('prompt-label');

  function setPrompt(visible, label) {
    promptEl.classList.toggle('show', visible && !panelOpen);
    if (label) promptLabel.textContent = label;
  }

  // ── HUD ───────────────────────────────────────────────────────────────────
  const zoneEl  = document.getElementById('hud-zone');
  const speedEl = document.getElementById('hud-speed');
  let lastZone  = '';

  function updateHUD(robotPos, speed) {
    // Zone
    let zone = 'PCB SURFACE';
    for (const z of ZONES) {
      const d = Math.sqrt((robotPos.x - z.x) ** 2 + (robotPos.z - z.z) ** 2);
      if (d < z.r) { zone = z.name; break; }
    }
    if (zone !== lastZone) {
      lastZone = zone;
      zoneEl.textContent = zone;
    }

    // Speed
    speedEl.textContent = speed > 0.005
      ? `// SPD ${Math.round(speed * 100).toString().padStart(3, '0')}`
      : '// IDLE';
  }

  return { startLoading, openPanel, closePanel, setPrompt, updateHUD, isPanelOpen: () => panelOpen };

})();
