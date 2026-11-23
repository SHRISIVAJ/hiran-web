// ============================================================
//  Product image renderer (three.js) — run once via
//  tools/render-images.py to produce /public/images/products/*.webp.
//  (The live Home hero lives in lib/heroScene.js.)
//  Pure ES module: no React / Next imports, so it also runs in a
//  plain browser page via an import map.
// ============================================================
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

const TAU = Math.PI * 2;

function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function weave(ctx, w, h, base = "#eef1f4") {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  const r = rng(3);
  for (let x = 0; x < w; x += 6) {
    ctx.fillStyle = `rgba(148,163,184,${0.1 + r() * 0.12})`;
    ctx.fillRect(x, 0, 2, h);
  }
  for (let y = 0; y < h; y += 6) {
    ctx.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.2})`;
    ctx.fillRect(0, y, w, 2);
  }
}

function fitFont(ctx, text, max, size, weight = 900) {
  let s = size;
  ctx.font = `${weight} ${s}px Arial, Helvetica, sans-serif`;
  while (ctx.measureText(text).width > max && s > 30) {
    s -= 4;
    ctx.font = `${weight} ${s}px Arial, Helvetica, sans-serif`;
  }
}

export function splitTitle(name) {
  const words = name.toUpperCase().split(" ");
  if (words.length <= 2) return [words.join(" ")];
  return [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
}

// ---------- BAG ----------
function bagFrontTexture({ accent, deep, lines, grade, formula, hs, hazard }) {
  return canvasTexture(1024, 1434, (ctx, w, h) => {
    weave(ctx, w, h);
    ctx.strokeStyle = "rgba(100,116,139,.55)";
    ctx.lineWidth = 6;
    ctx.setLineDash([14, 12]);
    for (const y of [70, h - 70]) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 30, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    const lx = 130, ly = 300, lw = w - 260, lh = 820;
    ctx.shadowColor = "rgba(15,23,42,.18)";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(lx, ly, lw, lh, 28);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(lx, ly, lw, lh, 28);
    ctx.clip();
    ctx.fillStyle = accent;
    ctx.fillRect(lx, ly, lw, 150);
    ctx.fillRect(lx, ly + lh - 26, lw, 26);
    ctx.restore();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 72px Arial, Helvetica, sans-serif";
    ctx.fillText(formula, w / 2, ly + 78);
    ctx.fillStyle = deep;
    lines.forEach((t, i) => {
      fitFont(ctx, t, lw - 90, 100);
      ctx.fillText(t, w / 2, ly + 265 + i * 112);
    });
    const gy = ly + 265 + lines.length * 112;
    ctx.fillStyle = "#334155";
    ctx.font = "700 62px Arial, Helvetica, sans-serif";
    ctx.fillText(grade, w / 2, gy);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(lx + 70, gy + 70);
    ctx.lineTo(lx + lw - 70, gy + 70);
    ctx.stroke();
    ctx.fillStyle = "#64748b";
    ctx.font = "700 50px Arial, Helvetica, sans-serif";
    ctx.fillText("NET WT. 25 KG", w / 2, gy + 140);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 40px Arial, Helvetica, sans-serif";
    ctx.fillText(`HS CODE ${hs}`, w / 2, gy + 205);
    if (hazard) {
      const cx = w - 220, cy = ly + lh + 150, s = 92;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(cx, cy - s);
      ctx.lineTo(cx + s, cy);
      ctx.lineTo(cx, cy + s);
      ctx.lineTo(cx - s, cy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#dc2626";
      ctx.font = "900 100px Arial, Helvetica, sans-serif";
      ctx.fillText("!", cx, cy + 6);
    }
  });
}

let _sideTex;
function sideTexture() {
  if (!_sideTex) {
    _sideTex = canvasTexture(256, 256, (c, w, h) => weave(c, w, h));
    _sideTex.wrapS = _sideTex.wrapT = THREE.RepeatWrapping;
    _sideTex.repeat.set(2, 3);
  }
  return _sideTex;
}

export function makeBag(opts, { w = 1, h = 1.4, d = 0.42 } = {}) {
  const geo = new THREE.BoxGeometry(w, h, d, 28, 36, 6);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const nx = v.x / (w / 2), ny = v.y / (h / 2), nz = v.z / (d / 2);
    const fx = Math.max(Math.cos((nx * Math.PI) / 2), 0);
    const fy = Math.max(Math.cos((ny * Math.PI) / 2), 0);
    const bulge = Math.pow(fx, 0.55) * Math.pow(fy, 0.55);
    v.z = nz * (d / 2) * (0.12 + 0.88 * bulge);
    v.x *= 1 - 0.035 * Math.pow(Math.abs(ny), 8);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const side = new THREE.MeshStandardMaterial({ map: sideTexture(), roughness: 0.9 });
  const front = new THREE.MeshStandardMaterial({ map: bagFrontTexture(opts), roughness: 0.75 });
  const mesh = new THREE.Mesh(geo, [side, side, side, side, front, side]);
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

// ---------- DRUM ----------
function drumLabelTexture({ accent, deep, label, sub }) {
  return canvasTexture(1120, 400, (ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, w, 34);
    ctx.fillRect(0, h - 34, w, 34);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = deep;
    fitFont(ctx, label, w - 260, 120);
    ctx.fillText(label, w / 2, h / 2 - 30);
    ctx.fillStyle = "#475569";
    ctx.font = "700 56px Arial, Helvetica, sans-serif";
    ctx.fillText(sub, w / 2, h / 2 + 70);
  });
}

export function makeDrum(opts, { r = 0.42, h = 1.25 } = {}) {
  const g = new THREE.Group();
  const pts = [new THREE.Vector2(0.0001, 0)];
  const N = 140;
  for (let i = 0; i <= N; i++) {
    const y = (i / N) * h;
    let rr = r;
    for (const hy of [h / 3, (2 * h) / 3]) rr += 0.02 * Math.exp(-Math.pow((y - hy) / 0.022, 2));
    pts.push(new THREE.Vector2(rr, y));
  }
  pts.push(new THREE.Vector2(0.0001, h));
  const mat = new THREE.MeshStandardMaterial({ color: opts.color, metalness: 0.55, roughness: 0.32 });
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), mat);
  body.castShadow = body.receiveShadow = true;
  g.add(body);

  const rimMat = new THREE.MeshStandardMaterial({ color: opts.color, metalness: 0.7, roughness: 0.25 });
  for (const y of [0.012, h]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r + 0.004, 0.017, 12, 96), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = y;
    rim.castShadow = true;
    g.add(rim);
  }
  const bungMat = new THREE.MeshStandardMaterial({ color: "#cbd5e1", metalness: 0.8, roughness: 0.3 });
  for (const [x, z, rad] of [[r * 0.55, 0, 0.055], [-r * 0.5, 0.12, 0.038]]) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.025, 32), bungMat);
    b.position.set(x, h + 0.012, z);
    g.add(b);
  }
  const lt = drumLabelTexture({ accent: opts.accent ?? "#ffffff", deep: opts.deep, label: opts.label, sub: opts.sub });
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(r + 0.004, r + 0.004, h * 0.27, 96, 1, true, -0.31 * Math.PI, 0.62 * Math.PI),
    new THREE.MeshStandardMaterial({ map: lt, roughness: 0.55 })
  );
  label.position.y = h / 2;
  g.add(label);
  return g;
}

// ---------- TRAY + PRODUCT HEAPS ----------
function makeTray(R = 0.64) {
  const pts = [
    [0.0001, 0], [R - 0.05, 0], [R, 0.02], [R + 0.012, 0.075], [R - 0.012, 0.08], [R - 0.05, 0.028], [0.0001, 0.028],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const m = new THREE.Mesh(
    new THREE.LatheGeometry(pts, 96),
    new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.4, metalness: 0.25 })
  );
  m.castShadow = m.receiveShadow = true;
  return m;
}

function makePowder(R = 0.52, H = 0.27) {
  const g = new THREE.Group();
  const pts = [];
  for (let i = 40; i >= 0; i--) {
    const t = i / 40;
    pts.push(new THREE.Vector2(Math.max(R * t, 0.0001), H * Math.pow(1 - t * t, 1.15)));
  }
  let geo = new THREE.LatheGeometry(pts, 128);
  geo.deleteAttribute("uv");
  geo.deleteAttribute("normal");
  geo = mergeVertices(geo);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (y > 0.004) p.setY(i, y + 0.012 * Math.sin(x * 23 + z * 17) * Math.cos(z * 19 - x * 7) + 0.006 * Math.sin(x * 61 - z * 47));
  }
  geo.computeVertexNormals();
  const heap = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 1 }));
  heap.castShadow = heap.receiveShadow = true;
  g.add(heap);
  const r = rng(5);
  const n = 500;
  const dots = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.006, 6, 4),
    new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.9 }),
    n
  );
  const m = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    const rr = R * (0.2 + r() * 0.95);
    const a = r() * TAU;
    const t = Math.min(rr / R, 1);
    const y = rr > R ? 0.004 : H * Math.pow(1 - t * t, 1.15) + 0.002;
    m.makeTranslation(Math.cos(a) * rr, y, Math.sin(a) * rr);
    dots.setMatrixAt(i, m);
  }
  g.add(dots);
  return g;
}

function scatterPile({ geo, mat, count, R, H, seed, scaleFn, flatten = 1 }) {
  const inst = new THREE.InstancedMesh(geo, mat, count);
  inst.castShadow = inst.receiveShadow = true;
  const r = rng(seed);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const outside = i < count * 0.04;
    const rr = outside ? R * (0.95 + r() * 0.22) : R * Math.sqrt(r());
    const a = r() * TAU;
    const maxh = outside ? 0 : H * Math.pow(Math.max(1 - rr / R, 0), 1.05);
    p.set(Math.cos(a) * rr, 0.008 + maxh * Math.sqrt(r()), Math.sin(a) * rr);
    e.set((r() - 0.5) * 2.4 * flatten, r() * TAU, (r() - 0.5) * 2.4 * flatten);
    q.setFromEuler(e);
    scaleFn(s, r);
    m.compose(p, q, s);
    inst.setMatrixAt(i, m);
  }
  return inst;
}

function makeFlakes() {
  const geo = new THREE.CylinderGeometry(0.06, 0.06, 0.008, 5);
  const mat = new THREE.MeshPhysicalMaterial({
    color: "#f8fafc", roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08, flatShading: true,
  });
  return scatterPile({
    geo, mat, count: 950, R: 0.5, H: 0.3, seed: 11, flatten: 0.8,
    scaleFn: (s, r) => s.set(0.55 + r() * 0.9, 1, 0.45 + r() * 0.8),
  });
}

function makeCrystals() {
  const geo = new THREE.BoxGeometry(0.03, 0.03, 0.03);
  const mat = new THREE.MeshPhysicalMaterial({
    color: "#ffffff", roughness: 0.1, transmission: 0.35, thickness: 0.03, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.05,
  });
  return scatterPile({
    geo, mat, count: 1700, R: 0.48, H: 0.27, seed: 29,
    scaleFn: (s, r) => {
      const k = 0.55 + r() * 0.8;
      s.set(k, k * (0.8 + r() * 0.5), k);
    },
  });
}

function makeLemonSlice() {
  const top = canvasTexture(512, 512, (c, w) => {
    const cx = w / 2;
    c.fillStyle = "#eab308";
    c.beginPath(); c.arc(cx, cx, cx, 0, TAU); c.fill();
    c.fillStyle = "#fef9c3";
    c.beginPath(); c.arc(cx, cx, cx * 0.9, 0, TAU); c.fill();
    for (let i = 0; i < 10; i++) {
      const a0 = (i / 10) * TAU + 0.05, a1 = ((i + 1) / 10) * TAU - 0.05;
      c.fillStyle = i % 2 ? "#fde047" : "#facc15";
      c.beginPath();
      c.moveTo(cx + Math.cos((a0 + a1) / 2) * 22, cx + Math.sin((a0 + a1) / 2) * 22);
      c.arc(cx, cx, cx * 0.82, a0, a1);
      c.closePath();
      c.fill();
    }
    c.fillStyle = "#fef9c3";
    c.beginPath(); c.arc(cx, cx, 24, 0, TAU); c.fill();
  });
  const rind = new THREE.MeshStandardMaterial({ color: "#eab308", roughness: 0.55 });
  const face = new THREE.MeshPhysicalMaterial({ map: top, roughness: 0.35, clearcoat: 0.6 });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.045, 64), [rind, face, rind]);
  m.castShadow = m.receiveShadow = true;
  return m;
}

function makeHeap(type) {
  if (type === "flakes") return makeFlakes();
  if (type === "crystals") return makeCrystals();
  return makePowder();
}

// ---------- SHARED SETUP ----------
function setupRenderer(renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

function addLights(scene, renderer, { mapSize = 2048, extent = 3 } = {}) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.75;
  pmrem.dispose();
  const key = new THREE.DirectionalLight("#ffffff", 2.4);
  key.position.set(-2.5, 5, 3.5);
  key.castShadow = true;
  key.shadow.mapSize.set(mapSize, mapSize);
  Object.assign(key.shadow.camera, { left: -extent, right: extent, top: extent, bottom: -extent, near: 0.5, far: 20 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#bfdbfe", 0.9);
  rim.position.set(3, 2.5, -3);
  scene.add(rim);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.2 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
}

function disposeScene(scene) {
  scene.traverse((o) => {
    o.geometry?.dispose?.();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    mats.forEach((m) => {
      Object.values(m).forEach((v) => v?.isTexture && v.dispose());
      m.dispose();
    });
  });
  scene.environment?.dispose?.();
  scene.background?.dispose?.();
}

// ---------- PRODUCT SCENE (for image rendering) ----------
export function buildProductScene(p, t, renderer) {
  const scene = new THREE.Scene();
  scene.background = canvasTexture(512, 512, (c, w, h) => {
    const g = c.createRadialGradient(w * 0.45, h * 0.35, 20, w / 2, h / 2, w * 0.75);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, t.soft);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });
  addLights(scene, renderer);

  const bag = makeBag({
    accent: t.accent, deep: t.deep, lines: splitTitle(p.name), grade: p.grade, formula: p.formula, hs: p.hsCode, hazard: p.hazard,
  });
  bag.position.set(-0.42, 0.7, -0.6);
  bag.rotation.y = 0.22;
  scene.add(bag);

  const drum = makeDrum({ color: t.accent, accent: t.accent, deep: t.deep, label: splitTitle(p.name)[0], sub: p.grade });
  drum.position.set(0.78, 0, -1.0);
  drum.rotation.y = -0.45;
  scene.add(drum);

  const tray = makeTray();
  tray.position.set(0.12, 0, 0.6);
  scene.add(tray);
  const heap = makeHeap(p.visual);
  heap.position.set(0.12, 0.028, 0.6);
  scene.add(heap);

  if (p.visual === "crystals") {
    const l1 = makeLemonSlice();
    l1.position.set(0.86, 0.1, 0.95);
    l1.rotation.set(0.35, 0, -0.5);
    scene.add(l1);
    const l2 = makeLemonSlice();
    l2.position.set(0.9, 0.025, 0.5);
    scene.add(l2);
  }
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0.45, 1.45, 4.1);
  camera.lookAt(0.12, 0.5, 0);
  return { scene, camera };
}

export function renderProductImage(p, t, w = 1200, h = 1080) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  setupRenderer(renderer);
  renderer.setPixelRatio(1);
  renderer.setSize(w, h, false);
  const { scene, camera } = buildProductScene(p, t, renderer);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/webp", 0.9);
  disposeScene(scene);
  renderer.dispose();
  return url;
}
