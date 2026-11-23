// ============================================================
//  Home hero 3D: molecules + lab glassware + crystals floating
//  around the centred headline. Drag / swipe anywhere on the hero
//  to spin the whole arrangement 360° around the text.
// ============================================================
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const TAU = Math.PI * 2;
const D2R = Math.PI / 180;

function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ---------- materials ----------
// LITE = phones / low-power devices: no transmission pass, fewer polygons & particles, 30 fps.
let LITE = false;
export function isLowPower() {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 8;
  const mem = navigator.deviceMemory || 8;
  return coarse || narrow || cores <= 4 || mem <= 4;
}

const glassLite = () =>
  new THREE.MeshStandardMaterial({
    color: "#e6fffb",
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

const glass = () => LITE ? glassLite() :
  new THREE.MeshPhysicalMaterial({
    color: "#f0fdfa",
    transmission: 0.92,
    roughness: 0.06,
    thickness: 0.35,
    specularIntensity: 1,
    envMapIntensity: 1.6,
    ior: 1.45,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    attenuationColor: new THREE.Color("#ccfbf1"),
    attenuationDistance: 12,
    side: THREE.DoubleSide,
  });

const liquid = (color) => LITE
  ? new THREE.MeshStandardMaterial({ color, emissive: new THREE.Color(color).multiplyScalar(0.28), roughness: 0.2 })
  :
  new THREE.MeshPhysicalMaterial({
    color,
    emissive: new THREE.Color(color).multiplyScalar(0.28),
    roughness: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    sheen: 0.4,
    sheenColor: new THREE.Color("#ffffff"),
  });

const lathe = (pts, mat, seg = LITE ? 32 : 64) =>
  new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg), mat);

// ---------- glassware ----------
function erlenmeyer(color) {
  const g = new THREE.Group();
  g.add(lathe([[0.001, 0], [0.5, 0], [0.55, 0.05], [0.2, 0.95], [0.2, 1.35], [0.24, 1.4]], glass()));
  g.add(lathe([[0.001, 0.02], [0.48, 0.02], [0.52, 0.06], [0.36, 0.42], [0.001, 0.42]], liquid(color)));
  g.position.y = -0.7;
  return wrap(g);
}

function beaker(color) {
  const g = new THREE.Group();
  g.add(lathe([[0.001, 0], [0.47, 0], [0.5, 0.03], [0.5, 1.1], [0.56, 1.16]], glass()));
  g.add(lathe([[0.001, 0.03], [0.46, 0.03], [0.46, 0.62], [0.001, 0.62]], liquid(color)));
  const tick = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.8 });
  for (let i = 0; i < 4; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.505, 0.006, 4, 48, 0.5), tick);
    t.rotation.x = Math.PI / 2;
    t.rotation.z = 1.2;
    t.position.y = 0.35 + i * 0.18;
    g.add(t);
  }
  g.position.y = -0.58;
  return wrap(g);
}

function testTube(color, fill = 0.7) {
  const g = new THREE.Group();
  const outer = [], inner = [];
  for (let i = 0; i <= 10; i++) {
    const a = (i / 10) * (Math.PI / 2);
    outer.push([Math.max(0.14 * Math.sin(a), 0.001), 0.14 - 0.14 * Math.cos(a)]);
    inner.push([Math.max(0.122 * Math.sin(a), 0.001), 0.15 - 0.122 * Math.cos(a)]);
  }
  g.add(lathe([...outer, [0.14, 1.3], [0.165, 1.34]], glass(), 48));
  g.add(lathe([...inner, [0.122, fill], [0.001, fill]], liquid(color), 48));
  g.position.y = -0.67;
  return wrap(g);
}

function roundFlask(color) {
  const g = new THREE.Group();
  const outer = [], inner = [];
  for (let a = -90; a <= 75; a += 5) outer.push([Math.max(0.5 * Math.cos(a * D2R), 0.001), 0.5 + 0.5 * Math.sin(a * D2R)]);
  for (let a = -90; a <= -5; a += 5) inner.push([Math.max(0.47 * Math.cos(a * D2R), 0.001), 0.5 + 0.47 * Math.sin(a * D2R)]);
  g.add(lathe([...outer, [0.13, 1.45], [0.16, 1.5]], glass()));
  g.add(lathe([...inner, [0.001, 0.46]], liquid(color)));
  g.position.y = -0.75;
  return wrap(g);
}

