let isAnimating = false; // Whether an animation is currently playing
let isWireframeMode = false; // Whether the model is in wireframe mode


// Wireframe toggle button
document.getElementById('wireframeBtn')?.addEventListener('click', () => {
    if (isAnimating) return;
    if (mixer) mixer.stopAllAction();

    isWireframeMode = !isWireframeMode;

    currentModel?.traverse((child) => {
        if (child.isMesh) {
            if (isWireframeMode) {
                // Store original material and apply wireframe material
                child.userData.originalMaterial = child.material;
                child.material = new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    wireframe: true
                });
            } else {
                // Restore original material
                if (child.userData.originalMaterial) {
                    child.material = child.userData.originalMaterial;
                }
            }
        }
    });
});

// Model rotation button
document.getElementById('rotateBtn')?.addEventListener('click', () => {
    if (isAnimating) return;
    if (mixer) mixer.stopAllAction();
    if (currentModel) {
        currentModel.rotation.y += Math.PI / 6; // Rotate 30 degrees clockwise around Y axis
    }
});

// Play "open" animation
document.getElementById('openBtn')?.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;
    // Play corresponding sound based on page
    if (page === 'item1.html') {
        openCanSound.currentTime = 0;
        openCanSound.play();
    } else if (page === 'item2.html') {
        openWineBottleSound.currentTime = 0;
        openWineBottleSound.play();
    } 

    loadModel(modelPath, () => {
        if (actions[openClip]) {
            actions[openClip].reset().play();
            actions[openClip].getMixer().addEventListener('finished', () => {
                // Stop sound after animation finishes
                if (page === 'item1.html') {
                    openCanSound.pause();
                    openCanSound.currentTime = 0;
                } else if (page === 'item2.html') {
                    openWineBottleSound.pause();
                    openWineBottleSound.currentTime = 0;
                }
                isAnimating = false;
            });
        } else {
            isAnimating = false;
        }
    });
});

// Play "crush" animation
document.getElementById('crushBtn')?.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    // Play different sounds based on the page
    if (page === 'item1.html') {
        crushCanSound.currentTime = 0;
        crushCanSound.play();
    } else if (page === 'item3.html') {
        crushPizzaBoxSound.currentTime = 0;
        crushPizzaBoxSound.play();
        setTimeout(() => {
            crushPizzaBoxSound.pause();
            crushPizzaBoxSound.currentTime = 0;
        }, 600);  // Only play for 0.6 seconds
    } 
     // Load model and play crush animation
    loadModel(crushModelPath, () => {
        if (actions[crushClip]) {
            actions[crushClip].reset().play();
            actions[crushClip].getMixer().addEventListener('finished', () => {
                // Stop sound after animation finishes
                if (page === 'item1.html') {
                    crushCanSound.pause();
                    crushCanSound.currentTime = 0;
                } else if (page === 'item3.html') {
                    crushPizzaBoxSound.pause();
                    crushPizzaBoxSound.currentTime = 0;
                }
                isAnimating = false;
            });
        } else {
            isAnimating = false;
        }
    });
});

// Play recycle animation
document.getElementById('recycleBtn')?.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    recycleCanSound.loop = true;  // Enable looping sound
    recycleCanSound.currentTime = 0;
    recycleCanSound.play();

    // Load model and play recycle animation
    loadModel(recycleModelPath, () => {
        if (actions[recycleClip]) {
            actions[recycleClip].reset().play();
            actions[recycleClip].getMixer().addEventListener('finished', () => {
                // Stop sound after animation finishes
                recycleCanSound.pause();       
                recycleCanSound.currentTime = 0;
                isAnimating = false;
            });
        } else {
            isAnimating = false;
        }
    });
});

// Play break animation (specific to wine bottle model)
document.getElementById('breakBtn')?.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;
    
    // Delay sound play
    setTimeout(() => {
        breakWineBottleSound.currentTime = 0;
        breakWineBottleSound.play();
    }, 400); // Delay 0.4 seconds

    // Load model and play two separate break animations
    loadModel(breakModelPath, () => {
        currentModel.position.y += 1.5; // Move model upward
        const activeActions = [];

        // Play TopBreak clip
        if (actions[topBreakClip]) {
            actions[topBreakClip].reset().play();
            activeActions.push(actions[topBreakClip]);
        }

        // Play BottomBreak clip
        if (actions[bottomBreakClip]) {
            actions[bottomBreakClip].reset().play();
            activeActions.push(actions[bottomBreakClip]);
        }

        // Wait for all animations to finish
        let finishedCount = 0;
        activeActions.forEach(action => {
            // Add a listener to each animation
            action.getMixer().addEventListener('finished', () => {
                breakWineBottleSound.pause(); 
                breakWineBottleSound.currentTime = 0;
                finishedCount++; // Increment the count of finished animations
                if (finishedCount === activeActions.length) { // Only set isAnimating to false after all animations have finished
                    isAnimating = false;
                }
            });
        });

        if (activeActions.length === 0) {
            isAnimating = false;
        }
    });
});

// Play pizza box open animation
document.getElementById('openBoxBtn')?.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    //Load model
    loadModel(modelPath, () => {
        openPizzaBoxSound.currentTime = 0;
        openPizzaBoxSound.play();
        // Stop sound after 1 second
        setTimeout(() => {
            openPizzaBoxSound.pause();
            openPizzaBoxSound.currentTime = 0;
        }, 1000);  
        if (actions[openClip]) {
            actions[openClip].reset().play();
            actions[openClip].getMixer().addEventListener('finished', () => {
                // Animation finished
                isAnimating = false;
            });
        } else {
            isAnimating = false;
        }
    });
});    

// Lighting toggle
let lightMode = 0;
const lightLabel = document.getElementById('lightLabel');

document.querySelector('.m-control button:nth-child(1)')?.addEventListener('click', () => {
    lightMode = 1 - lightMode; // Toggle between two light modes
    lights.forEach(l => l.visible = false); // Turn off all lights

    switch (lightMode) {
        case 0:
            // Open all lights
            lights.forEach(l => l.visible = true);
            lightLabel.textContent = 'Full Lighting';
            break;
        case 1:
            // Open partial lights for comparison
            sun.visible = true;
            hemisphere.visible = true;
            leftPointLight.visible= true;
            sideLight.visible= true;
            lightLabel.textContent = 'Contrast Lighting';
            break;
    }
});

// Camera view switching
const cameraViews = [
    // Three views
    { name: "Front View", pos: [0, 1.2, 6], look: [0, 0, 0] }, 
    { name: "Top View", pos: [0, 8, 0], look: [0, 0, 0] },
    { name: "Side View", pos: [-6, 1.2, 0], look: [0, 0, 0] }
];
// Initialize camera index
let currentCameraIndex = 0;

const cameraLabel = document.getElementById('cameraLabel');
document.querySelector('.m-control button:nth-child(2)')?.addEventListener('click', () => {
    currentCameraIndex = (currentCameraIndex + 1) % cameraViews.length; 
    const view = cameraViews[currentCameraIndex];
    camera.position.set(view.pos[0], view.pos[1], view.pos[2]);
    camera.lookAt(view.look[0], view.look[1], view.look[2]);

    // Update view label
    if (cameraLabel) cameraLabel.innerText = view.name;
});

// Reset model button
document.querySelector('.m-control button:nth-child(3)')?.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    loadModel(modelPath, () => {
        currentModel.rotation.set(0, 0, 0);  // Reset model rotation
        controls.reset();  // Reset orbit controls
        isAnimating = false;
    });
});
