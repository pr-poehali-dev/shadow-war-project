import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface Bot {
  id: number;
  name: string;
  color: string;
  hp: number;
  mesh: THREE.Group;
  speed: number;
  state: "patrol" | "chase" | "cover";
  patrolTarget: THREE.Vector3;
  shootCooldown: number;
}

interface Props {
  mapId: number;
  botLevel: string;
  weaponSkinUrl: string;
  onKill: (botName: string) => void;
  onHit: (dmg: number) => void;
  onDeath: () => void;
  score: { me: number; bots: number };
  health: number;
  ammo: { current: number; reserve: number };
}

const BOT_ACCURACY: Record<string, number> = {
  novice: 0.15, experienced: 0.35, pro: 0.55, elite: 0.75, custom: 0.4,
};

const MAP_CONFIGS: Record<number, { skyColor: number; floorColor: number; wallColor: number; fogDensity: number; wallLayout: number[][] }> = {
  1: { skyColor: 0x0a0a15, floorColor: 0x1a1a1a, wallColor: 0x2a2a2a, fogDensity: 0.02, wallLayout: [
    [0,0,1,1,0,0,1,0], [0,0,0,0,0,1,0,0], [1,0,0,1,0,0,0,1],
    [0,0,1,0,0,1,0,0], [0,1,0,0,0,0,1,0], [0,0,0,1,0,0,0,0],
    [1,0,0,0,1,0,0,1], [0,0,1,0,0,0,1,0],
  ]},
  2: { skyColor: 0x050510, floorColor: 0x111120, wallColor: 0x1a1a30, fogDensity: 0.025, wallLayout: [
    [1,0,0,1,0,1,0,1], [0,0,1,0,0,0,1,0], [0,1,0,0,1,0,0,1],
    [1,0,0,0,0,1,0,0], [0,0,1,1,0,0,0,1], [0,1,0,0,0,1,0,0],
    [1,0,0,1,0,0,1,0], [0,0,1,0,1,0,0,1],
  ]},
  3: { skyColor: 0x1a0f00, floorColor: 0x2a1500, wallColor: 0x3a2010, fogDensity: 0.015, wallLayout: [
    [0,0,0,1,0,0,0,1], [0,1,0,0,0,1,0,0], [0,0,0,0,1,0,0,0],
    [1,0,0,0,0,0,1,0], [0,0,1,0,0,0,0,1], [0,1,0,0,1,0,0,0],
    [0,0,0,1,0,0,1,0], [1,0,0,0,0,1,0,0],
  ]},
  4: { skyColor: 0x001500, floorColor: 0x050f05, wallColor: 0x0a1a0a, fogDensity: 0.04, wallLayout: [
    [1,1,0,0,1,1,0,0], [1,0,0,1,0,0,1,1], [0,0,1,0,0,1,0,0],
    [0,1,0,1,1,0,0,1], [1,0,0,0,0,0,1,0], [0,1,1,0,0,1,0,0],
    [0,0,0,1,1,0,0,1], [1,1,0,0,0,0,1,0],
  ]},
  5: { skyColor: 0x050510, floorColor: 0x0a0a18, wallColor: 0x151528, fogDensity: 0.03, wallLayout: [
    [0,1,0,1,0,0,1,0], [0,0,0,0,1,0,0,1], [1,0,1,0,0,0,0,0],
    [0,0,0,1,0,1,0,1], [0,1,0,0,0,0,1,0], [1,0,0,0,1,0,0,0],
    [0,0,1,0,0,1,0,1], [0,1,0,0,0,0,1,0],
  ]},
};