function wrap(inner) {
  const g = new THREE.Group();
  g.add(inner);
  return g;
}

// ---------- molecules ----------
const ELEMENTS = {
  C: { color: "#1e293b", r: 0.17 },
  O: { color: "#ef233c", r: 0.16 },
  H: { color: "#f8fafc", r: 0.1 },
  Na: { color: "#7c3aed", r: 0.22 },
};

function molecule(atoms, bonds, bondColor) {
  const g = new THREE.Group();
  const spheres = {};
  const mats = {};
  for (const [e, def] of Object.entries(ELEMENTS)) {
    spheres[e] = LITE ? new THREE.SphereGeometry(def.r, 18, 12) : new THREE.SphereGeometry(def.r, 40, 28);
    mats[e] = LITE
      ? new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.18, metalness: 0.05 })
      : new THREE.MeshPhysicalMaterial({ color: def.color, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04 });
  }
  const pts = atoms.map(([e, x, y, z]) => {
    const m = new THREE.Mesh(spheres[e], mats[e]);
    m.position.set(x, y, z);
    g.add(m);
    return m.position;
  });
  const bondMat = LITE
    ? new THREE.MeshStandardMaterial({ color: bondColor, roughness: 0.25, metalness: 0.1 })
    : new THREE.MeshPhysicalMaterial({ color: bondColor, roughness: 0.2, metalness: 0.1, clearcoat: 1 });
  const up = new THREE.Vector3(0, 1, 0);
  for (const [a, b] of bonds) {
    const d = new THREE.Vector3().subVectors(pts[b], pts[a]);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, d.length(), LITE ? 8 : 16), bondMat);
    c.position.copy(pts[a]).addScaledVector(d, 0.5);
    c.quaternion.setFromUnitVectors(up, d.normalize());
    g.add(c);
  }
  // centre it
  const box = new THREE.Box3().setFromObject(g);
  const ctr = box.getCenter(new THREE.Vector3());
  g.children.forEach((ch) => ch.position.sub(ctr));
  return wrap(g);
}

const sodaAsh = (c) =>
  molecule(
    [["C", 0, 0, 0], ["O", 0, 0.45, 0], ["O", 0.39, -0.225, 0], ["O", -0.39, -0.225, 0], ["Na", 0.8, -0.46, 0.3], ["Na", -0.8, -0.46, -0.3]],
    [[0, 1], [0, 2], [0, 3], [2, 4], [3, 5]],
    c
  );

const causticSoda = (c) =>
  molecule([["Na", -0.5, 0, 0], ["O", 0, 0, 0], ["H", 0.3, 0.2, 0]], [[0, 1], [1, 2]], c);

const citricAcid = (c) =>
  molecule(
    [
      ["C", 0, 0, 0], // 0 central C
      ["O", 0, 0.45, 0], ["H", 0.2, 0.62, 0], // 1,2 OH
      ["C", -0.45, -0.15, 0], ["C", 0.45, -0.15, 0], // 3,4 CH2
      ["C", -0.82, 0.15, 0], ["O", -0.82, 0.58, 0], ["O", -1.2, -0.06, 0], ["H", -1.42, 0.1, 0], // 5-8 COOH left
      ["C", 0.82, 0.15, 0], ["O", 0.82, 0.58, 0], ["O", 1.2, -0.06, 0], ["H", 1.42, 0.1, 0], // 9-12 COOH right
      ["C", 0, -0.32, 0.42], ["O", 0, -0.74, 0.48], ["O", 0, -0.15, 0.82], ["H", 0, -0.3, 1.04], // 13-16 COOH centre
    ],
    [[0, 1], [1, 2], [0, 3], [0, 4], [3, 5], [5, 6], [5, 7], [7, 8], [4, 9], [9, 10], [9, 11], [11, 12], [0, 13], [13, 14], [13, 15], [15, 16]],
    c
  );

