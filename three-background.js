import * as THREE from 'https://cdn.skypack.dev/three';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('threeCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 2;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

let currentModel;

function loadModelForGenre(genreKey) {
  const modelPaths = {
    pop: 'model_1.glb',
    sad: 'model_2.glb',
    lofi: 'model_3.glb',
    electronic: 'model_4.glb',
  };

  const modelPath = modelPaths[genreKey];
  if (!modelPath) return;

  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    if (currentModel) {
      scene.remove(currentModel);
    }
    currentModel = gltf.scene;
    currentModel.scale.set(1, 1, 1);
    scene.add(currentModel);
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (currentModel) currentModel.rotation.y += 0.005;
  renderer.render(scene, camera);
}

animate();

// Expose globally for script.js to call
window.loadModelForGenre = loadModelForGenre;

loadModelForGenre('pop');