export default function FirstPersonGame({
  mapId, botLevel, weaponSkinUrl,
  onKill, onHit, onDeath,
  health, ammo,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number>(0);
  const botsRef = useRef<Bot[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const yawRef = useRef(0);    // horizontal look
  const pitchRef = useRef(0);  // vertical look
  const shootCdRef = useRef(0);
  const flashRef = useRef<THREE.Mesh | null>(null);
  const flashTimerRef = useRef(0);
  const weaponMeshRef = useRef<THREE.Group | null>(null);
  const weaponBobRef = useRef(0);
  const healthRef = useRef(health);
  const ammoRef = useRef(ammo);
  const aliveRef = useRef(true);
  const wallsRef = useRef<THREE.Box3[]>([]);

  // keep refs in sync
  useEffect(() => { healthRef.current = health; }, [health]);
  useEffect(() => { ammoRef.current = ammo; }, [ammo]);

  const cfg = MAP_CONFIGS[mapId] ?? MAP_CONFIGS[1];

  const createBotMesh = useCallback((color: string): THREE.Group => {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.4), bodyMat);
    body.position.y = 0.6;
    const headMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color).multiplyScalar(1.3) });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), headMat);
    head.position.y = 1.4;
    // neon glow ring
    const ringGeo = new THREE.TorusGeometry(0.22, 0.03, 8, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 1.85;
    ring.rotation.x = Math.PI / 2;
    g.add(body, head, ring);
    return g;
  }, []);

  const createWeaponMesh = useCallback((): THREE.Group => {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x00f5ff });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.5), mat);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), mat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = -0.4;
    barrel.position.y = 0.01;
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.05),
      new THREE.MeshLambertMaterial({ color: 0x1a1a2e }));
    grip.position.y = -0.08;
    grip.position.z = 0.05;
    g.add(body, barrel, grip);
    g.position.set(0.22, -0.18, -0.35);
    return g;
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const W = mountRef.current.clientWidth;
    const H = mountRef.current.clientHeight;

    // ── SCENE ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(cfg.skyColor);
    scene.fog = new THREE.FogExp2(cfg.skyColor, cfg.fogDensity);
    sceneRef.current = scene;

    // ── CAMERA ──
    const camera = new THREE.PerspectiveCamera(85, W / H, 0.1, 60);
    camera.position.set(0, 1.7, 0);
    cameraRef.current = camera;

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── LIGHTS ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0x00f5ff, 0.6);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    const pointLight1 = new THREE.PointLight(0x00f5ff, 1.5, 15);
    pointLight1.position.set(0, 3, 0);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xb44fff, 1.2, 12);
    pointLight2.position.set(10, 3, -10);
    scene.add(pointLight2);

    // ── FLOOR ──
    const floorMat = new THREE.MeshLambertMaterial({ color: cfg.floorColor });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor grid lines (neon)
    const gridHelper = new THREE.GridHelper(40, 40, 0x00f5ff, 0x00f5ff);
    (gridHelper.material as THREE.Material).opacity = 0.07;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // ── CEILING ──
    const ceilMat = new THREE.MeshLambertMaterial({ color: cfg.skyColor });
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 4;
    scene.add(ceil);

    // ── BORDER WALLS ──
    const wallMat = new THREE.MeshLambertMaterial({ color: cfg.wallColor });
    const makeWall = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      const box = new THREE.Box3().setFromObject(mesh);
      wallsRef.current.push(box);
    };
    makeWall(40, 4, 0.5, 0, 2, -20);
    makeWall(40, 4, 0.5, 0, 2, 20);
    makeWall(0.5, 4, 40, -20, 2, 0);
    makeWall(0.5, 4, 40, 20, 2, 0);

    // ── INNER WALLS from map layout ──
    const layout = cfg.wallLayout;
    const cellSize = 4;
    const offset = -14;
    layout.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell === 1) {
          const x = offset + cIdx * cellSize;
          const z = offset + rIdx * cellSize;
          makeWall(cellSize - 0.3, 3.5, 0.4, x, 1.75, z);
          // neon trim on top
          const trimMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.4 });
          const trim = new THREE.Mesh(new THREE.BoxGeometry(cellSize - 0.3, 0.05, 0.45), trimMat);
          trim.position.set(x, 3.55, z);
          scene.add(trim);
        }
      });
    });

    // ── DECORATIVE PILLARS + NEON STRIPS ──
    const pillarPositions = [[-8,0,-8],[8,0,-8],[-8,0,8],[8,0,8],[0,0,0],[-14,0,0],[14,0,0],[0,0,-14],[0,0,14]];
    pillarPositions.forEach(([x,,z]) => {
      const pMat = new THREE.MeshLambertMaterial({ color: cfg.wallColor });
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4, 0.6), pMat);
      p.position.set(x, 2, z);
      p.castShadow = true;
      scene.add(p);
      const stripMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.6 });
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 0.62), stripMat);
      strip.position.set(x, 3.9, z);
      scene.add(strip);
      const box = new THREE.Box3().setFromObject(p);
      wallsRef.current.push(box);
    });

    // ── BOTS ──
    const botColors = ["#ff6b35", "#b44fff", "#ffd700"];
    const botNames = ["Bot_Alpha", "Bot_Sigma", "Bot_Omega"];
    const botStartPos = [
      new THREE.Vector3(8, 0, -8),
      new THREE.Vector3(-8, 0, 8),
      new THREE.Vector3(10, 0, 5),
    ];
    const acc = BOT_ACCURACY[botLevel] ?? 0.35;
    const bots: Bot[] = botStartPos.map((pos, i) => {
      const mesh = createBotMesh(botColors[i]);
      mesh.position.copy(pos);
      mesh.position.y = 0;
      scene.add(mesh);
      return {
        id: i + 1,
        name: botNames[i],
        color: botColors[i],
        hp: 100,
        mesh,
        speed: 0.03 + acc * 0.04,
        state: "patrol",
        patrolTarget: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          0,
          (Math.random() - 0.5) * 30,
        ),
        shootCooldown: 0,
      };
    });
    botsRef.current = bots;

    // ── WEAPON ON SCREEN ──
    const weaponGroup = createWeaponMesh();
    camera.add(weaponGroup);
    scene.add(camera);
    weaponMeshRef.current = weaponGroup;

    // ── MUZZLE FLASH ──
    const flashGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffee00, transparent: true, opacity: 0 });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.position.set(0.22, -0.16, -0.7);
    camera.add(flash);
    flashRef.current = flash;

    // ── POINTER LOCK ──
    const canvas = renderer.domElement;
    const onMouseMove = (e: MouseEvent) => {
      if (!aliveRef.current) return;
      yawRef.current -= e.movementX * 0.002;
      pitchRef.current = Math.max(-1.0, Math.min(1.0, pitchRef.current - e.movementY * 0.002));
    };
    canvas.addEventListener("click", () => canvas.requestPointerLock());
    document.addEventListener("mousemove", onMouseMove);

    // ── KEYS ──
    const onKey = (e: KeyboardEvent, down: boolean) => {
      keysRef.current[e.code] = down;
    };
    window.addEventListener("keydown", e => onKey(e, true));
    window.addEventListener("keyup", e => onKey(e, false));

    // ── SHOOT (click) ──
    const onShoot = () => {
      if (!document.pointerLockElement) return;
      if (shootCdRef.current > 0) return;
      if (ammoRef.current.current <= 0) return;
      if (!aliveRef.current) return;
      shootCdRef.current = 12;
      // muzzle flash
      if (flashRef.current) {
        (flashRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
        flashTimerRef.current = 4;
      }
      // weapon bob kick
      weaponBobRef.current = Math.PI;

      // raycasting
      const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const ray = new THREE.Raycaster(camera.position.clone(), dir);
      const aliveB = botsRef.current.filter(b => b.hp > 0);
      if (aliveB.length > 0) {
        const meshes = aliveB.map(b => b.mesh.children).flat();
        const hits = ray.intersectObjects(meshes, false);
        if (hits.length > 0 && hits[0].distance < 25) {
          const hitObj = hits[0].object;
          const hitBot = aliveB.find(b => b.mesh.children.includes(hitObj));
          if (hitBot) {
            const dmg = Math.floor(Math.random() * 25 + 20);
            hitBot.hp = Math.max(0, hitBot.hp - dmg);
            hitBot.state = "chase";
            if (hitBot.hp <= 0) {
              hitBot.mesh.visible = false;
              onKill(hitBot.name);
            }
          }
        }
      }
    };
    canvas.addEventListener("mousedown", onShoot);

    // ── COLLISION ──
    const playerBox = new THREE.Box3();
    const checkCollision = (newPos: THREE.Vector3): boolean => {
      playerBox.setFromCenterAndSize(newPos, new THREE.Vector3(0.5, 1.8, 0.5));
      return wallsRef.current.some(w => w.intersectsBox(playerBox));
    };

    // ── GAME LOOP ──
    const clock = new THREE.Clock();
    let dead = false;

    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);
      const dt = clock.getDelta();

      if (!aliveRef.current) {
        renderer.render(scene, camera);
        return;
      }

      // ── PLAYER MOVEMENT ──
      const speed = 5.5;
      const keys = keysRef.current;
      const fwd = new THREE.Vector3(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current));
      const right = new THREE.Vector3(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current));
      let moved = false;
      const newPos = camera.position.clone();

      if (keys["KeyW"] || keys["ArrowUp"]) { newPos.addScaledVector(fwd, speed * dt); moved = true; }
      if (keys["KeyS"] || keys["ArrowDown"]) { newPos.addScaledVector(fwd, -speed * dt); moved = true; }
      if (keys["KeyA"] || keys["ArrowLeft"]) { newPos.addScaledVector(right, -speed * dt); moved = true; }
      if (keys["KeyD"] || keys["ArrowRight"]) { newPos.addScaledVector(right, speed * dt); moved = true; }

      newPos.x = Math.max(-19, Math.min(19, newPos.x));
      newPos.z = Math.max(-19, Math.min(19, newPos.z));
      if (!checkCollision(newPos)) camera.position.copy(newPos);
      camera.position.y = 1.7;

      // Camera rotation
      camera.rotation.order = "YXZ";
      camera.rotation.y = yawRef.current;
      camera.rotation.x = pitchRef.current;

      // Head bob
      if (moved) {
        weaponBobRef.current += dt * 8;
        if (weaponMeshRef.current) {
          weaponMeshRef.current.position.y = -0.18 + Math.sin(weaponBobRef.current) * 0.012;
          weaponMeshRef.current.position.x = 0.22 + Math.cos(weaponBobRef.current * 0.5) * 0.006;
        }
      }

      // ── SHOOT COOLDOWN ──
      if (shootCdRef.current > 0) shootCdRef.current -= 1;

      // ── MUZZLE FLASH ──
      if (flashTimerRef.current > 0) {
        flashTimerRef.current -= 1;
        if (flashRef.current) {
          (flashRef.current.material as THREE.MeshBasicMaterial).opacity = flashTimerRef.current / 4;
        }
      }

      // ── BOT AI ──
      botsRef.current.forEach(bot => {
        if (bot.hp <= 0) return;

        const distToPlayer = bot.mesh.position.distanceTo(camera.position);

        // State transitions
        if (distToPlayer < 18) bot.state = "chase";
        else if (bot.hp < 30) bot.state = "cover";
        else if (distToPlayer > 22) bot.state = "patrol";

        // Movement
        let target: THREE.Vector3;
        if (bot.state === "chase") {
          target = camera.position.clone();
          target.y = 0;
        } else if (bot.state === "cover") {
          // move away from player
          const away = bot.mesh.position.clone().sub(camera.position).normalize();
          target = bot.mesh.position.clone().addScaledVector(away, 8);
        } else {
          target = bot.patrolTarget.clone();
          if (bot.mesh.position.distanceTo(bot.patrolTarget) < 1.5) {
            bot.patrolTarget.set(
              (Math.random() - 0.5) * 34,
              0,
              (Math.random() - 0.5) * 34,
            );
          }
        }

        const dir = target.clone().sub(bot.mesh.position).normalize();
        const botNewPos = bot.mesh.position.clone().addScaledVector(dir, bot.speed);
        botNewPos.x = Math.max(-18, Math.min(18, botNewPos.x));
        botNewPos.z = Math.max(-18, Math.min(18, botNewPos.z));
        const botBox = new THREE.Box3().setFromCenterAndSize(
          botNewPos.clone().add(new THREE.Vector3(0, 0.9, 0)),
          new THREE.Vector3(0.6, 1.8, 0.6)
        );
        const wallHit = wallsRef.current.some(w => w.intersectsBox(botBox));
        if (!wallHit) bot.mesh.position.copy(botNewPos);

        // Face direction
        if (dir.length() > 0.01) {
          const angle = Math.atan2(dir.x, dir.z);
          bot.mesh.rotation.y = angle;
        }

        // Bot shooting
        bot.shootCooldown = Math.max(0, bot.shootCooldown - 1);
        if (bot.state === "chase" && distToPlayer < 15 && bot.shootCooldown === 0) {
          const hitChance = BOT_ACCURACY[botLevel] ?? 0.35;
          if (Math.random() < hitChance && !dead) {
            const dmg = Math.floor(Math.random() * 18 + 8);
            onHit(dmg);
            if (healthRef.current - dmg <= 0 && !dead) {
              dead = true;
              onDeath();
            }
          }
          bot.shootCooldown = Math.floor(60 / (0.5 + (BOT_ACCURACY[botLevel] ?? 0.35)));
        }
      });

      // ── RENDER ──
      renderer.render(scene, camera);
    };
    loop();

    // ── RESIZE ──
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", e => onKey(e, true));
      window.removeEventListener("keyup", e => onKey(e, false));
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onShoot);
      document.exitPointerLock();
      renderer.dispose();
      if (mountRef.current?.contains(canvas)) {
        mountRef.current.removeChild(canvas);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId, botLevel]);

  return (
    <div ref={mountRef} className="w-full h-full relative" style={{ cursor: "none" }}>
      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative w-5 h-5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2" style={{ background: "rgba(0,245,255,0.9)" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-2" style={{ background: "rgba(0,245,255,0.9)" }} />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-2" style={{ background: "rgba(0,245,255,0.9)" }} />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-2" style={{ background: "rgba(0,245,255,0.9)" }} />
        </div>
      </div>

      {/* Click to play overlay */}
      <div id="click-overlay"
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
        style={{ background: "rgba(7,7,15,0.7)", backdropFilter: "blur(4px)" }}>
        <div className="font-oswald text-2xl font-bold tracking-widest mb-2" style={{ color: "var(--neon-cyan)" }}>
          НАЖМИ ЛЕВОЙ КНОПКОЙ МЫШИ
        </div>
        <p className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          для захвата курсора и входа в бой
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            { key: "W/A/S/D", desc: "Движение" },
            { key: "Мышь", desc: "Обзор / прицел" },
            { key: "ЛКМ", desc: "Стрелять" },
            { key: "Esc", desc: "Пауза" },
            { key: "R (кнопка)", desc: "Перезарядка" },
            { key: "E (кнопка)", desc: "Аптечка" },
          ].map(b => (
            <div key={b.key} className="px-3 py-2 rounded-lg"
              style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.15)" }}>
              <kbd className="font-oswald text-sm font-bold block" style={{ color: "var(--neon-cyan)" }}>{b.key}</kbd>
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{b.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
