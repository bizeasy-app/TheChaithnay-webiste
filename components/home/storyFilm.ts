import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * The home story as a short 3D film made of real things: a glossy ball (the
 * hero), the gadgets that fly past it, a laptop that crashes and gets fixed,
 * and a crowd of people who end up standing in the shape of the logo.
 * Scroll progress (0 → 8) is the timeline. The floor is y = 0; 1 unit ≈ 30 cm.
 */

const N = 8;
const FOV = 35;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const bounce = (t: number) => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t - 1.5 / d) ** 2 + 0.75;
  if (t < 2.5 / d) return n * (t - 2.25 / d) ** 2 + 0.9375;
  return n * (t - 2.625 / d) ** 2 + 0.984375;
};
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rbox = (w: number, h: number, d: number, r: number) => new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2, h / 2, d / 2));

// ── Materials of real things ──
const SAFFRON = '#e8792b';
const metal = (color: string, roughness = 0.35, metalness = 0.85) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, transparent: true });
const plastic = (color: string, roughness = 0.45) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, transparent: true });
const glass = () => new THREE.MeshPhysicalMaterial({ color: '#0b0a09', roughness: 0.06, metalness: 0.2, clearcoat: 1, transparent: true });
const lit = (map: THREE.Texture) => new THREE.MeshBasicMaterial({ map, transparent: true, toneMapped: false });

/** A screen that is switched on: a soft glowing wallpaper. */
function wallpaper() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 256;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 128, 256);
    g.addColorStop(0, '#f0a868');
    g.addColorStop(0.55, '#e8792b');
    g.addColorStop(1, '#26305c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 256);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ── Gadgets for "Every day, new tech flew past it" ──
function phone(screen: THREE.Texture) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(rbox(0.36, 0.74, 0.04, 0.05), metal('#2b2723')));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.68), lit(screen));
  face.position.z = 0.021;
  const cam = new THREE.Mesh(rbox(0.12, 0.12, 0.02, 0.03), glass());
  cam.position.set(-0.08, 0.24, -0.028);
  g.add(face, cam);
  return g;
}
function laptopSmall(screen: THREE.Texture) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(rbox(1.0, 0.035, 0.68, 0.03), metal('#cfcac2')));
  const lid = new THREE.Group();
  lid.position.set(0, 0.02, -0.33);
  lid.rotation.x = -0.3;
  const shell = new THREE.Mesh(rbox(1.0, 0.66, 0.025, 0.03), metal('#cfcac2'));
  shell.position.y = 0.33;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.58), lit(screen));
  face.position.set(0, 0.33, 0.014);
  lid.add(shell, face);
  g.add(lid);
  return g;
}
function headset() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(rbox(0.62, 0.32, 0.3, 0.12), plastic('#ecebe7')));
  const visor = new THREE.Mesh(rbox(0.58, 0.28, 0.04, 0.1), glass());
  visor.position.z = 0.15;
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.035, 10, 40, Math.PI), plastic('#2b2723', 0.8));
  strap.rotation.x = Math.PI / 2;
  strap.position.z = -0.12;
  g.add(visor, strap);
  return g;
}
function drone() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(rbox(0.3, 0.09, 0.3, 0.04), plastic('#2b2723', 0.4)));
  const props: THREE.Mesh[] = [];
  [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ].forEach(([x, z]) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.025, 0.04), plastic('#2b2723', 0.5));
    arm.position.set(x * 0.17, 0, z * 0.17);
    arm.rotation.y = x * z > 0 ? -Math.PI / 4 : Math.PI / 4;
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 16), metal('#8a847c'));
    motor.position.set(x * 0.29, 0.03, z * 0.29);
    const prop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.006, 0.035), plastic('#ecebe7'));
    prop.position.set(x * 0.29, 0.065, z * 0.29);
    props.push(prop);
    g.add(arm, motor, prop);
  });
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 14), glass());
  lens.position.set(0, -0.05, 0.13);
  g.add(lens);
  g.userData.props = props;
  return g;
}
function watch(screen: THREE.Texture) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(rbox(0.26, 0.31, 0.08, 0.06), metal('#d9d4cc')));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.27), lit(screen));
  face.position.z = 0.041;
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.022, 8, 40), plastic(SAFFRON, 0.6));
  band.scale.set(1, 1.15, 1.8);
  band.rotation.y = Math.PI / 2;
  band.position.z = -0.02;
  g.add(face, band);
  return g;
}
function chip() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(rbox(0.46, 0.05, 0.46, 0.015), plastic('#1c1a18', 0.3)));
  const lid = new THREE.Mesh(rbox(0.3, 0.02, 0.3, 0.01), metal('#bdb8b0', 0.25));
  lid.position.y = 0.035;
  g.add(lid);
  const pinGeo = new THREE.BoxGeometry(0.018, 0.01, 0.07);
  const gold = metal('#c9a24a', 0.3, 1);
  for (let i = 0; i < 8; i += 1) {
    const o = -0.19 + i * 0.054;
    [
      [o, 0.26, 0],
      [o, -0.26, 0],
      [0.26, o, 1],
      [-0.26, o, 1],
    ].forEach(([a, b, turn]) => {
      const pin = new THREE.Mesh(pinGeo, gold);
      if (turn) pin.rotation.y = Math.PI / 2;
      pin.position.set(a, -0.02, b);
      g.add(pin);
    });
  }
  return g;
}
function headphones() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 12, 48, Math.PI), plastic('#2b2723', 0.5)));
  [-1, 1].forEach((side) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 32), plastic('#ecebe7'));
    cup.rotation.z = Math.PI / 2;
    cup.position.set(side * 0.28, -0.04, 0);
    const pad = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.035, 10, 32), plastic('#2b2723', 0.9));
    pad.rotation.y = Math.PI / 2;
    pad.position.set(side * 0.22, -0.04, 0);
    g.add(cup, pad);
  });
  return g;
}

