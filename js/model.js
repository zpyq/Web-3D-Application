let currentModel = null; // Currently loaded model in the scene
let mixer = null; // Animation mixer for GLTF animations
let actions = {}; // Store all animation clips

// Later used to check if it's the wine bottle page, then set the materials
const page = window.location.pathname.split('/').pop();
const isWineBottle = page === 'item2.html';

// Paths for different models
let modelPath = '';
let crushModelPath = '';
let recycleModelPath = '';
let breakModelPath = '';

// Clip names
let openClip = '';
let crushClip = '';
let recycleClip = '';
let topBreakClip = '';
let bottomBreakClip = ''; 

// Sounds
const openCanSound = new Audio('music/openCanSound.mp3');
const crushCanSound = new Audio('music/crushCanSound.mp3');
const recycleCanSound = new Audio('music/crushCanSound.mp3');

const openWineBottleSound = new Audio('music/openWineBottleSound.mp3');
const breakWineBottleSound = new Audio('music/breakWineBottleSound.mp3');

const openPizzaBoxSound = new Audio('music/openBoxSound.mp3');
const crushPizzaBoxSound = new Audio('music/crushBoxSound.mp3');

// Set model paths and animation paths according to the current page
if (page === 'item1.html') { // Can Model
    modelPath = 'models/CanOpen.glb';
    openClip = 'OpenCan';
    crushModelPath = 'models/CanCrush.glb';
    crushClip = 'Crush';
    recycleModelPath = 'models/CanRecycle.glb';
    recycleClip = 'Recycle';
} else if (page === 'item2.html') { // Wine Bottle Model
    modelPath = 'models/WineBottleOpen.glb';
    openClip = 'Cap';
    breakModelPath = 'models/WineBottleBreak.glb';
    topBreakClip='TopBreak'; 
    bottomBreakClip='BottomBreak'; 
} else if (page === 'item3.html') { // Pizza Box Model
    modelPath = 'models/PizzaBoxOpen.glb';
    openClip = 'OpenBox';
    crushModelPath = 'models/PizzaBoxCrush.glb';
    crushClip = 'Crush';
}

// Load Model Function
function loadModel(path, onLoad) {
    const loader = new THREE.GLTFLoader();
    loader.load(path, (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.0, 1.0, 1.0);

        // Center the model based on bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y -= 0.2;

        // Remove old models and add new one
        if (currentModel) scene.remove(currentModel);
        currentModel = model;
        scene.add(model);

        // Determine if it is the wine bottle page. If it is, modify the wine bottle material (because the display effect loaded onto the page is not that good).
        if (isWineBottle) {
            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    const meshName = child.name.toLowerCase();
                    const materialName = child.material.name.toLowerCase();
        
                    // Set the glass material for the wine bottle
                    if (materialName.includes('glass') || meshName.includes('bottle')) {
                        child.material.metalness = 0.3;
                        child.material.roughness = 0.1;
                        child.material.envMapIntensity = 1.0;
                    }
        
                    // Then the material for the cap
                    if (materialName.includes('cap') || meshName.includes('cap')) {
                        child.material.color.set('#6B4E34');
                        child.material.roughness = 0.8;
                        child.material.metalness = 0.0;
                    }
                }
            });
        }
        
        // Move the pizza box slightly down in the scene
        if (page === 'item3.html') {
            currentModel.position.y -= 0.5;  // Down
        }
        
        // Create an AnimationMixer
        mixer = new THREE.AnimationMixer(model);
        actions = {};
        gltf.animations.forEach((clip) => {
            actions[clip.name] = mixer.clipAction(clip);
            actions[clip.name].setLoop(THREE.LoopOnce); //Play the animation once
            actions[clip.name].clampWhenFinished = true; // Saty on the final frame after playing the animation
        });

        // Callback after loading
        if (onLoad) onLoad();
    }, undefined, (err) => console.error('Failed to load model:', err));
}

// Load the model when loading the page
loadModel(modelPath);