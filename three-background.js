import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('threeCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
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
  if (!modelPath) {
    console.warn(`No model found for genre: ${genreKey}`);
    return;
  }

  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    // Remove and dispose of previous model
    if (currentModel) {
      scene.remove(currentModel);
      currentModel.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }

    currentModel = gltf.scene;

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = Math.min(1.8, Math.max(1, 1.8 / size));

    currentModel.position.sub(center);
    currentModel.scale.setScalar(scaleFactor);

    scene.add(currentModel);
  }, undefined, (err) => {
    console.error(`Failed to load model for ${genreKey}`, err);
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (currentModel) currentModel.rotation.y += 0.005;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (currentModel) {
    const box = new THREE.Box3().setFromObject(currentModel);
    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = Math.min(1.8, Math.max(1, 1.8 / size));
    currentModel.scale.setScalar(scaleFactor);
  }
});

// Make function callable from other scripts
window.loadModelForGenre = loadModelForGenre;

// Optional: Uncomment if you want a model to load immediately
// loadModelForGenre("pop");
