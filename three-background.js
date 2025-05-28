import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';

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
    rock: 'model_2.glb',
    country: 'model_3.glb',
    jazz: 'model_4.glb',
    electronic: 'model_1.glb',
    custom: 'model_2.glb', // model used for user-uploaded tracks
  };

  const modelPath = modelPaths[genreKey];
  if (!modelPath) return;

  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    if (currentModel) {
      scene.remove(currentModel);
    }

    currentModel = gltf.scene;

    // Center the model
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    currentModel.position.sub(center);

    // Scale to fit view
    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = 2 / size;
    currentModel.scale.setScalar(scaleFactor);

    scene.add(currentModel);
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (currentModel) currentModel.rotation.y += 0.005;
  renderer.render(scene, camera);
}

animate();

// Make model loading available to script.js
window.loadModelForGenre = loadModelForGenre;

// ✅ No initial model is loaded — waits for user to select genre or play custom track