// ── The laptop's screen: real software states ──
type ScreenState = 'off' | 'boot' | 'error' | 'fixed' | 'video';
function drawScreen(ctx: CanvasRenderingContext2D, state: ScreenState, f: number, time: number) {
  const w = 768;
  const h = 480;
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  if (state === 'off') {
    ctx.fillStyle = '#0b0a09';
    ctx.fillRect(0, 0, w, h);
  } else if (state === 'boot') {
    ctx.fillStyle = '#141210';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = f;
    ctx.strokeStyle = '#f0eee9';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(384, 240, 60, (48 * Math.PI) / 180, (312 * Math.PI) / 180);
    ctx.stroke();
    ctx.fillStyle = SAFFRON;
    ctx.beginPath();
    ctx.arc(444, 240, 17 + Math.sin(time * 4) * 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (state === 'error') {
    ctx.fillStyle = '#141210';
    ctx.fillRect(0, 0, w, h);
    ctx.font = '500 22px ui-monospace, Menlo, monospace';
    const lines = [
      ['#a69d93', '$ npm run build'],
      ['#a69d93', '> compiling modules...'],
      ['#f0eee9', 'TypeError: Cannot read properties of undefined'],
      ['#a69d93', '    at render (app/page.tsx:42:17)'],
      ['#a69d93', '    at build (next/dist/build)'],
      [SAFFRON, '✕ Build failed.'],
    ];
    const shown = Math.floor(f * 2.2 * lines.length);
    lines.slice(0, shown).forEach(([color, text], i) => {
      ctx.fillStyle = color;
      ctx.fillText(text, 40, 64 + i * 40);
    });
    const big = clamp(f * 2 - 0.9);
    if (big > 0) {
      const sz = 0.6 + big * 0.4;
      ctx.globalAlpha = big * 0.95;
      ctx.fillStyle = SAFFRON;
      ctx.beginPath();
      ctx.arc(384, 300, 110 * sz, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#141210';
      ctx.lineWidth = 24;
      ctx.lineCap = 'round';
      const s = 44 * sz;
      ctx.beginPath();
      ctx.moveTo(384 - s, 300 - s);
      ctx.lineTo(384 + s, 300 + s);
      ctx.moveTo(384 + s, 300 - s);
      ctx.lineTo(384 - s, 300 + s);
      ctx.stroke();
    }
  } else if (state === 'fixed') {
    ctx.fillStyle = '#f0eee9';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e2ded7';
    ctx.fillRect(0, 0, w, 44);
    [SAFFRON, '#c9c3ba', '#c9c3ba'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(28 + i * 24, 22, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = clamp(f * 3);
    ctx.fillStyle = '#1a1714';
    ctx.font = '800 58px Manrope, system-ui, sans-serif';
    ctx.fillText('It works.', 48, 140);
    ctx.font = '500 26px Manrope, system-ui, sans-serif';
    ctx.fillStyle = '#6b625a';
    ctx.fillText('Build passed', 48, 186);
    ctx.globalAlpha = clamp(f * 3 - 1);
    ctx.fillStyle = SAFFRON;
    ctx.beginPath();
    ctx.roundRect(48, 330, 190, 64, 32);
    ctx.fill();
    ctx.fillStyle = '#1a1714';
    ctx.font = '800 26px Manrope, system-ui, sans-serif';
    ctx.fillText('Ship it', 96, 372);
    const c = clamp(f * 3 - 1.6);
    ctx.globalAlpha = 1;
    if (c > 0) {
      ctx.strokeStyle = SAFFRON;
      ctx.lineWidth = 24;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const pts: [number, number][] = [
        [520, 250],
        [575, 305],
        [680, 190],
      ];
      ctx.beginPath();
      ctx.moveTo(...pts[0]);
      const first = Math.min(1, c * 2);
      ctx.lineTo(mix(pts[0][0], pts[1][0], first), mix(pts[0][1], pts[1][1], first));
      if (c > 0.5) {
        const second = (c - 0.5) * 2;
        ctx.lineTo(mix(pts[1][0], pts[2][0], second), mix(pts[1][1], pts[2][1], second));
      }
      ctx.stroke();
    }
  } else {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#26305c');
    g.addColorStop(1, '#141210');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(240,238,233,0.92)';
    ctx.font = '800 32px Manrope, system-ui, sans-serif';
    ctx.fillText('What I learned building it', 36, 62);
    ctx.fillStyle = SAFFRON;
    ctx.beginPath();
    ctx.arc(384, 220, 72, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#141210';
    ctx.beginPath();
    ctx.moveTo(362, 182);
    ctx.lineTo(418, 220);
    ctx.lineTo(362, 258);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(240,238,233,0.25)';
    ctx.fillRect(36, 428, w - 72, 8);
    ctx.fillStyle = SAFFRON;
    ctx.fillRect(36, 428, (w - 72) * f, 8);
    ctx.beginPath();
    ctx.arc(36 + (w - 72) * f, 432, 11, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export type Film = {
  setProgress: (p: number) => void;
  dispose: () => void;
};

export function createFilm(canvas: HTMLCanvasElement): Film {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.7;
  const fog = new THREE.Fog(0xf0eee9, 12, 34);
  scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 80);

  // Soft key light that casts shadows, and a warm rim from behind.
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8178, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-4, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 7;
  key.shadow.camera.bottom = -7;
  key.shadow.camera.far = 30;
  key.shadow.radius = 6;
  key.shadow.bias = -0.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffb07a, 1.4);
  rim.position.set(5, 3, -6);
  scene.add(rim);

  // The floor only shows shadows, so the page colour stays the background.
  const floorMat = new THREE.ShadowMaterial({ opacity: 0.18 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const fade = (obj: THREE.Object3D, o: number) => {
    obj.visible = o > 0.004;
    if (!obj.visible) return;
    obj.traverse((child) => {
      const m = (child as THREE.Mesh).material as THREE.Material | undefined;
      if (m && !Array.isArray(m)) m.opacity = o * ((m.userData.base as number | undefined) ?? 1);
    });
  };

  // ── The hero: a glossy saffron ball ──
  const heroMat = new THREE.MeshPhysicalMaterial({
    color: SAFFRON,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    emissive: SAFFRON,
    emissiveIntensity: 0.12,
  });
  const hero = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), heroMat);
  hero.castShadow = true;
  scene.add(hero);
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 128;
  const gctx = glowCanvas.getContext('2d');
  if (gctx) {
    const g = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(232,121,43,0.5)');
    g.addColorStop(1, 'rgba(232,121,43,0)');
    gctx.fillStyle = g;
    gctx.fillRect(0, 0, 128, 128);
  }
  const glowTexture = new THREE.CanvasTexture(glowCanvas);
  const glowMat = new THREE.SpriteMaterial({ map: glowTexture, transparent: true, depthWrite: false, fog: false });
  const glow = new THREE.Sprite(glowMat);
  scene.add(glow);

  // ── Gadgets flying past ──
  const screenTexture = wallpaper();
  const rand = seeded(11);
  const makers = [() => phone(screenTexture), () => laptopSmall(screenTexture), headset, drone, () => watch(screenTexture), chip, headphones];
  const gadgets = new THREE.Group();
  const flying = Array.from({ length: 30 }, (_, i) => {
    const item = makers[i % makers.length]();
    const z = mix(-7, 1.6, rand());
    let y = mix(0.5, 3.6, rand());
    if (z > -1 && y < 1.2) y += 0.9; // keep clear of the ball
    item.scale.setScalar(mix(0.85, 1.25, rand()));
    gadgets.add(item);
    return {
      item,
      x0: mix(-4, 26, rand()),
      y,
      z,
      speed: mix(0.75, 1.5, rand()),
      spin: V(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(1.6),
    };
  });
  scene.add(gadgets);

  // ── The laptop ──
  const LP = V(1.8, 0, -0.6);
  const laptop = new THREE.Group();
  laptop.position.copy(LP);
  const alu = metal('#cfcac2', 0.32, 0.9);
  const base = new THREE.Mesh(rbox(3.0, 0.12, 2.0, 0.08), alu);
  base.position.y = 0.06;
  laptop.add(base);
  const well = new THREE.Mesh(rbox(2.7, 0.02, 0.98, 0.04), metal('#9d978f', 0.5, 0.8));
  well.position.set(0, 0.115, -0.48);
  laptop.add(well);
  const trackpad = new THREE.Mesh(rbox(1.1, 0.012, 0.6, 0.05), metal('#bdb7ae', 0.25, 0.9));
  trackpad.position.set(0, 0.121, 0.62);
  laptop.add(trackpad);
  const keyGeo = rbox(0.17, 0.045, 0.16, 0.025);
  const keyMat = plastic('#24211e', 0.55);
  const keys: { mesh: THREE.Mesh; home: THREE.Vector3; flies: boolean; v: THREE.Vector3; spin: THREE.Vector3 }[] = [];
  const keyRand = seeded(5);
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 13; col += 1) {
      const mesh = new THREE.Mesh(keyGeo, keyMat);
      const home = V(-1.2 + col * 0.2, 0.135, -0.86 + row * 0.19);
      mesh.position.copy(home);
      laptop.add(mesh);
      keys.push({
        mesh,
        home,
        flies: keyRand() < 0.22,
        v: V(mix(-1.6, 1.6, keyRand()), mix(2.4, 4.2, keyRand()), mix(0.6, 2.6, keyRand())),
        spin: V(keyRand() * 14 - 7, keyRand() * 14 - 7, keyRand() * 14 - 7),
      });
    }
  }
  const lid = new THREE.Group();
  lid.position.set(0, 0.12, -0.98);
  const lidShell = new THREE.Mesh(rbox(3.0, 2.0, 0.07, 0.08), alu);
  lidShell.position.y = 1.0;
  const bezel = new THREE.Mesh(rbox(2.92, 1.92, 0.01, 0.06), glass());
  bezel.position.set(0, 1.0, 0.036);
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 768;
  screenCanvas.height = 480;
  const sctx = screenCanvas.getContext('2d');
  const laptopScreen = new THREE.CanvasTexture(screenCanvas);
  laptopScreen.colorSpace = THREE.SRGBColorSpace;
  laptopScreen.anisotropy = 4;
  const display = new THREE.Mesh(new THREE.PlaneGeometry(2.76, 1.72), lit(laptopScreen));
  display.position.set(0, 1.02, 0.043);
  lid.add(lidShell, bezel, display);
  laptop.add(lid);
  scene.add(laptop);

  // Sparks when it crashes.
  const sparks = new THREE.Group();
  const sparkRand = seeded(9);
  const sparkGeo = new THREE.SphereGeometry(0.022, 8, 6);
  const sparkList = Array.from({ length: 40 }, () => {
    const m = new THREE.Mesh(sparkGeo, new THREE.MeshBasicMaterial({ color: '#ffb36b', transparent: true, toneMapped: false }));
    sparks.add(m);
    return {
      m,
      v: V(mix(-2.5, 2.5, sparkRand()), mix(1.5, 4.5, sparkRand()), mix(0.4, 2.8, sparkRand())),
      delay: sparkRand() * 0.25,
    };
  });
  scene.add(sparks);

  // ── People: the audience, who later stand in the shape of the logo ──
  const R = 1.6;
  const logoSpots: THREE.Vector3[] = [];
  [R - 0.2, R, R + 0.2].forEach((radius) => {
    const count = Math.round((radius * 4.608) / 0.205);
    for (let i = 0; i < count; i += 1) {
      const d = ((48 + (i / (count - 1)) * 264) * Math.PI) / 180;
      logoSpots.push(V(Math.cos(d) * radius, 0, Math.sin(d) * radius));
    }
  });
  const crowdRand = seeded(3);
  const people = logoSpots.map((target, i) => {
    let start: THREE.Vector3;
    do {
      start = V(mix(-3.4, 5.6, crowdRand()), 0, mix(0.7, 4.2, crowdRand()));
    } while (start.distanceTo(V(1.8, 0, 0.4)) < 1.1);
    return { start, target, delay: (i % 14) * 0.016, tone: mix(0.55, 1, crowdRand()), lean: crowdRand() * 0.6 - 0.3 };
  });
  const bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0.05, transparent: true });
  const headMat = new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0.05, transparent: true });
  const bodies = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.065, 0.15, 6, 14), bodyMat, people.length);
  const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.056, 18, 12), headMat, people.length);
  people.forEach((person, i) => {
    const c = new THREE.Color().setScalar(person.tone);
    bodies.setColorAt(i, c);
    heads.setColorAt(i, c);
  });
  bodies.castShadow = true;
  heads.castShadow = true;
  const crowd = new THREE.Group();
  crowd.add(bodies, heads);
  scene.add(crowd);

  // ── "You": an empty, lit spot waiting for the reader ──
  const you = new THREE.Group();
  you.position.set(2.9, 0, 1.0);
  you.scale.setScalar(1.45);
  const spotRing = new THREE.Mesh(
    new THREE.RingGeometry(0.32, 0.37, 64),
    new THREE.MeshBasicMaterial({ color: SAFFRON, transparent: true, toneMapped: false }),
  );
  spotRing.rotation.x = -Math.PI / 2;
  spotRing.position.y = 0.004;
  const discMat = new THREE.MeshBasicMaterial({ color: SAFFRON, transparent: true, depthWrite: false });
  discMat.userData.base = 0.16;
  const spotDisc = new THREE.Mesh(new THREE.CircleGeometry(0.32, 64), discMat);
  spotDisc.rotation.x = -Math.PI / 2;
  spotDisc.position.y = 0.003;
  const beamGeo = new THREE.CylinderGeometry(0.06, 0.4, 5, 48, 1, true);
  beamGeo.translate(0, 2.5, 0);
  const beamMat = new THREE.MeshBasicMaterial({ color: '#ffb36b', transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false });
  beamMat.userData.base = 0.1;
  const beam = new THREE.Mesh(beamGeo, beamMat);
  const ghostMat = new THREE.MeshStandardMaterial({ color: SAFFRON, emissive: SAFFRON, emissiveIntensity: 0.4, transparent: true, roughness: 0.4 });
  ghostMat.userData.base = 0.5;
  const ghostBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.24, 6, 14), ghostMat);
  const ghostHead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 18, 12), ghostMat);
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 256;
  labelCanvas.height = 128;
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  const labelMat = new THREE.SpriteMaterial({ map: labelTexture, transparent: true, depthWrite: false, fog: false });
  const label = new THREE.Sprite(labelMat);
  label.scale.set(0.7, 0.35, 1);
  label.position.y = 0.95;
  you.add(spotDisc, spotRing, beam, ghostBody, ghostHead, label);
  scene.add(you);

  // Everything solid casts a shadow.
  [gadgets, laptop].forEach((obj) =>
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) child.castShadow = true;
    }),
  );
  display.castShadow = false;

  // ── Theme ──
  const applyTheme = () => {
    const css = getComputedStyle(document.documentElement);
    const ink = new THREE.Color(css.getPropertyValue('--ink').trim() || '#1a1714');
    const cloud = new THREE.Color(css.getPropertyValue('--cloud').trim() || '#f0eee9');
    const dark = document.documentElement.dataset.theme === 'dark';
    bodyMat.color.copy(ink);
    headMat.color.copy(ink);
    fog.color.copy(cloud);
    floorMat.opacity = dark ? 0.45 : 0.18;
    const ctx = labelCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 256, 128);
      ctx.fillStyle = `#${ink.getHexString()}`;
      ctx.font = '800 72px Manrope, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('you', 128, 64);
      labelTexture.needsUpdate = true;
    }
  };
  applyTheme();
  const themeWatch = new MutationObserver(applyTheme);
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

  // ── Where the ball rests after each scene, and how high it hops to get there ──
  const r0 = 0.18;
  const rest = [
    { p: V(0, r0, 0), r: r0 },
    { p: V(-0.25, r0, 0.05), r: r0 },
    { p: V(1.8, 0.122 + r0, 0.0), r: r0 }, // lands on the laptop
    { p: V(1.25, r0, 1.35), r: r0 }, // thrown off onto the floor
    { p: V(2.75, 0.122 + r0, 0.05), r: r0 }, // back on the laptop
    { p: V(2.75, 0.122 + r0, 0.05), r: r0 },
    { p: V(R, 0.46, 0), r: 0.46 }, // the dot of the logo
    { p: V(R, 0.46, 0), r: 0.46 },
  ];
  const hops = [0, 0, 1.7, 0.9, 1.1, 0, 1.3, 0];

  // ── Shots: where the camera is and what it looks at ──
  type Shot = { pos: THREE.Vector3; at: THREE.Vector3; roll?: number };
  const shots: Shot[] = [
    { pos: V(0, 0.42, 1.9), at: V(0, 0.22, 0) }, // close on the ball
    { pos: V(-1.9, 0.3, 4.6), at: V(0.6, 1.2, -0.6) }, // low, looking up at the stream
    { pos: V(-0.2, 1.6, 5.6), at: V(1.2, 0.55, -0.4) }, // follow the jump
    { pos: V(4.2, 1.05, 3.6), at: V(1.7, 0.6, -0.3), roll: -0.07 }, // tilted: the crash
    { pos: V(1.9, 1.7, 4.3), at: V(1.8, 0.65, -0.4) }, // level: it works
    { pos: V(0.4, 3.9, 8.6), at: V(1.3, 0.3, 0.6) }, // wide: the audience
    { pos: V(0.25, 10.6, 0.9), at: V(0.25, 0, 0) }, // crane up: overhead
    { pos: V(0.6, 4.6, 8.2), at: V(1.4, 0.3, 0.6) }, // down to the reader's spot
  ];
  const firstShot: Shot = { pos: V(0, 0.9, 3.4), at: V(0, 0.4, 0) };

  let fit = 1;
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // The shots are framed for a wide screen; on narrow ones pull back.
    fit = Math.max(1, 2.1 / camera.aspect) ** 0.9;
  };
  resize();
  const resizeWatch = new ResizeObserver(resize);
  resizeWatch.observe(canvas);

  let progress = 0;
  let screenState: ScreenState | null = null;
  const pos = new THREE.Vector3();
  const at = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const zAxis = V(0, 0, 1);
  const scl = new THREE.Vector3();
  const place = new THREE.Vector3();

  const render = (time: number) => {
    const p = progress;
    const k = Math.min(N - 1, Math.floor(p));
    const local = clamp(p - k);
    const a = (i: number) => ease(clamp(clamp(p - i) / 0.55));
    const s = (i: number) => clamp(p - i);
    const span = (from: number, to: number) => {
      if (p < from || (p >= to + 1 && to !== N - 1)) return 0;
      const fadeIn = from === 0 ? 1 : clamp((p - from) / 0.12);
      const fadeOut = to === N - 1 ? 1 : clamp((to + 1 - p) / 0.1);
      return Math.min(fadeIn, fadeOut);
    };
    const t = clamp(local / 0.45);

    // ── Ball ──
    const to = rest[k];
    const from = rest[Math.max(0, k - 1)];
    let r = mix(from.r, to.r, ease(t));
    let squash = 1;
    let grounded = false;
    if (k === 0) {
      // Drops into the light and bounces to a stop.
      const drop = clamp(local / 0.5);
      pos.set(0, mix(3.2, r0, bounce(drop)), 0);
      grounded = drop > 0.3;
      if (drop > 0.3 && drop < 1) squash = 1 - Math.max(0, Math.cos(drop * Math.PI * 7)) * 0.2 * (1 - drop);
    } else if (k === 3) {
      // Thrown off the laptop, bouncing across the floor.
      pos.lerpVectors(from.p, to.p, ease(t));
      pos.y = mix(from.p.y, to.p.y, bounce(t)) + (t < 0.38 ? Math.sin(Math.PI * Math.min(1, t * 2.6)) * hops[k] : 0);
      grounded = t > 0.38;
      if (t > 0.38 && t < 1) squash = 1 - Math.max(0, Math.cos(t * Math.PI * 6)) * 0.22 * (1 - t);
    } else {
      pos.lerpVectors(from.p, to.p, ease(t));
      pos.y += Math.sin(Math.PI * t) * hops[k];
      if (hops[k] > 0 && t > 0.05 && t < 0.9) squash = 1 + Math.sin(Math.PI * t) * 0.16; // stretch in the air
      if (hops[k] > 0 && t >= 0.9 && t < 1) squash = 0.84; // land
    }
    if (k === 1) {
      // Little nervous hops while everything rushes past.
      pos.y += Math.abs(Math.sin(time * 5)) * 0.05 * a(1);
      pos.x += Math.sin(local * 40) * 0.012;
    }
    if (k === 7) r *= 1 + Math.sin(time * 2.4) * 0.03;
    hero.position.copy(pos);
    if (grounded && squash < 1) hero.position.y -= r * (1 - squash);
    hero.scale.set(r / Math.sqrt(squash), r * squash, r / Math.sqrt(squash));
    heroMat.emissiveIntensity = k === 6 ? mix(0.12, 0.7, range(local, 0.55, 0.8)) : k === 7 ? 0.7 : 0.12;
    glow.position.copy(hero.position);
    glow.scale.setScalar(r * (k >= 6 ? 7 : 4.5));
    glowMat.opacity = k >= 6 ? 0.9 : 0.55;

    // ── Gadgets ──
    fade(gadgets, Math.max(span(1, 1), span(2, 2) * 0.35));
    if (gadgets.visible) {
      const travel = (s(1) + s(2) * 0.5) * 20;
      flying.forEach((o) => {
        o.item.position.set(o.x0 - travel * o.speed, o.y + Math.sin(time * 0.9 + o.x0) * 0.08, o.z);
        const spinT = time * 0.6 + travel * 0.15;
        o.item.rotation.set(o.spin.x * spinT, o.spin.y * spinT, o.spin.z * spinT);
        const props = o.item.userData.props as THREE.Mesh[] | undefined;
        props?.forEach((prop, j) => (prop.rotation.y = time * 40 + j));
      });
    }

    // ── Laptop ──
    const laptopFade = k < 2 ? 0 : k <= 5 ? clamp((p - 2) / 0.12) : k === 6 ? 1 - range(local, 0.12, 0.32) : 0;
    fade(laptop, laptopFade);
    if (laptop.visible) {
      // It opens as the ball lands, and closes before the crowd moves in.
      const open = k === 2 ? ease(range(local, 0.3, 0.62)) : k === 6 ? 1 - ease(range(local, 0, 0.18)) : 1;
      lid.rotation.x = mix(Math.PI / 2 - 0.02, -0.24, open);
      laptop.position.copy(LP);
      laptop.rotation.set(0, 0, 0);
      if (k === 3 && local > 0.1 && local < 0.4) {
        const amp = 0.05 * (1 - range(local, 0.1, 0.4));
        laptop.position.x += Math.sin(time * 90) * amp;
        laptop.rotation.z = Math.cos(time * 70) * amp * 0.4;
      }
      keys.forEach((key) => {
        if (!key.flies) return;
        let tt = 0;
        if (k === 3) tt = range(local, 0.12, 0.55);
        else if (k === 4) tt = 1 - ease(range(local, 0, 0.35)); // the keys fly back into place
        if (tt <= 0) {
          key.mesh.position.copy(key.home);
          key.mesh.rotation.set(0, 0, 0);
          return;
        }
        const tf = tt * 0.62;
        const y = key.home.y + key.v.y * tf - 4.5 * tf * tf;
        key.mesh.position.set(key.home.x + key.v.x * tf, Math.max(0.025, y), key.home.z + key.v.z * tf);
        key.mesh.rotation.set(key.spin.x * tf, key.spin.y * tf, key.spin.z * tf);
      });

      let state: ScreenState = 'off';
      let f = 0;
      if (k === 2) {
        state = open > 0.95 ? 'boot' : 'off';
        f = range(local, 0.6, 0.85);
      } else if (k === 3) {
        state = 'error';
        f = a(3);
      } else if (k === 4) {
        state = 'fixed';
        f = a(4);
      } else if (k >= 5) {
        state = 'video';
        f = k === 5 ? a(5) : 1;
      }
      if (sctx && (state !== screenState || state !== 'off')) {
        drawScreen(sctx, state, f, time);
        laptopScreen.needsUpdate = true;
        screenState = state;
      }
    }

    // ── Sparks ──
    const sparking = k === 3 ? range(local, 0.1, 0.6) : 0;
    sparks.visible = sparking > 0 && sparking < 1;
    if (sparks.visible) {
      sparkList.forEach((spark) => {
        const st = clamp((sparking - spark.delay) / 0.6);
        const tf = st * 0.7;
        spark.m.position.set(LP.x + spark.v.x * tf * 0.6, 0.5 + spark.v.y * tf - 4.9 * tf * tf, LP.z - 0.4 + spark.v.z * tf * 0.6);
        spark.m.visible = st > 0 && st < 1 && spark.m.position.y > 0;
        (spark.m.material as THREE.MeshBasicMaterial).opacity = 1 - st;
      });
    }

    // ── Crowd ──
    fade(crowd, span(5, 7));
    if (crowd.visible) {
      people.forEach((person, i) => {
        let grow = 1;
        let walk = 0;
        if (k === 5) grow = ease(clamp(a(5) * 3 - (i % 9) * 0.2));
        if (k === 6) walk = ease(range(local, 0.06 + person.delay, 0.5 + person.delay));
        if (k === 7) walk = 1;
        place.lerpVectors(person.start, person.target, walk);
        const moving = walk > 0 && walk < 1;
        const step = moving ? Math.abs(Math.sin(time * 11 + i)) * 0.045 : 0;
        const g = Math.max(0.001, grow);
        q.setFromAxisAngle(zAxis, moving ? Math.sin(time * 11 + i) * 0.08 : person.lean * 0.1);
        scl.set(1, g * (1 + Math.sin(time * 2 + i) * 0.012), 1);
        m4.compose(tmp.set(place.x, 0.14 * g + step, place.z), q, scl);
        bodies.setMatrixAt(i, m4);
        scl.set(1, g, 1);
        m4.compose(tmp.set(place.x, 0.335 * g + step, place.z), q, scl);
        heads.setMatrixAt(i, m4);
      });
      bodies.instanceMatrix.needsUpdate = true;
      heads.instanceMatrix.needsUpdate = true;
    }

    // ── You ──
    fade(you, span(7, 7) * range(a(7), 0.15, 0.6));
    if (you.visible) {
      spotRing.scale.setScalar(1 + Math.sin(time * 3) * 0.06);
      const float = Math.sin(time * 2) * 0.02;
      ghostBody.position.y = 0.23 + float;
      ghostHead.position.y = 0.52 + float;
      labelMat.opacity = range(a(7), 0.5, 1);
    }

    // ── Camera ──
    const prev = k === 0 ? firstShot : shots[k - 1];
    const next = shots[k];
    let e = ease(t);
    if (k === 0) e = ease(range(local, 0, 0.9));
    if (k === 6) e = ease(range(local, 0.05, 0.7)); // a slow crane up over the crowd
    pos.lerpVectors(prev.pos, next.pos, e);
    at.lerpVectors(prev.at, next.at, e);
    if (k === 6) pos.y += Math.sin(Math.PI * e) * 1.5;
    tmp.subVectors(pos, at).multiplyScalar(fit);
    pos.copy(at).add(tmp);
    pos.x += Math.sin(time * 0.37) * 0.04 * fit;
    pos.y += Math.sin(time * 0.29 + 1) * 0.03 * fit;
    if (k === 3 && local > 0.1 && local < 0.4) {
      const amp = 0.07 * (1 - range(local, 0.1, 0.4));
      pos.x += Math.sin(time * 97) * amp;
      pos.y += Math.cos(time * 89) * amp;
    }
    camera.position.copy(pos);
    camera.lookAt(at);
    camera.rotateZ(mix(prev.roll ?? 0, next.roll ?? 0, e));
    fog.near = camera.position.distanceTo(at) + 3;
    fog.far = fog.near + 22;

    renderer.render(scene, camera);
  };

  // Run only while the film is on screen.
  let frame = 0;
  let running = false;
  const loop = (now: number) => {
    frame = window.requestAnimationFrame(loop);
    render(now / 1000);
  };
  const start = () => {
    if (running) return;
    running = true;
    frame = window.requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    window.cancelAnimationFrame(frame);
  };
  const seen = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()));
  seen.observe(canvas);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);
  render(0);

  return {
    setProgress(p: number) {
      progress = p;
    },
    dispose() {
      stop();
      seen.disconnect();
      resizeWatch.disconnect();
      themeWatch.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      });
      [glowTexture, labelTexture, screenTexture, laptopScreen, envTexture].forEach((tex) => tex.dispose());
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
