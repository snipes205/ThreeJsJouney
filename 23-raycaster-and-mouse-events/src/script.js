import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let currentIntercect = null;

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

const gltfLoader = new GLTFLoader();
let modelGltf = null;

gltfLoader.load('/models/Duck/glTF/Duck.gltf',
    (model)=>{
        modelGltf = model.scene;
        model.scene.position.y  -= 0.5; 
        scene.add(model.scene)
    }
);

// Light
const ambLight = new THREE.AmbientLight('#ffffff',0.2);
scene.add(ambLight);
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(2,3,0);

scene.add(directionalLight);


/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();
// console.log(raycaster);
// ray from
// const rayOrigin = new THREE.Vector3(-3,0,0);
// // ray to 

// const rayDirection = new THREE.Vector3(10,0,0);
// // console.log(rayDirection.length());
// rayDirection.normalize();
// // normalize to 1
// // console.log(rayDirection.length());
// raycaster.set(rayOrigin,rayDirection);

// // singular
// const intersect =raycaster.intersectObject(object2);
// console.log(intersect)
// // multi

// // ray need updated
// object1.updateMatrixWorld();
// object2.updateMatrixWorld();
// object3.updateMatrixWorld();
// const intersects = raycaster.intersectObjects([object1,object2,object3]);

// console.log(intersects)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// handle mouse

const cursorPosition = new THREE.Vector2();

window.addEventListener('mousemove',(e)=>{
    cursorPosition.setX( ( ( e.clientX/ sizes.width ) * 2) - 1 );
    // need to be inverted
    cursorPosition.setY(  - (( ( e.clientY/ sizes.height ) * 2) - 1) );
    // cursorPosition.normalize()
    // console.log(cursorPosition);
})
window.addEventListener('click',()=>{
    if(currentIntercect){
        console.log(currentIntercect);
        if(currentIntercect.object ===object1){
            console.log("obj 1 clicked")
        }
        if(currentIntercect.object ===object2){
            console.log("obj 2 clicked")
        }
        if(currentIntercect.object ===object3){
            console.log("obj 3 clicked")
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate spere
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.6) * 1.5;

    // const rayOrign = new THREE.Vector3(-3,0,0);
    // const rayDirection  = new THREE.Vector3(10,0,0);   
    // rayDirection.normalize();
    // raycaster.set(rayOrign,rayDirection);

    // const intersects = raycaster.intersectObjects([object1,object2,object3]);

    // object1.updateMatrixWorld();
    // object2.updateMatrixWorld();
    // object3.updateMatrixWorld();

    // object1.material.color.set('#ff0000');
    // object2.material.color.set('#ff0000');
    // object3.material.color.set('#ff0000');

    // for(const intersect of intersects ){
    //     intersect.object.material.color.set("#f0b0d2")
    // }

    
    // mouse event
    raycaster.setFromCamera(cursorPosition,camera);

    const intersects = raycaster.intersectObjects([object1,object2,object3]);

    // if(intersects.length){
    //     // console.log("hovered");
    //     // currentIntercect = intersects[0];
    //     if(currentIntercect === null){
    //         console.log("mouse entered");
    //     }
    //     currentIntercect = intersects[0];
    // }else{
    //     // console.log("not hoverd");

    //     if(currentIntercect){
    //         console.log("mouse leave");
    //     }

    //     currentIntercect = null;
    // }

    // object1.material.color.set('#ff0000');
    // object2.material.color.set('#ff0000');
    // object3.material.color.set('#ff0000');

    // for(const intersect of intersects ){
    //     intersect.object.material.color.set("#f0b0d2")
    // }

    // using model
    if(modelGltf !== null){
        // 어차피 intersect 는 하나로 통합돼서 
        const modelIntersect = raycaster.intersectObject(modelGltf);
        if(modelIntersect.length>0){
            modelGltf.scale.set(1.2,1.2,1.2);
        }else{
            modelGltf.scale.set(1,1,1);    
        }
    }
    if(intersects.length){
        // console.log("hovered");
        // currentIntercect = intersects[0];
        if(currentIntercect === null){
            console.log("mouse entered");
        }
        currentIntercect = intersects[0];
    }else{
        // console.log("not hoverd");

        if(currentIntercect){
            console.log("mouse leave");
        }

        currentIntercect = null;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()