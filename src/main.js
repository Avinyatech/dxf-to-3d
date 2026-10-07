import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { parseDxf } from './pipeline.js';
import { toOpenSCAD } from './openscad.js';

const $ = (id) => document.getElementById(id);
const view = $('view');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
view.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
camera.up.set(0, 0, 1);
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff, 0x444455, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 1.4);
sun.position.set(1, -2, 3);
scene.add(sun);
const grid = new THREE.GridHelper(1000, 50, 0x888888, 0xbbbbbb);
grid.rotation.x = Math.PI / 2;
scene.add(grid);

let model = null, data = null;
const material = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.2, roughness: 0.5, side: THREE.DoubleSide });

function resize() {
  const { clientWidth: w, clientHeight: h } = view;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();
(function loop() { requestAnimationFrame(loop); controls.update(); renderer.render(scene, camera); })();

const v2 = (p) => new THREE.Vector2(p.x, p.y);

function build() {
  if (!data) return;
  if (model) { scene.remove(model); model.traverse((o) => o.geometry?.dispose()); }
  const depth = +$('depth').value, scale = Math.max(+$('scale').value || 1, 1e-6);
  const group = new THREE.Group();
  for (const p of data.profiles) {
    const shape = new THREE.Shape(p.outer.map(v2));
    p.holes.forEach((h) => shape.holes.push(new THREE.Path(h.map(v2))));
    group.add(new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 }), material));
  }
  group.scale.set(scale, scale, scale);
  model = group;
  scene.add(model);
  material.wireframe = $('wire').checked;
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  grid.scale.setScalar(Math.max(size / 500, 0.01));
  grid.position.z = box.min.z;
  const c = box.getCenter(new THREE.Vector3());
  controls.target.copy(c);
  camera.position.copy(c).add(new THREE.Vector3(size * 0.6, -size * 0.9, size * 0.7));
  camera.far = size * 20;
  camera.updateProjectionMatrix();
  const b = data.bounds;
  $('stats').textContent = `${data.entityCount} entities → ${data.loops.length} closed loops, ${data.profiles.length} solid profile(s). Footprint ${(b.w * scale).toFixed(2)} × ${(b.h * scale).toFixed(2)}.` + (data.skipped ? ` ${data.skipped} unsupported entities skipped.` : '');
  updateCode();
  ['stl', 'obj', 'scad'].forEach((id) => ($(id).disabled = false));
}

function updateCode() {
  if (data) $('code').value = toOpenSCAD(data.profiles, { depth: +$('depth').value, scale: +$('scale').value || 1 });
}

function load(text) {
  try {
    data = parseDxf(text);
    if (!data.profiles.length) throw new Error('No closed profiles found. Shapes must be closed polylines, circles, or connected lines/arcs.');
    build();
  } catch (e) { $('stats').textContent = 'Error: ' + e.message; }
}

function save(name, content) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

$('file').addEventListener('change', (e) => e.target.files[0]?.text().then(load));
$('sample').addEventListener('click', () => fetch(import.meta.env.BASE_URL + 'sample.dxf').then((r) => r.text()).then(load));
$('depth').addEventListener('input', () => { $('depthOut').textContent = $('depth').value; build(); });
$('scale').addEventListener('input', build);
$('wire').addEventListener('change', () => { material.wireframe = $('wire').checked; });
$('stl').addEventListener('click', () => { model.updateMatrixWorld(true); save('model.stl', new STLExporter().parse(model)); });
$('obj').addEventListener('click', () => { model.updateMatrixWorld(true); save('model.obj', new OBJExporter().parse(model)); });
$('scad').addEventListener('click', () => save('model.scad', $('code').value));
const drop = $('drop');
['dragover', 'dragenter'].forEach((t) => addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((t) => addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
addEventListener('drop', (e) => e.dataTransfer.files[0]?.text().then(load));
