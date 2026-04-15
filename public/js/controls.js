// ─── CONTROLS.JS — input handling + physics ──────────────────────────────────
// Depends on: THREE (global)

window.Controls = (function () {

  const keys = {};

  // ── Keyboard ──────────────────────────────────────────────────────────────
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyE' || e.code === 'Enter') window.dispatchEvent(new Event('interact'));
    if (e.code === 'Escape') window.dispatchEvent(new Event('escape'));
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  // ── Camera mouse drag ─────────────────────────────────────────────────────
  let camDrag = false, lastMX = 0, lastMY = 0;
  let camYaw = 0, camPitch = 0.42;

  window.addEventListener('mousedown', e => {
    if (e.target.id === 'c') { camDrag = true; lastMX = e.clientX; lastMY = e.clientY; }
  });
  window.addEventListener('mouseup',   () => { camDrag = false; });
  window.addEventListener('mousemove', e => {
    if (!camDrag) return;
    const dx = e.clientX - lastMX, dy = e.clientY - lastMY;
    camYaw -= dx * 0.005;
    camPitch = Math.max(0.12, Math.min(1.2, camPitch + dy * 0.005));
    lastMX = e.clientX; lastMY = e.clientY;
  });

  // Touch drag (single finger = camera)
  let touchStart = null;
  window.addEventListener('touchstart', e => {
    if (e.touches.length === 1) touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (!touchStart || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStart.x;
    const dy = e.touches[0].clientY - touchStart.y;
    camYaw -= dx * 0.004;
    camPitch = Math.max(0.12, Math.min(1.2, camPitch + dy * 0.004));
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  // ── Physics constants ─────────────────────────────────────────────────────
  const ACCEL     = 0.024;
  const DECEL     = 0.87;
  const MAX_SPEED = 0.17;
  const BOOST     = 1.75;
  const TURN_RATE = 0.042;
  const PCB_W     = World.PCB_W;
  const PCB_D     = World.PCB_D;

  const vel = new THREE.Vector3();
  let facing = 0;

  // ── Physics tick ──────────────────────────────────────────────────────────
  function tick(robotPos, dt) {
    const fwd = (keys['KeyW'] || keys['ArrowUp'])    ?  1
              : (keys['KeyS'] || keys['ArrowDown'])   ? -1 : 0;
    const trn = (keys['KeyA'] || keys['ArrowLeft'])   ?  1
              : (keys['KeyD'] || keys['ArrowRight'])   ? -1 : 0;
    const boost = (keys['ShiftLeft'] || keys['ShiftRight']) ? BOOST : 1;

    // Turn only when moving
    if (fwd !== 0) facing -= trn * TURN_RATE * dt * (fwd < 0 ? -1 : 1);

    // Accelerate
    const dir = new THREE.Vector3(Math.sin(facing), 0, Math.cos(facing));
    vel.addScaledVector(dir, fwd * ACCEL * boost * dt);

    // Decelerate
    vel.multiplyScalar(Math.pow(DECEL, dt));

    // Clamp speed
    const spd = vel.length();
    const maxSpd = MAX_SPEED * boost;
    if (spd > maxSpd) vel.multiplyScalar(maxSpd / spd);

    // Clamp to board
    const nx = Math.max(-PCB_W / 2 + 0.6, Math.min(PCB_W / 2 - 0.6, robotPos.x + vel.x));
    const nz = Math.max(-PCB_D / 2 + 0.6, Math.min(PCB_D / 2 - 0.6, robotPos.z + vel.z));

    return { nx, nz, facing, speed: spd };
  }

  // ── Camera update ─────────────────────────────────────────────────────────
  function updateCamera(camera, robotPos, dt) {
    const DIST   = 10.5;
    const HEIGHT = 7.5;

    const targetX = robotPos.x + Math.sin(camYaw) * DIST;
    const targetZ = robotPos.z + Math.cos(camYaw) * DIST;
    const targetY = HEIGHT + camPitch * 1.8;

    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.09 * dt);
    camera.lookAt(robotPos.x, 0.4, robotPos.z);
  }

  return { tick, updateCamera, vel, getFacing: () => facing };

})();
