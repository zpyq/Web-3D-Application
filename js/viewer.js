// Get model container
const container = document.querySelector('.model');
if (!container) {
    throw new Error("Container not found");
}

// Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);

camera.position.set(0, 1.2, 6); // Set initial camera position
scene.add(camera); // Add camera to the scene

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight); // Set canvas site
renderer.setPixelRatio(window.devicePixelRatio); // Set pixel ratio
renderer.outputEncoding = THREE.sRGBEncoding; // Set color output encoding
container.appendChild(renderer.domElement); // Append renderer canvas to container

// Set up lights
const lights = [];
// Ambient Light
lights.push(new THREE.AmbientLight(0xffffff, 0.6));

// Sunlight
const sun = new THREE.DirectionalLight(0xfff0df, 1);
sun.position.set(10, 20, 10);
lights.push(sun);

// Hemisphere light
const hemisphere = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
lights.push(hemisphere);

// Left Point Light
const leftPointLight = new THREE.PointLight(0xffffff, 1);
leftPointLight.position.set(-5, 3, 5);
lights.push(leftPointLight);

// Side Light
const sideLight = new THREE.DirectionalLight(0xffffff, 0.8);
sideLight.position.set(3, 2, 2);
lights.push(sideLight);

// Front light
const frontLight = new THREE.DirectionalLight(0xffffff, 0.6);
frontLight.position.set(0, 1.2, 6); 
lights.push(frontLight);

// Add all lights to the scene
lights.forEach(light => scene.add(light));

// Create OrbitControls, users can rotate and zoom the model with the mouse
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; //Enable smooth camera rotation
controls.enablePan = false; //Disable camera panning

// Reference: https://threejs.org/docs/?q=orbit#examples/en/controls/OrbitControls
// https://github.com/multi2mech/AR-simply-supported-beam-edu/blob/be319a4387244378d244e447a414d0da22245aeb/docs/index_old#L102
// Function that controls the animation loop
function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(0.016); // Update mixer when initialized
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Reference: https://github.com/adatechschool/projet-dataviz-api-planete-tech/blob/9bf1da9ddea4f170a8727bd0a631e5f8c9661b83/Three/app.js#L18
// Adjust camera and renderer when window resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight; 
    camera.updateProjectionMatrix(); 
    renderer.setSize(container.clientWidth, container.clientHeight); 
});