// ---------- crystals & bubbles ----------
function sparkles(seed = 7) {
  const g = new THREE.Group();
  const r = rng(seed);
  const crystalMat = LITE
    ? new THREE.MeshStandardMaterial({ color: "#5eead4", roughness: 0.15, metalness: 0.1, flatShading: true, transparent: true, opacity: 0.85 })
    : new THREE.MeshPhysicalMaterial({ color: "#5eead4", transmission: 0.55, roughness: 0.05, thickness: 0.2, ior: 1.5, clearcoat: 1, flatShading: true });
  const cubeMat = LITE
    ? new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.15 })
    : new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.1, clearcoat: 1, transmission: 0.4, thickness: 0.1 });
  const k = LITE ? 0.5 : 1;
  const bubbleMat = glass();
  const shapes = [
    [new THREE.OctahedronGeometry(0.13), crystalMat, Math.round(10 * k)],
    [new THREE.BoxGeometry(0.12, 0.12, 0.12), cubeMat, Math.round(8 * k)],
    [new THREE.SphereGeometry(0.07, LITE ? 10 : 20, LITE ? 8 : 14), bubbleMat, Math.round(14 * k)],
  ];
  const items = [];
  for (const [geo, mat, n] of shapes) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(geo, mat);
      const a = r() * TAU;
      const rad = 2.8 + r() * 3.6;
      m.position.set(Math.sin(a) * rad, -1.9 + r() * 3.8, Math.cos(a) * rad - 0.5);
      m.rotation.set(r() * TAU, r() * TAU, 0);
      m.scale.setScalar(0.6 + r() * 1.1);
      m.userData = { base: m.position.clone(), phase: r() * TAU, spin: 0.3 + r() * 0.8 };
      g.add(m);
      items.push(m);
    }
  }
  return { group: g, items };
}

// ---------- scene ----------
function background() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const x = c.getContext("2d");
  const lg = x.createLinearGradient(0, 0, 0, 1024);
  lg.addColorStop(0, "#f0fdfa");
  lg.addColorStop(1, "#ffffff");
  x.fillStyle = lg;
  x.fillRect(0, 0, 1024, 1024);
  for (const [cx, cy, r, col] of [
    [150, 250, 420, "rgba(45,212,191,0.22)"],
    [900, 300, 380, "rgba(16,185,129,0.16)"],
    [520, 1000, 460, "rgba(20,184,166,0.14)"],
  ]) {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, col);
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 1024, 1024);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// [builder, angle°, radius, y, scale, tiltZ]
function layout(themes) {
  const blue = themes.sky.accent, orange = themes.orange.accent, green = themes.lime.accent;
  return [
    [() => erlenmeyer("#14b8a6"), -70, 5.0, -1.1, 1.25, 0.1],
    [() => sodaAsh(blue), -115, 5.0, 1.5, 1.15, 0],
    [() => beaker(orange), 72, 5.0, -1.2, 1.1, -0.08],
    [() => causticSoda(orange), 112, 4.8, 1.6, 1.5, 0],
    [() => citricAcid(green), 22, 4.6, 1.75, 0.8, 0],
    [() => testTube(blue, 0.8), -40, 4.8, 1.25, 0.95, 0.45],
    [() => testTube(green, 0.6), -31, 4.9, 1.0, 0.85, 0.2],
    [() => roundFlask(green), 150, 5.0, -0.4, 1.1, 0],
    [() => testTube(orange, 0.75), -150, 5.0, -1.4, 1.0, -0.4],
    [() => sodaAsh(green), 180, 5.2, 1.6, 0.9, 0],
  ];
}

