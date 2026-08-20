import * as THREE from 'three';
import './render.js'; // builds the DOM from config.js before anything binds

/* ────────────────────────────────────────────────────────────
   Warren Wong — uncanny low-poly avatar.
   Style ref: hand-painted mottled textures, lumpy geometry,
   heavy-lidded eyes, fleshy mouth, blurry forest backdrop,
   muted compressed-video grading. Head tracks hovered
   edge components.
   ──────────────────────────────────────────────────────────── */

const canvas = document.getElementById('avatar-canvas');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (e) {
  canvas.style.display = 'none';
}

if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 60);
  camera.position.set(0, 2.1, 6.4);
  camera.lookAt(0, 2.05, 0);

  /* ── seeded RNG so the paint job is stable ── */
  let _s = 1337;
  const rnd = () => {
    _s |= 0; _s = (_s + 0x6D2B79F5) | 0;
    let t = Math.imul(_s ^ (_s >>> 15), 1 | _s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  /* ── painted canvas textures (low-res on purpose) ── */
  function paintTex(size, painter) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    painter(c.getContext('2d'), size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }
  function blotch(ctx, s, colors, count, rMin, rMax, alpha) {
    for (let i = 0; i < count; i++) {
      const col = colors[(rnd() * colors.length) | 0];
      const r = rMin + rnd() * (rMax - rMin);
      const x = rnd() * s, y = rnd() * s;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, col.replace('A', String(alpha)));
      g.addColorStop(1, col.replace('A', '0'));
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }

  // skin: warm base, mottled with olive / rust / pale patches
  const skinTex = paintTex(128, (ctx, s) => {
    ctx.fillStyle = '#e6c49f';
    ctx.fillRect(0, 0, s, s);
    blotch(ctx, s, ['rgba(196,146,96,A)', 'rgba(170,130,90,A)', 'rgba(150,120,80,A)'], 45, 4, 18, 0.14);
    blotch(ctx, s, ['rgba(240,220,190,A)', 'rgba(235,205,170,A)'], 40, 3, 14, 0.22);
    blotch(ctx, s, ['rgba(120,90,60,A)'], 15, 1.5, 5, 0.18);
  });
  // hair: near-black with brown streaks
  const hairTex = paintTex(128, (ctx, s) => {
    ctx.fillStyle = '#1d1a20';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 90; i++) {
      ctx.strokeStyle = `rgba(${60 + (rnd() * 40) | 0},${45 + (rnd() * 30) | 0},${40 + (rnd() * 25) | 0},${0.15 + rnd() * 0.2})`;
      ctx.lineWidth = 1 + rnd() * 2;
      const x = rnd() * s, y = rnd() * s;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + (rnd() - .5) * 30, y + 10 + rnd() * 20, x + (rnd() - .5) * 20, y + 25 + rnd() * 25);
      ctx.stroke();
    }
    blotch(ctx, s, ['rgba(0,0,0,A)'], 30, 4, 16, 0.3);
  });
  // tee: dirty off-white cotton, smudged like the reference's belly
  const teeTex = paintTex(128, (ctx, s) => {
    ctx.fillStyle = '#ddd8cd';
    ctx.fillRect(0, 0, s, s);
    blotch(ctx, s, ['rgba(160,155,145,A)', 'rgba(180,175,160,A)'], 55, 5, 22, 0.25);
    blotch(ctx, s, ['rgba(250,248,240,A)'], 35, 4, 16, 0.3);
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = `rgba(140,135,125,${0.08 + rnd() * 0.12})`;
      ctx.lineWidth = 1;
      const x = rnd() * s, y = rnd() * s;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (rnd() - .5) * 26, y + (rnd() - .5) * 26); ctx.stroke();
    }
  });
  // lips: fleshy, blotchy pink
  const lipTex = paintTex(64, (ctx, s) => {
    ctx.fillStyle = '#d8a288';
    ctx.fillRect(0, 0, s, s);
    blotch(ctx, s, ['rgba(190,120,95,A)', 'rgba(160,95,75,A)'], 30, 3, 10, 0.3);
    blotch(ctx, s, ['rgba(235,190,165,A)'], 20, 2, 8, 0.3);
  });

  /* lights — warm studio key + cool rim (transparent canvas, the
     page's paper backdrop shows through) */
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0xb8a88f, 1.15));
  const key = new THREE.DirectionalLight(0xffe9c4, 1.55);
  key.position.set(2.5, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xcfd8ff, 0.65);
  rim.position.set(-4, 3, -3);
  scene.add(rim);
  const front = new THREE.DirectionalLight(0xfff0e0, 0.4);
  front.position.set(0, 2, 6);
  scene.add(front);

  // soft ground shadow blob
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 128;
  const sctx = shadowCanvas.getContext('2d');
  const sgrad = sctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  sgrad.addColorStop(0, 'rgba(26,24,22,0.26)');
  sgrad.addColorStop(1, 'rgba(26,24,22,0)');
  sctx.fillStyle = sgrad;
  sctx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 1.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.05;
  scene.add(shadow);

  /* ── geometry helpers ── */
  function hash(x, y, z, s) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + s * 53.3) * 43758.5453;
    return n - Math.floor(n);
  }
  function lumpy(geo, amt, seed = 0) {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = +p.getX(i).toFixed(3), y = +p.getY(i).toFixed(3), z = +p.getZ(i).toFixed(3);
      p.setXYZ(i,
        p.getX(i) + (hash(x, y, z, seed) - .5) * amt,
        p.getY(i) + (hash(y, z, x, seed + 9) - .5) * amt,
        p.getZ(i) + (hash(z, x, y, seed + 17) - .5) * amt);
    }
    geo.computeVertexNormals();
    return geo;
  }
  const texMat = (tex, o = {}) => new THREE.MeshStandardMaterial({
    map: tex, roughness: o.rough ?? 0.75, metalness: o.metal ?? 0,
  });
  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({
    color, roughness: o.rough ?? 0.8, metalness: o.metal ?? 0,
  });

  const SKIN  = texMat(skinTex, { rough: 0.7 });
  const HAIR  = texMat(hairTex, { rough: 0.75 });
  const TEE   = texMat(teeTex, { rough: 0.9 });
  const LIP   = texMat(lipTex, { rough: 0.6 });
  const METAL = mat(0xb9bec8, { rough: 0.3, metal: 0.75 });

  const root = new THREE.Group();
  root.position.y = 0.35; // lift the avatar so the watch clears the frame bottom
  scene.add(root);

  /* ── body: narrow shoulders, big soft belly (like the refs) ── */
  const body = new THREE.Group();
  root.add(body);

  const torso = new THREE.Mesh(lumpy(new THREE.SphereGeometry(1, 26, 20), 0.06, 2), TEE);
  torso.geometry.scale(0.98, 1.25, 0.78);
  torso.position.y = 0.35;
  body.add(torso);
  // chest slope up to the neck — shoulders round off, not squared
  const chest = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.72, 20, 16), 0.045, 3), TEE);
  chest.geometry.scale(1.05, 0.82, 0.8);
  chest.position.y = 1.0;
  body.add(chest);

  // stubby arms hanging at the sides, slightly out
  for (const side of [-1, 1]) {
    const sleeve = new THREE.Mesh(lumpy(new THREE.CylinderGeometry(0.27, 0.3, 0.7, 12, 5), 0.07, 11 + side), TEE);
    sleeve.position.set(side * 0.88, 0.82, 0);
    sleeve.rotation.z = side * 0.35;
    body.add(sleeve);
    const fore = new THREE.Mesh(lumpy(new THREE.CylinderGeometry(0.13, 0.115, 0.8, 10, 4), 0.045, 31 + side), SKIN);
    fore.position.set(side * 1.1, 0.12, 0.06);
    fore.rotation.set(0.12, 0, side * 0.22);
    body.add(fore);
    const hand = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.16, 12, 10), 0.06, 41 + side), SKIN);
    hand.geometry.scale(0.9, 1.15, 0.95);
    hand.position.set(side * 1.18, -0.34, 0.1);
    body.add(hand);
  }

  // watch on his left wrist (viewer left)
  const watch = new THREE.Group();
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 8, 18), mat(0x24242c, { rough: 0.6 }));
  const wface = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.07, 14), mat(0x2c303a, { rough: 0.35, metal: 0.4 }));
  wface.rotation.x = Math.PI / 2;
  wface.position.z = 0.05;
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 18), METAL);
  bezel.position.z = 0.09;
  watch.add(strap, wface, bezel);
  watch.position.set(-1.13, -0.12, 0.08);
  watch.rotation.set(0.1, 0, -0.25);
  body.add(watch);

  // chain bracelet on his right wrist (viewer right)
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 5), METAL);
    bead.position.set(1.13 + Math.cos(a) * 0.13, -0.14 + Math.sin(a) * 0.045, 0.08 + Math.sin(a) * 0.11);
    body.add(bead);
  }

  /* ── short neck + big head ── */
  const neck = new THREE.Mesh(lumpy(new THREE.CylinderGeometry(0.26, 0.3, 0.4, 12, 3), 0.04, 51), SKIN);
  neck.position.y = 1.62;
  body.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.72, 0.04);
  const HEAD_SCALE = 1.34;
  headGroup.scale.setScalar(HEAD_SCALE);
  root.add(headGroup);

  // skull — slightly narrow, long face
  const head = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.62, 28, 22), 0.055, 61), SKIN);
  head.geometry.scale(0.86, 1.05, 0.9);
  head.position.y = 0.52;
  headGroup.add(head);

  // ears
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.11, 10, 8), 0.035, 71 + side), SKIN);
    ear.geometry.scale(0.5, 1, 0.7);
    ear.position.set(side * 0.53, 0.48, 0.04);
    headGroup.add(ear);
  }

  /* hair — big wavy mop with a mullet tail at the nape */
  const hairBlobs = [
    [0, 0.9, -0.02, 0.56, 0.4, 0.58, 0.24],         // crown — kept low
    [0, 0.72, -0.42, 0.56, 0.54, 0.34, 0.2],        // back
    // 6:4-parted 八字 curtain bangs — part sits right of center,
    // each lock sweeps outward and down to the ear
    [-0.2, 0.84, 0.42, 0.16, 0.3, 0.17, 0.16, -0.38],  // L upper (the wider 6 side)
    [-0.44, 0.62, 0.3, 0.12, 0.3, 0.15, 0.14, -0.55],  // L lower — reaches the ear
    [0.28, 0.86, 0.4, 0.13, 0.26, 0.16, 0.16, 0.42],   // R upper (the 4 side)
    [0.47, 0.62, 0.28, 0.11, 0.28, 0.14, 0.14, 0.6],   // R lower — reaches the ear
    [-0.5, 0.68, 0.14, 0.16, 0.36, 0.22, 0.16],     // temple L
    [0.5, 0.68, 0.14, 0.16, 0.36, 0.22, 0.16],      // temple R
    [-0.56, 0.62, 0.02, 0.16, 0.28, 0.28, 0.15],    // side lock L — covers the ear, ends at the cheekbone
    [0.56, 0.62, 0.02, 0.16, 0.28, 0.28, 0.15],     // side lock R — covers the ear, ends at the cheekbone
    [-0.5, 0.55, -0.22, 0.17, 0.34, 0.26, 0.13],    // side-back fill L — runs flush into the back
    [0.5, 0.55, -0.22, 0.17, 0.34, 0.26, 0.13],     // side-back fill R — runs flush into the back
    [-0.14, 0.94, 0.16, 0.28, 0.2, 0.28, 0.22],     // messy top tufts — flattened
    [0.18, 0.96, 0.12, 0.26, 0.18, 0.26, 0.22],
    [-0.4, 0.2, -0.32, 0.16, 0.3, 0.2, 0.13],       // mullet layer L
    [0.4, 0.2, -0.32, 0.16, 0.3, 0.2, 0.13],        // mullet layer R
    [0, 0.12, -0.4, 0.3, 0.32, 0.18, 0.14],         // nape center — hangs low
    [0, -0.1, -0.4, 0.24, 0.28, 0.14, 0.12],        // wolf tail — drops past the nape
    [-0.26, -0.2, -0.32, 0.11, 0.26, 0.1, 0.1],     // tail wisp L — peeks past the shoulder line
    [0.26, -0.2, -0.32, 0.11, 0.26, 0.1, 0.1],      // tail wisp R — peeks past the shoulder line
    [0, -0.3, -0.4, 0.14, 0.2, 0.1, 0.1],           // tail tip — just touches the shoulders
  ];
  hairBlobs.forEach((b, i) => {
    const m = new THREE.Mesh(lumpy(new THREE.SphereGeometry(1, 15, 12), b[6], 100 + i * 3), HAIR);
    m.geometry.scale(b[3], b[4], b[5]);
    m.position.set(b[0], b[1], b[2]);
    if (b[7]) m.rotation.z = b[7];
    headGroup.add(m);
  });

  /* face — the uncanny part: whites, heavy lids, small dark pupils */
  const pupils = [];
  for (const side of [-1, 1]) {
    const wob = side * 0.012; // slight asymmetry, on purpose
    // eye socket shading
    const socket = new THREE.Mesh(new THREE.SphereGeometry(0.115, 12, 10), mat(0xa5825f, { rough: 0.9 }));
    socket.scale.set(1.35, 0.6, 0.4);
    socket.position.set(side * 0.21, 0.5 + wob, 0.475);
    headGroup.add(socket);
    // eyeball — dirty white
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.095, 14, 12), mat(0xe7e2d2, { rough: 0.35 }));
    white.scale.set(1.15, 0.5, 0.55);
    white.position.set(side * 0.21, 0.5 + wob, 0.5);
    headGroup.add(white);
    // iris + pupil — dark, slightly wandering
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), mat(0x2e2018, { rough: 0.25 }));
    iris.scale.set(1, 1, 0.5);
    iris.position.set(side * 0.2 - wob, 0.495 + wob, 0.552);
    headGroup.add(iris);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), mat(0x0a0806, { rough: 0.2 }));
    pupil.scale.set(1, 1, 0.5);
    pupil.position.set(side * 0.2 - wob, 0.495 + wob, 0.572);
    headGroup.add(pupil);
    pupils.push(iris, pupil);
    // heavy upper lid — skin drooping over the eye
    const lid = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.105, 12, 9, 0, Math.PI * 2, 0, Math.PI * 0.5), 0.015, 200 + side), SKIN);
    lid.scale.set(1.25, 0.85, 0.75);
    lid.position.set(side * 0.21, 0.528 + wob, 0.505);
    lid.rotation.x = -0.52;
    headGroup.add(lid);
    // lower lid ridge
    const lower = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), SKIN);
    lower.scale.set(1.3, 0.35, 0.5);
    lower.position.set(side * 0.21, 0.435 + wob, 0.51);
    headGroup.add(lower);
  }
  // faint brows — thin, uneven
  for (const side of [-1, 1]) {
    const brow = new THREE.Mesh(lumpy(new THREE.BoxGeometry(0.2, 0.035, 0.05, 4, 1, 1), 0.02, 210 + side), HAIR);
    brow.position.set(side * 0.22, 0.635 + side * 0.008, 0.5);
    brow.rotation.z = side * -0.1;
    headGroup.add(brow);
  }

  // nose — soft, slightly bulbous
  const bridge = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.07, 10, 8), 0.02, 300), SKIN);
  bridge.geometry.scale(0.55, 1.4, 0.6);
  bridge.position.set(0, 0.42, 0.56);
  headGroup.add(bridge);
  const tip = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.085, 10, 8), 0.025, 301), SKIN);
  tip.geometry.scale(0.85, 0.7, 0.8);
  tip.position.set(0, 0.32, 0.585);
  headGroup.add(tip);

  // mouth — protruding fleshy lips with a crease, like the refs
  const muzzle = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.16, 14, 11), 0.03, 310), SKIN);
  muzzle.geometry.scale(1.15, 0.75, 0.6);
  muzzle.position.set(0, 0.185, 0.52);
  headGroup.add(muzzle);
  const upperLip = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.09, 12, 9), 0.02, 311), LIP);
  upperLip.geometry.scale(1.7, 0.5, 0.65);
  upperLip.position.set(0, 0.215, 0.585);
  headGroup.add(upperLip);
  const lowerLip = new THREE.Mesh(lumpy(new THREE.SphereGeometry(0.085, 12, 9), 0.02, 312), LIP);
  lowerLip.geometry.scale(1.45, 0.55, 0.6);
  lowerLip.position.set(0, 0.15, 0.585);
  headGroup.add(lowerLip);
  // crease between the lips
  const crease = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.012, 0.02), mat(0x6e4636, { rough: 0.9 }));
  crease.position.set(0, 0.183, 0.63);
  headGroup.add(crease);
  // beauty mark — lower right, near the chin
  const mark = new THREE.Mesh(new THREE.SphereGeometry(0.013, 6, 5), mat(0x3a2c22));
  mark.position.set(-0.17, 0.08, 0.47);
  headGroup.add(mark);

  /* glasses — bold black rectangular frames */
  const FRAME = mat(0x141216, { rough: 0.35 });
  function roundedRectPath(path, x, y, w, h, r) {
    path.moveTo(x + r, y);
    path.lineTo(x + w - r, y);
    path.quadraticCurveTo(x + w, y, x + w, y + r);
    path.lineTo(x + w, y + h - r);
    path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    path.lineTo(x + r, y + h);
    path.quadraticCurveTo(x, y + h, x, y + h - r);
    path.lineTo(x, y + r);
    path.quadraticCurveTo(x, y, x + r, y);
  }
  function lensFrame() {
    const w = 0.31, h = 0.24, r = 0.07, th = 0.032;
    const shape = new THREE.Shape();
    roundedRectPath(shape, -w / 2, -h / 2, w, h, r);
    const hole = new THREE.Path();
    roundedRectPath(hole, -w / 2 + th, -h / 2 + th, w - th * 2, h - th * 2, Math.max(r - th, 0.02));
    shape.holes.push(hole);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: false });
  }
  const glasses = new THREE.Group();
  for (const side of [-1, 1]) {
    const frame = new THREE.Mesh(lensFrame(), FRAME);
    frame.position.set(side * 0.205, 0.505, 0.545);
    glasses.add(frame);
    // faint glass
    const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.19),
      new THREE.MeshStandardMaterial({ color: 0xcfe0dd, transparent: true, opacity: 0.14, roughness: 0.1, metalness: 0.3 }));
    lens.position.set(side * 0.205, 0.505, 0.555);
    glasses.add(lens);
    // temple arm back to the ear
    const armT = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.028, 0.42), FRAME);
    armT.position.set(side * 0.5, 0.51, 0.32);
    armT.rotation.y = side * -0.28;
    glasses.add(armT);
  }
  // bridge
  const bridgeBar = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.028, 0.03), FRAME);
  bridgeBar.position.set(0, 0.53, 0.575);
  glasses.add(bridgeBar);
  headGroup.add(glasses);

  /* ── gaze targeting ── */
  const gazePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
  const raycaster = new THREE.Raycaster();
  const desired = new THREE.Vector3(0, 2.6, 6);
  const current = new THREE.Vector3(0, 2.6, 6);
  const ndc = new THREE.Vector2();
  let lockEl = null;
  let pointerActive = false;
  let lastPointerT = 0;
  const pointerPx = { x: 0, y: 0 };

  function screenToGaze(px, py, out) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((px - r.left) / r.width) * 2 - 1, -((py - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(gazePlane, out)) out.set(0, 2.6, 6);
    return out;
  }

  window.addEventListener('pointermove', (e) => {
    pointerPx.x = e.clientX; pointerPx.y = e.clientY;
    pointerActive = true;
    lastPointerT = performance.now();
  }, { passive: true });

  // edge components lock the gaze; a tap = a 1.6s glance
  let glanceTimer = 0;
  document.querySelectorAll('.edge-item').forEach((el) => {
    el.addEventListener('pointerenter', () => { lockEl = el; clearTimeout(glanceTimer); });
    el.addEventListener('pointerleave', () => { if (lockEl === el) lockEl = null; });
    el.addEventListener('touchstart', () => {
      lockEl = el;
      clearTimeout(glanceTimer);
      glanceTimer = setTimeout(() => { if (lockEl === el) lockEl = null; }, 1600);
    }, { passive: true });
  });

  /* resize */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 0.75 ? 9.0 : w / h < 1.1 ? 7.9 : 7.0;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  /* animate */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const aim = { yaw: 0, pitch: 0 };
  const hp = new THREE.Vector3();

  function frame(t) {
    const time = t * 0.001;

    if (lockEl) {
      const r = lockEl.getBoundingClientRect();
      screenToGaze(r.left + r.width / 2, r.top + r.height / 2, desired);
    } else if (pointerActive && performance.now() - lastPointerT < 3500) {
      screenToGaze(pointerPx.x, pointerPx.y, desired);
    } else {
      desired.set(Math.sin(time * 0.4) * 2.2, 2.6 + Math.sin(time * 0.7) * 0.5, 6);
    }
    current.lerp(desired, reduced ? 1 : 0.075);

    headGroup.getWorldPosition(hp);
    const eyeY = hp.y + 0.5 * HEAD_SCALE;
    const dx = current.x - hp.x, dy = current.y - eyeY, dz = Math.max(current.z - hp.z, 0.001);
    aim.yaw   = THREE.MathUtils.clamp(Math.atan2(dx, dz), -0.6, 0.6);
    aim.pitch = THREE.MathUtils.clamp(Math.atan2(-dy, Math.hypot(dx, dz)), -0.45, 0.32);
    headGroup.rotation.y = aim.yaw;
    headGroup.rotation.x = aim.pitch;
    headGroup.rotation.z = aim.yaw * -0.12 + (reduced ? 0 : Math.sin(time * 0.8) * 0.015);

    body.rotation.y = aim.yaw * 0.22;
    root.rotation.y = aim.yaw * 0.05;
    if (!reduced) {
      const breathe = Math.sin(time * 1.4) * 0.018;
      body.position.y = breathe;
      body.rotation.z = Math.sin(time * 0.5) * 0.01;
      headGroup.position.y = 1.72 + breathe;
    }

    // pupils lead the head slightly
    const px = aim.yaw * 0.03, py = aim.pitch * -0.02;
    for (const p of pupils) {
      p.position.x = p.userData.bx ?? (p.userData.bx = p.position.x);
      p.position.y = p.userData.by ?? (p.userData.by = p.position.y);
      p.position.x = p.userData.bx + px;
      p.position.y = p.userData.by + py;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* copy-to-clipboard chips + toast */
const toast = document.getElementById('toast');
let toastTimer;
function copyChip(id, message) {
  const done = () => {
    toast.textContent = message;
    toast.classList.add('toast--show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('toast--show'), 2200);
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(id).then(done, done);
  else done();
}
document.querySelectorAll('[data-copy]').forEach((el) =>
  el.addEventListener('click', () => copyChip(el.dataset.copy, el.dataset.toast || 'Copied')));
