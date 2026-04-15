// ─── ROBOT.JS — solder robot mesh + animation ────────────────────────────────
// Depends on: THREE (global)

window.Robot = (function () {

  const M = {
    body:  new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.4,  metalness: 0.35 }),
    dark:  new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.55, metalness: 0.2  }),
    eye:   new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5, roughness: 0.1 }),
    ant:   new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.5, roughness: 0.2 }),
    wheel: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.92, metalness: 0.05 }),
    pcb:   new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.9,  metalness: 0.05 }),
    solder:new THREE.MeshStandardMaterial({ color: 0x999990, roughness: 0.25, metalness: 0.85 }),
    panel: new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4,  metalness: 0.5  }),
  };

  function build() {
    const robot = new THREE.Group();
    const wheels = [];

    // ── Chassis (main slab) ───────────────────────────────────────────────
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.16, 0.92), M.body.clone());
    chassis.castShadow = true;
    robot.add(chassis);

    // Chassis underside detail
    const underGeo = new THREE.BoxGeometry(0.50, 0.04, 0.78);
    const under = new THREE.Mesh(underGeo, M.dark);
    under.position.y = -0.10;
    robot.add(under);

    // ── Body block ────────────────────────────────────────────────────────
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.20, 0.58), M.body.clone());
    body.position.set(0, 0.18, -0.02);
    body.castShadow = true;
    robot.add(body);

    // Panel lines on body
    for (let i = 0; i < 3; i++) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.008, 0.01), M.dark);
      line.position.set(0, 0.12 + i * 0.06, 0.31);
      robot.add(line);
    }

    // ── Head / dome ───────────────────────────────────────────────────────
    const headBase = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.32), M.body.clone());
    headBase.position.set(0, 0.32, -0.06);
    robot.add(headBase);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
      M.body.clone()
    );
    dome.position.set(0, 0.36, -0.06);
    dome.castShadow = true;
    robot.add(dome);

    // ── Eyes ─────────────────────────────────────────────────────────────
    for (const ex of [-0.08, 0.08]) {
      const eyeHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 12), M.dark);
      eyeHousing.rotation.x = Math.PI / 2;
      eyeHousing.position.set(ex, 0.36, -0.22);
      robot.add(eyeHousing);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 10), M.eye.clone());
      eye.position.set(ex, 0.36, -0.24);
      robot.add(eye);
    }

    // ── Antenna ───────────────────────────────────────────────────────────
    const antStalk = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.020, 0.28, 8), M.dark);
    antStalk.position.set(0.05, 0.56, -0.05);
    robot.add(antStalk);

    const antBall = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 10), M.ant.clone());
    antBall.position.set(0.05, 0.71, -0.05);
    robot.add(antBall);

    // Antenna glow
    const antLight = new THREE.PointLight(0xffffff, 1.5, 1.2);
    antLight.position.set(0.05, 0.72, -0.05);
    robot.add(antLight);

    // ── Soldering iron arms ───────────────────────────────────────────────
    for (const ax of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.32, 8), M.panel);
      arm.rotation.z = Math.PI / 2;
      arm.position.set(ax * 0.40, 0.17, -0.08);
      robot.add(arm);

      // Iron tip
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.10, 8), M.solder);
      tip.rotation.z = ax > 0 ? Math.PI / 2 : -Math.PI / 2;
      tip.position.set(ax * 0.61, 0.17, -0.08);
      robot.add(tip);

      // Grip band on arm
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.06, 8), M.dark);
      band.rotation.z = Math.PI / 2;
      band.position.set(ax * 0.34, 0.17, -0.08);
      robot.add(band);
    }

    // ── Mini PCB on back ──────────────────────────────────────────────────
    const miniPCB = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.30), M.pcb.clone());
    miniPCB.position.set(0, 0.20, 0.22);
    robot.add(miniPCB);

    // Mini traces on PCB
    const miniTraceGeo = new THREE.BoxGeometry(0.28, 0.005, 0.02);
    for (let i = 0; i < 3; i++) {
      const t = new THREE.Mesh(miniTraceGeo, new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.3 }));
      t.position.set(0, 0.22, 0.15 + i * 0.05);
      robot.add(t);
    }

    // ── Wheels (4) ────────────────────────────────────────────────────────
    const wheelGeo = new THREE.CylinderGeometry(0.115, 0.115, 0.075, 20);
    const hubGeo   = new THREE.CylinderGeometry(0.045, 0.045, 0.08, 10);
    const spokeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.016);

    const wheelPositions = [
      [-0.355, 0.04,  0.30],
      [ 0.355, 0.04,  0.30],
      [-0.355, 0.04, -0.30],
      [ 0.355, 0.04, -0.30],
    ];

    wheelPositions.forEach(([wx, wy, wz]) => {
      const wGroup = new THREE.Group();

      const tire = new THREE.Mesh(wheelGeo, M.wheel.clone());
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const hub = new THREE.Mesh(hubGeo, M.solder);
      hub.rotation.z = Math.PI / 2;
      wGroup.add(hub);

      // 3 spokes
      for (let s = 0; s < 3; s++) {
        const spoke = new THREE.Mesh(spokeGeo, M.panel);
        spoke.rotation.z = Math.PI / 2;
        spoke.rotation.x = (s / 3) * Math.PI;
        wGroup.add(spoke);
      }

      wGroup.position.set(wx, wy, wz);
      robot.add(wGroup);
      wheels.push(wGroup);
    });

    // ── Robot point light ─────────────────────────────────────────────────
    const robotLight = new THREE.PointLight(0xffffff, 2.8, 3.5);
    robotLight.position.set(0, 0.8, 0);
    robot.add(robotLight);

    // ── Initial position ──────────────────────────────────────────────────
    robot.position.set(0, 0.14, 0);
    robot.castShadow = true;

    return { robot, wheels, robotLight };
  }

  // ── ANIMATION TICK ────────────────────────────────────────────────────────
  function animate(robotObj, vel, dt, now) {
    const { robot, wheels, robotLight } = robotObj;
    const speed = vel.length();

    // Wheel spin
    const spinRate = speed * 9;
    wheels.forEach(w => { w.rotation.x += spinRate * dt; });

    // Body bob
    robot.position.y = 0.14 + Math.sin(now * 0.0028) * 0.007 + speed * 0.035;

    // Lean into movement (forward tilt based on velocity)
    robot.rotation.x = -vel.z * 0.08;
    robot.rotation.z =  vel.x * 0.05;

    // Antenna light pulse
    robotLight.intensity = 2.5 + Math.sin(now * 0.005) * 0.6;
  }

  return { build, animate };

})();