function buildScene(themes, renderer) {
  const scene = new THREE.Scene();
  scene.background = background();
  if (LITE) {
    // phones: skip the reflection-map generation (big one-time GPU stall) — plain lights instead
    scene.add(new THREE.HemisphereLight("#ffffff", "#99f6e4", 2.2));
    const rimL = new THREE.DirectionalLight("#ffffff", 1.2);
    rimL.position.set(4, 3, -4);
    scene.add(rimL);
  } else {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 1.0;
    pmrem.dispose();
  }
  const key = new THREE.DirectionalLight("#ffffff", 2.0);
  key.position.set(-3, 6, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight("#ccfbf1", 1.0);
  fill.position.set(5, -2, 3);
  scene.add(fill);

  const ring = new THREE.Group();
  scene.add(ring);
  const items = [];
  const all = layout(themes);
  const list = LITE ? all.filter((_, i) => ![6, 9].includes(i)) : all; // drop 2 minor items on phones
  for (const [make, ang, rad, y, s, tilt] of list) {
    const o = make();
    const a = ang * D2R;
    o.position.set(Math.sin(a) * rad, y, Math.cos(a) * rad);
    o.scale.setScalar(s);
    o.rotation.z = tilt;
    o.userData = { base: o.position.clone(), baseScale: s, phase: (ang + 180) * 0.05, spin: 0.25 };
    ring.add(o);
    items.push(o);
  }
  const sp = sparkles();
  ring.add(sp.group);
  sp.items.forEach((m) => (m.userData.baseScale = m.scale.x));
  items.push(...sp.items);

  const camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.1, 100);
  camera.position.set(0, 0.4, 12);
  camera.lookAt(0, 0, 0);
  return { scene, ring, items, camera };
}

// Narrow (phone) screens: pull objects in toward the centre and shrink them.
function fit(items, camera, aspect) {
  const f = Math.min(Math.max(aspect / 1.7, 0.42), 1);
  for (const o of items) {
    const b = o.userData.base;
    const ys = 1 + (1 - f) * 1.7; // portrait: push objects into top / bottom bands, away from the text
    o.userData.cur = new THREE.Vector3(b.x * f, b.y * ys, b.z * f);
    o.scale.setScalar(o.userData.baseScale * (0.45 + 0.55 * f));
  }
  camera.aspect = aspect;
  camera.position.z = f < 1 ? 13 : 12;
  camera.updateProjectionMatrix();
}

function setup(renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping; // keeps colours saturated (ACES washes them out)
  renderer.toneMappingExposure = 1.12;
}

function animate(items, t) {
  for (const o of items) {
    const { cur, phase, spin } = o.userData;
    o.position.set(cur.x, cur.y + Math.sin(t * 0.9 + phase) * 0.12, cur.z);
    o.rotation.y = t * spin * 0.6 + phase;
  }
}

function dispose(scene) {
  scene.traverse((o) => {
    o.geometry?.dispose?.();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    mats.forEach((m) => m.dispose());
  });
  scene.environment?.dispose?.();
  scene.background?.dispose?.();
}

export function renderPoster(themes, w = 1600, h = 900) {
  LITE = false;
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  setup(renderer);
  renderer.setPixelRatio(1);
  renderer.setSize(w, h, false);
  const { scene, ring, items, camera } = buildScene(themes, renderer);
  fit(items, camera, w / h);
  ring.rotation.y = -0.15;
  animate(items, 0);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/webp", 0.9);
  dispose(scene);
  renderer.dispose();
  return url;
}

