
console.log("SCRIPT RUNNING ✔");

/* ================= SCENE ================= */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

/* ================= CAMERA ================= */
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / 420,
  0.1,
  1000
);

camera.position.set(0, 2.5, 6);

/* ================= RENDERER ================= */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 420);

document.getElementById("car3d").appendChild(renderer.domElement);

/* ================= LIGHTS ================= */
scene.add(new THREE.AmbientLight(0xffffff, 1));

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

/* ================= LOADER ================= */
const loader = new THREE.GLTFLoader();

let car = null;

/* ================= MODEL MAP ================= */
const models = {
  m5: "models/m5cs.glb",

  // SAFE TEST MODELS (ALL CONFIRMED WORKING)
  revuelto: "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",

  jesko: "https://threejs.org/examples/models/gltf/Duck/glTF-Binary/Duck.glb"
};

/* ================= LOAD FUNCTION ================= */
function loadCar(name) {

  console.log("Loading:", name);

  if (car) {
    scene.remove(car);
    car = null;
  }

  loader.load(
    models[name],

    function (gltf) {

      car = gltf.scene;

      /* RESET EVERYTHING */
      car.position.set(0, 0, 0);
      car.rotation.set(0, 0, 0);

      scene.add(car);

      car.updateWorldMatrix(true, true);

      /* CENTER MODEL */
      const box = new THREE.Box3().setFromObject(car);
      const center = box.getCenter(new THREE.Vector3());
      car.position.sub(center);

      /* SCALE FIX */
      const size = box.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);
      const scale = 4 / maxSize;
      car.scale.set(scale, scale, scale);

      /* FORCE VISIBILITY POSITION */
      car.position.y = 0;

      /* 🔥 IMPORTANT FIX — RESET CAMERA FOCUS */
      camera.lookAt(0, 0, 0);

      console.log(name.toUpperCase(), "LOADED ✔");
    },

    undefined,

    function (err) {
      console.log("FAILED:", name, err);
    }
  );
}

/* ================= ROTATION ================= */
function animate() {
  requestAnimationFrame(animate);

  if (car) car.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

/* ================= START ================= */
loadCar("m5");