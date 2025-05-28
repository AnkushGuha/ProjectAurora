import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('threeCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50, // Slightly narrower FOV for better control
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 3.5;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

let currentModel;

function loadModelForGenre(genreKey) {
  const modelPaths = {
    pop: 'model_1.glb',
    rock: 'model_2.glb',
    country: 'model_3.glb',
    jazz: 'model_4.glb',
    electronic: 'model_5.glb',
    custom: 'model_6.glb',
  };

  const modelPath = modelPaths[genreKey];
  if (!modelPath) return;

  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    if (currentModel) scene.remove(currentModel);

    currentModel = gltf.scene;

    // Center and scale the model responsively
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = getResponsiveScaleFactor(size);

    currentModel.position.sub(center);
    currentModel.scale.setScalar(scaleFactor);

    scene.add(currentModel);
  }, undefined, (err) => {
    console.error(`❌ Failed to load ${modelPath}`, err);
  });
}

// Dynamically scale based on model size and screen
function getResponsiveScaleFactor(size) {
  const base = Math.min(window.innerWidth, window.innerHeight);
  const targetSize = base < 600 ? 1.2 : 1.8; // smaller on phones
  return targetSize / size;
}

// Animate
function animate() {
  requestAnimationFrame(animate);
  if (currentModel) currentModel.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

// Resize handler for full responsiveness
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Re-scale model on resize
  if (currentModel) {
    const box = new THREE.Box3().setFromObject(currentModel);
    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = getResponsiveScaleFactor(size);
    currentModel.scale.setScalar(scaleFactor);
  }
});

// Global exposure
window.loadModelForGenre = loadModelForGenre;
loadModelForGenre("pop"); // change this to whichever genre you want

// Don't load any model initially