// Mount the live scene. `dragEl` is the element that receives drag / swipe.
export function mountHero(container, dragEl, themes, { onReady, onInteract, onFallback } = {}) {
  LITE = isLowPower();
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !LITE, powerPreference: LITE ? "low-power" : "high-performance" });
  } catch {
    onFallback?.();
    return () => {};
  }
  setup(renderer);
  const dprSteps = LITE ? [1.25, 1, 0.8] : [Math.min(window.devicePixelRatio || 1, 1.75), 1.25, 1];
  let dprLevel = 0;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprSteps[0]));
  const canvas = renderer.domElement;
  canvas.style.cssText = "width:100%;height:100%;display:block;opacity:0;transition:opacity .8s ease";
  container.appendChild(canvas);

  const { scene, ring, items, camera } = buildScene(themes, renderer);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    fit(items, camera, width / height);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // --- drag / swipe to spin ---
  const rot = { y: -0.15, x: 0, ty: -0.15, tx: 0, vel: 0 };
  let drag = null, idleUntil = 0;
  const down = (e) => {
    if (e.target.closest("a,button,input,select,textarea")) return;
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId };
    dragEl.style.cursor = "grabbing";
    onInteract?.();
  };
  const move = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    rot.ty += dx * 0.008;
    rot.vel = dx * 0.008;
    rot.tx = Math.max(-0.35, Math.min(0.35, rot.tx + dy * 0.004));
  };
  const up = () => {
    if (!drag) return;
    drag = null;
    dragEl.style.cursor = "grab";
    idleUntil = performance.now() + 3500;
  };
  dragEl.style.cursor = "grab";
  dragEl.style.touchAction = "pan-y"; // vertical swipe still scrolls the page
  dragEl.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(container);
  let tabHidden = document.hidden;
  const onVis = () => (tabHidden = document.hidden);
  document.addEventListener("visibilitychange", onVis);

  // fps cap (30 on lite) + watchdog: if the device can't keep up, stop 3D and keep the still image
  const minFrame = LITE ? 1000 / 30 : 0;
  let lastFrame = 0, sampled = 0, slowSum = 0, stopped = false;
  let scrolling = false, scrollTimer;
  const onPageScroll = () => {
    scrolling = true;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => (scrolling = false), 180);
  };
  window.addEventListener("scroll", onPageScroll, { passive: true });

  const clock = new THREE.Clock();
  let raf, first = true, last = 0, scrollP = 0;
  const tick = (now = performance.now()) => {
    if (stopped) return;
    raf = requestAnimationFrame(tick);
    if ((!visible || tabHidden) && !first) {
      lastFrame = 0;
      return;
    }
    const cap = scrolling && LITE ? 1000 / 15 : minFrame;
    if (cap && lastFrame && now - lastFrame < cap - 2) return;
    // adaptive quality: if frames are slow, lower the resolution (never stop the 3D)
    if (lastFrame && !scrolling) {
      sampled++;
      if (sampled > 15) slowSum += now - lastFrame; // skip warm-up frames
      if (sampled === 75) {
        const avg = slowSum / 60;
        if (avg > (LITE ? 45 : 28) && dprLevel < dprSteps.length - 1) {
          dprLevel++;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprSteps[dprLevel]));
          resize();
        }
        sampled = 0;
        slowSum = 0;
      }
    }
    lastFrame = now;
    const t = clock.getElapsedTime();
    const dt = Math.min(t - last, 0.05);
    last = t;
    if (!drag) {
      rot.ty += rot.vel; // inertia
      rot.vel *= 0.92;
      if (!reduce && performance.now() > idleUntil) rot.ty += dt * 0.12; // slow auto-spin
      rot.tx *= 0.97;
    }
    rot.y += (rot.ty - rot.y) * 0.12;
    rot.x += (rot.tx - rot.x) * 0.12;
    // scroll: objects rise, spin and spread out as the visitor scrolls past the hero
    const sp = Math.min(Math.max(window.scrollY / (container.clientHeight || 1), 0), 1.2);
    scrollP += (sp - scrollP) * 0.1;
    ring.rotation.y = rot.y + scrollP * 1.6;
    ring.rotation.x = rot.x + scrollP * 0.25;
    ring.position.y = scrollP * 2.4;
    ring.scale.setScalar(1 + scrollP * 0.3);
    animate(items, reduce ? 0 : t);
    renderer.render(scene, camera);
    if (first) {
      first = false;
      canvas.style.opacity = "1";
      onReady?.();
    }
  };
  const begin = () => !stopped && tick();
  if (renderer.compileAsync) renderer.compileAsync(scene, camera).then(begin, begin);
  else begin();

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("scroll", onPageScroll);
    clearTimeout(scrollTimer);
    ro.disconnect();
    io.disconnect();
    dragEl.removeEventListener("pointerdown", down);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", up);
    dragEl.style.cursor = "";
    dispose(scene);
    renderer.dispose();
    canvas.remove();
  };
}
