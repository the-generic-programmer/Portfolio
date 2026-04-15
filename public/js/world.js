// ─── WORLD.JS — PCB board, traces, components ───────────────────────────────
// Depends on: THREE (global), PORTFOLIO_DATA (from data.js)

window.World = (function () {

  const PCB_W = 28, PCB_D = 20;

  // ── MATERIALS (monochrome) ─────────────────────────────────────────────────
  const M = {
    pcb:        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9,  metalness: 0.05 }),
    pcb_edge:   new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.8,  metalness: 0.05 }),
    trace_off:  new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5,  metalness: 0.6,  emissive: 0x080808 }),
    trace_on:   new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.9,  emissive: 0xffffff, emissiveIntensity: 1.2 }),
    copper:     new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.35, metalness: 0.85 }),
    solder:     new THREE.MeshStandardMaterial({ color: 0x888880, roughness: 0.25, metalness: 0.9  }),
    silk:       new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.95, metalness: 0,    emissive: 0x333333, emissiveIntensity: 0.3 }),
    ic:         new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.55, metalness: 0.2  }),
    cap_body:   new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.65, metalness: 0.15 }),
    cap_band:   new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.85, metalness: 0    }),
    res_body:   new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.7,  metalness: 0.05 }),
    led_on:     new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.5, roughness: 0.1, metalness: 0.1 }),
    conn_body:  new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.6,  metalness: 0.15 }),
  };

  // ── TRACES ─────────────────────────────────────────────────────────────────
  const traceList = [];

  function buildTraces(scene) {
    function addTrace(x1, z1, x2, z2, w = 0.055) {
      const dx = x2 - x1, dz = z2 - z1;
      const len = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);
      const mat = M.trace_off.clone();
      const geo = new THREE.BoxGeometry(w, 0.035, len);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((x1 + x2) / 2, 0.128, (z1 + z2) / 2);
      mesh.rotation.y = angle;
      scene.add(mesh);
      traceList.push({ mesh, mat, lit: false });
    }

    // Horizontal grid
    for (let z = -8; z <= 8; z += 2)    addTrace(-12, z,  12, z,  0.045);
    // Vertical grid
    for (let x = -10; x <= 10; x += 2.5) addTrace(x, -9,  x,  9,  0.045);
    // Main diagonals
    addTrace(-12, -9,  12,  9,  0.038);
    addTrace(-12,  9,  12, -9,  0.038);
    // Secondary diagonals
    addTrace(-6, -9,  6,  9,  0.032);
    addTrace(-6,  9,  6, -9,  0.032);
    // Bus lines (thick)
    addTrace(-12, 0, 12, 0, 0.08);
    addTrace(0, -9, 0, 9, 0.08);
  }

  function buildVias(scene) {
    const viaGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.04, 12);
    const ringGeo = new THREE.TorusGeometry(0.13, 0.025, 8, 16);
    for (let x = -10; x <= 10; x += 2.5) {
      for (let z = -8; z <= 8; z += 2) {
        const via = new THREE.Mesh(viaGeo, M.solder);
        via.position.set(x, 0.132, z);
        scene.add(via);
        const ring = new THREE.Mesh(ringGeo, M.copper);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(x, 0.135, z);
        scene.add(ring);
      }
    }
  }

  // ── COMPONENT BUILDERS ────────────────────────────────────────────────────

  function buildIC(scene, cfg, compList) {
    const { x, z, w, d, h } = cfg;
    const g = new THREE.Group();

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.ic.clone());
    body.castShadow = true;
    g.add(body);

    // Pin row (both long sides)
    const pinW = 0.055, pinH = 0.07, pinD = 0.16;
    const pinCount = Math.floor(d / 0.32);
    const pinGeo = new THREE.BoxGeometry(pinW, pinH, pinD);
    for (let i = 0; i < pinCount; i++) {
      const t = (i - (pinCount - 1) / 2) * 0.30;
      for (const sx of [-1, 1]) {
        const pin = new THREE.Mesh(pinGeo, M.copper);
        pin.position.set(sx * (w / 2 + pinW / 2), -h / 2 + pinH / 2, t);
        g.add(pin);
      }
    }

    // Silkscreen dot (pin-1 indicator)
    const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 10), M.silk);
    dot.position.set(-w / 2 + 0.2, h / 2 + 0.005, -d / 2 + 0.2);
    g.add(dot);

    // Notch (top)
    const notch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.01, 16, 1, false, 0, Math.PI), M.ic);
    notch.rotation.x = Math.PI / 2;
    notch.position.set(0, h / 2 + 0.005, -d / 2 + 0.08);
    g.add(notch);

    g.position.set(x, 0.11 + h / 2, z);
    scene.add(g);
    compList.push({ group: g, pos: new THREE.Vector3(x, 0, z), radius: Math.max(w, d) * 0.65 + 0.5, data: cfg.data });
  }

  function buildCapacitor(scene, cfg, compList) {
    const { x, z } = cfg;
    const g = new THREE.Group();

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.58, 20), M.cap_body.clone());
    body.castShadow = true;
    g.add(body);

    // White stripe (negative side marker)
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.12, 20), M.cap_band);
    band.position.y = 0.23;
    g.add(band);

    // Top cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 20), M.solder);
    cap.position.y = 0.31;
    g.add(cap);

    // Leads
    for (const [lx, lz] of [[-0.06, 0], [0.06, 0]]) {
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 8), M.solder);
      lead.position.set(lx, -0.38, lz);
      g.add(lead);
    }

    g.position.set(x, 0.11 + 0.29, z);
    scene.add(g);
    compList.push({ group: g, pos: new THREE.Vector3(x, 0, z), radius: 0.85, data: cfg.data });
  }

  function buildLED(scene, cfg, compList) {
    const { x, z } = cfg;
    const g = new THREE.Group();

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2),
      M.led_on.clone()
    );
    dome.castShadow = true;
    g.add(dome);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.04, 20), M.ic.clone());
    collar.position.y = -0.02;
    g.add(collar);

    // Leads
    for (const [lx] of [[-0.05], [0.05]]) {
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), M.solder);
      lead.position.set(lx, -0.15, 0);
      g.add(lead);
    }

    // Glow point light
    const glow = new THREE.PointLight(0xffffff, 3.5, 3);
    glow.position.y = 0.12;
    g.add(glow);

    g.position.set(x, 0.11 + 0.15, z);
    scene.add(g);
    compList.push({ group: g, pos: new THREE.Vector3(x, 0, z), radius: 0.8, data: cfg.data });
  }

  function buildResistor(scene, cfg, compList) {
    const { x, z, rotation = 0 } = cfg;
    const g = new THREE.Group();

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.52, 14), M.res_body.clone());
    body.rotation.z = Math.PI / 2;
    body.castShadow = true;
    g.add(body);

    // Color bands (white on dark = visible)
    const bandPositions = [-0.14, -0.04, 0.06, 0.18];
    const bandCols = [0xffffff, 0xaaaaaa, 0xffffff, 0x888888];
    bandPositions.forEach((bp, i) => {
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.04, 14),
        new THREE.MeshStandardMaterial({ color: bandCols[i], roughness: 0.8 })
      );
      band.rotation.z = Math.PI / 2;
      band.position.x = bp;
      g.add(band);
    });

    // Leads
    for (const lx of [-0.37, 0.37]) {
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.14, 8), M.solder);
      lead.rotation.z = Math.PI / 2;
      lead.position.x = lx;
      g.add(lead);
    }

    g.rotation.y = rotation;
    g.position.set(x, 0.11 + 0.085, z);
    scene.add(g);
    compList.push({ group: g, pos: new THREE.Vector3(x, 0, z), radius: 0.65, data: cfg.data });
  }

  function buildConnector(scene, cfg, compList) {
    const { x, z } = cfg;
    const g = new THREE.Group();

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.42, 1.75), M.conn_body.clone());
    body.castShadow = true;
    g.add(body);

    // Pin holes
    for (let i = 0; i < 4; i++) {
      const hole = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.44, 0.08), M.solder);
      hole.position.set(-0.27 + i * 0.18, 0, 0.88);
      g.add(hole);
    }

    // Latch
    const latch = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.08), M.ic);
    latch.position.set(0, 0.27, 0.92);
    g.add(latch);

    // Silk label
    const label = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.01, 0.3), M.silk);
    label.position.set(0, 0.22, -0.3);
    g.add(label);

    g.position.set(x, 0.11 + 0.21, z);
    scene.add(g);
    compList.push({ group: g, pos: new THREE.Vector3(x, 0, z), radius: 1.1, data: cfg.data });
  }

  // ── PCB BOARD ─────────────────────────────────────────────────────────────
  function buildBoard(scene) {
    // Main board
    const boardGeo = new THREE.BoxGeometry(PCB_W, 0.20, PCB_D);
    const board = new THREE.Mesh(boardGeo, M.pcb);
    board.receiveShadow = true;
    scene.add(board);

    // Edge highlight
    const edges = new THREE.EdgesGeometry(boardGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x282828 });
    const edgeLine = new THREE.LineSegments(edges, edgeMat);
    scene.add(edgeLine);

    // Mounting holes (corners)
    const holeGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.22, 14);
    const ringGeo = new THREE.TorusGeometry(0.30, 0.04, 8, 20);
    const corners = [[-12.5, -9], [12.5, -9], [-12.5, 9], [12.5, 9]];
    corners.forEach(([cx, cz]) => {
      const hole = new THREE.Mesh(holeGeo, new THREE.MeshStandardMaterial({ color: 0x000000 }));
      hole.position.set(cx, 0, cz);
      scene.add(hole);
      const ring = new THREE.Mesh(ringGeo, M.copper);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(cx, 0.11, cz);
      scene.add(ring);
    });

    // Ground plane glow
    const glowGeo = new THREE.PlaneGeometry(PCB_W + 2, PCB_D + 2);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.018, side: THREE.DoubleSide });
    const glowPlane = new THREE.Mesh(glowGeo, glowMat);
    glowPlane.rotation.x = -Math.PI / 2;
    glowPlane.position.y = -0.12;
    scene.add(glowPlane);
  }

  // ── LIGHTING ──────────────────────────────────────────────────────────────
  function buildLights(scene) {
    const ambient = new THREE.AmbientLight(0x141414, 3);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(10, 20, 12);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -20;
    key.shadow.camera.right = 20;
    key.shadow.camera.top = 15;
    key.shadow.camera.bottom = -15;
    key.shadow.camera.far = 60;
    key.shadow.bias = -0.001;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x888888, 1.5);
    fill.position.set(-8, 6, -10);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(0, 5, -15);
    scene.add(rim);

    return { ambient, key, fill };
  }

  // ── TRACE LIGHTING (proximity) ────────────────────────────────────────────
  function updateTraces(robotPos) {
    const rx = robotPos.x, rz = robotPos.z;
    traceList.forEach(t => {
      const tx = t.mesh.position.x, tz = t.mesh.position.z;
      const dist = Math.sqrt((rx - tx) ** 2 + (rz - tz) ** 2);
      const shouldLit = dist < 3.8;
      if (shouldLit !== t.lit) {
        t.lit = shouldLit;
        t.mat.color.setHex(shouldLit ? 0xffffff : 0x2a2a2a);
        t.mat.emissive.setHex(shouldLit ? 0xffffff : 0x080808);
        t.mat.emissiveIntensity = shouldLit ? 1.2 : 0;
        t.mat.metalness = shouldLit ? 0.9 : 0.6;
        t.mat.roughness = shouldLit ? 0.15 : 0.5;
      }
    });
  }

  // ── PUBLIC BUILD ──────────────────────────────────────────────────────────
  function build(scene) {
    const components = [];

    buildBoard(scene);
    buildTraces(scene);
    buildVias(scene);

    PORTFOLIO_DATA.forEach(cfg => {
      switch (cfg.type) {
        case 'ic_large':   buildIC(scene, cfg, components);         break;
        case 'capacitor':  buildCapacitor(scene, cfg, components);  break;
        case 'led':        buildLED(scene, cfg, components);        break;
        case 'resistor':   buildResistor(scene, cfg, components);   break;
        case 'connector':  buildConnector(scene, cfg, components);  break;
      }
    });

    const lights = buildLights(scene);
    return { components, lights, updateTraces };
  }

  return { build, PCB_W, PCB_D };

})();
