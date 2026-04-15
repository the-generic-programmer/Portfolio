// ─── MAIN.JS — scene init, game loop ─────────────────────────────────────────
// Depends on: THREE, World, Robot, Controls, UI, PORTFOLIO_DATA

(function () {

  // ── Renderer ───────────────────────────────────────────────────────────────
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // ── Scene ─────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x040404);
  scene.fog = new THREE.FogExp2(0x040404, 0.030);

  // ── Camera ────────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 8, 11);
  camera.lookAt(0, 0, 0);

  // ── Build world ───────────────────────────────────────────────────────────
  const { components, updateTraces } = World.build(scene);

  // ── Build robot ───────────────────────────────────────────────────────────
  const robotObj = Robot.build();
  scene.add(robotObj.robot);

  // ── Nearest component state ───────────────────────────────────────────────
  let nearest = null;
  let nearestDist = 999;

  function findNearest(rPos) {
    nearest = null;
    nearestDist = 999;
    components.forEach(c => {
      const d = rPos.distanceTo(c.pos);
      if (d < nearestDist) { nearestDist = d; nearest = c; }
    });
  }

  // ── Open panel on interact ────────────────────────────────────────────────
  window.addEventListener('try_open_panel', () => {
    if (nearest && nearestDist < nearest.radius) {
      UI.openPanel(nearest.data);
    }
  });

  // ── Component gentle float animation ─────────────────────────────────────
  const compBaseY = components.map(c => c.group.position.y);

  // ── Resize handler ────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // ── Game loop (defined but started after loading) ─────────────────────────
  let t0 = performance.now();
  let frameId = null;

  function loop() {
    frameId = requestAnimationFrame(loop);
    const now = performance.now();
    const dt  = Math.min((now - t0) / 16.667, 3);
    t0 = now;

    const robot = robotObj.robot;
    const rPos  = robot.position;

    // Physics (only when panel closed)
    if (!UI.isPanelOpen()) {
      const { nx, nz, facing, speed } = Controls.tick(rPos, dt);
      robot.position.x = nx;
      robot.position.z = nz;
      robot.rotation.y = facing;

      // Robot animation
      Robot.animate(robotObj, Controls.vel, dt, now);

      // HUD
      UI.updateHUD(rPos, speed);

      // Nearest component
      findNearest(rPos);

      // Proximity prompt
      const inRange = nearest && nearestDist < nearest.radius;
      UI.setPrompt(inRange, inRange ? nearest.data.title.toUpperCase() : '');
    }

    // Trace lighting
    updateTraces(rPos);

    // Camera follow
    Controls.updateCamera(camera, rPos, dt);

    // Component bob
    const t = now * 0.001;
    components.forEach((c, i) => {
      c.group.position.y = compBaseY[i] + Math.sin(t * 1.1 + i * 0.9) * 0.025;
    });

    renderer.render(scene, camera);
  }

  // ── Start loading, then begin loop ────────────────────────────────────────
  UI.startLoading(() => {
    t0 = performance.now();
    loop();
  });

})();
