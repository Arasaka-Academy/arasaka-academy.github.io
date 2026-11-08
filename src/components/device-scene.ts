import * as THREE from 'three';

export interface DeviceScene {
  setProgress(progress: number): void;
  setActive(active: boolean): void;
  dispose(): void;
}

export function mountDeviceScene(target: HTMLElement, onFailure: () => void): DeviceScene {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.7;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  target.append(renderer.domElement);
  const world = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(6.5, 4.5, 8.2);
  camera.lookAt(0, -0.2, 0);
  world.add(new THREE.AmbientLight(0xe4d7cf, 2.0));
  const keyLight = new THREE.DirectionalLight(0xffece1, 6);
  keyLight.position.set(-3, 7, 5);
  world.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xf34b3c, 5);
  rimLight.position.set(4, 1, -3);
  world.add(rimLight);
  const fillLight = new THREE.DirectionalLight(0x95d7db, 1.1);
  fillLight.position.set(-5, 2, -2);
  world.add(fillLight);

  const installation = new THREE.Group();
  world.add(installation);
  const machine = new THREE.Group();
  installation.add(machine);
  const shell = new THREE.MeshStandardMaterial({ color: 0x29282a, roughness: 0.32, metalness: 0.82 });
  const plate = new THREE.MeshStandardMaterial({ color: 0x4b4747, roughness: 0.38, metalness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.7, metalness: 0.4 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xb3aaa3, roughness: 0.25, metalness: 0.9 });
  const red = new THREE.MeshBasicMaterial({ color: 0xee6255, toneMapped: false });
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x82615c, transparent: true, opacity: 0.58 });

  const addBox = (width: number, height: number, depth: number, material: THREE.Material, position: [number, number, number], group = machine) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(...position);
    group.add(mesh);
    return mesh;
  };
  const body = addBox(2.1, 2.95, 2.12, shell, [0, 0, 0]);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), lineMaterial);
  machine.add(edges);
  addBox(2.22, 0.12, 2.25, plate, [0, 1.51, 0]);
  addBox(2.22, 0.12, 2.25, plate, [0, -1.51, 0]);
  addBox(1.91, 2.75, 0.07, dark, [0, 0, 1.095]);
  for (let slotIndex = 0; slotIndex < 5; slotIndex += 1) {
    const height = 1.06 - slotIndex * 0.52;
    addBox(1.72, 0.42, 0.15, plate, [0, height, 1.16]);
    addBox(1.51, 0.29, 0.03, dark, [-0.03, height, 1.25]);
    addBox(0.045, 0.22, 0.04, red, [0.74, height, 1.28]);
    addBox(0.38, 0.032, 0.04, silver, [-0.43, height, 1.285]);
    for (let ventIndex = 0; ventIndex < 7; ventIndex += 1) addBox(0.025, 0.17, 0.025, shell, [ventIndex * 0.07 - 0.05, height, 1.28]);
  }
  for (let ventIndex = 0; ventIndex < 14; ventIndex += 1) {
    addBox(0.04, 0.047, 1.7, dark, [1.07, 1.2 - ventIndex * 0.17, 0]);
    addBox(0.04, 0.047, 1.7, dark, [-1.07, 1.2 - ventIndex * 0.17, 0]);
  }
  for (const horizontal of [-1, 1]) {
    for (const depth of [-1, 1]) {
      addBox(0.045, 2.98, 0.045, red, [horizontal * 1.065, 0, depth * 1.075]);
      addBox(0.22, 0.14, 0.22, dark, [horizontal * 0.83, -1.65, depth * 0.83]);
    }
  }
  for (const radius of [0.47, 0.61, 0.73]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 6, 56), radius === 0.73 ? red : dark);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 1.58, 0);
    machine.add(ring);
  }
  for (let railIndex = -3; railIndex <= 3; railIndex += 1) addBox(0.055, 0.025, 1.18, dark, [railIndex * 0.17, 1.59, 0]);
  const base = new THREE.Group();
  installation.add(base);
  for (const radius of [1.9, 2.35, 2.65]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, radius === 2.35 ? 0.014 : 0.006, 4, 100), radius === 2.35 ? red : plate);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -2.03;
    base.add(ring);
  }
  const points: [number, number, number][] = [[-2.8, 0.7, 0], [2.5, 1.2, -0.2], [2.6, -0.8, 0.8], [-2.6, -1.0, 0.9]];
  for (const [index, point] of points.entries()) {
    const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.09), index === 0 ? silver : red);
    node.position.set(...point);
    installation.add(node);
    const vertices = [new THREE.Vector3(...point), new THREE.Vector3(point[0] * 0.7, point[1], point[2]), new THREE.Vector3(Math.sign(point[0]) * 1.12, point[1] * 0.7, point[2])];
    installation.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vertices), new THREE.LineBasicMaterial({ color: 0xc45247, transparent: true, opacity: 0.48 })));
  }

  let active = false;
  let disposed = false;
  let frame = 0;
  let progress = 0;
  const pointer = new THREE.Vector2();
  const render = () => {
    frame = 0;
    if (!active || disposed) return;
    const targetX = pointer.y * 0.055 + progress * 0.12;
    const targetY = pointer.x * 0.12 - 0.12 + progress * 0.18;
    installation.rotation.x = THREE.MathUtils.lerp(installation.rotation.x, targetX, 0.07);
    installation.rotation.y = THREE.MathUtils.lerp(installation.rotation.y, targetY, 0.07);
    renderer.render(world, camera);
    if (Math.abs(installation.rotation.x - targetX) + Math.abs(installation.rotation.y - targetY) > 0.0002) frame = requestAnimationFrame(render);
  };
  const requestRender = () => { if (active && !frame && !disposed) frame = requestAnimationFrame(render); };
  const resize = () => {
    const width = target.clientWidth;
    const height = target.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestRender();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(target);
  const onPointerMove = (event: PointerEvent) => {
    const bounds = target.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
    requestRender();
  };
  const onPointerLeave = () => { pointer.set(0, 0); requestRender(); };
  const onContextLost = (event: Event) => { event.preventDefault(); onFailure(); };
  target.addEventListener('pointermove', onPointerMove);
  target.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  resize();
  renderer.render(world, camera);

  return {
    setProgress(value) { progress = THREE.MathUtils.clamp(value, 0, 1); requestRender(); },
    setActive(value) {
      active = value;
      if (active) requestRender();
      else { cancelAnimationFrame(frame); frame = 0; }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      world.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          geometries.add(object.geometry);
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
