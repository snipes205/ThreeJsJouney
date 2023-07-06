import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
/**
 * Base
 */

/**
 * Cursor 
 */

const cursor = {
    x:0,
    y:0
};

// console.log(OrbitControls);



window.addEventListener('mousemove', 
    (e)=>{
        // swith positive and negative
        cursor.x =  -(e.clientX / sizes.width - 0.5);
        cursor.y =  (e.clientY / sizes.height - 0.5);
        console.log(cursor);
    }
);


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5), 
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera

// Field of view ; 
const fov = 120;

// rendering distance;
const near =0.1;
const far = 1000;
// tipical camera
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height , near ,far)
camera.position.z= 3;
// no 
const aspectRatio = sizes.width / sizes.height;  // multiply only horizontal
// const camera = new THREE.OrthographicCamera( -1 * aspectRatio, 1 * aspectRatio , 1 , -1 , near , far );


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()
const controls = new OrbitControls(camera,canvas);
// controls.target.y =1;
// controls.update();
// smmoth control;
controls.enableDamping = true;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // camera.position.x = Math.sin(cursor.x * Math.PI *2) * 3; 
    // camera.position.y = cursor.y * Math.PI * 2;
    // camera.position.z = Math.cos(cursor.x * Math.PI *2) * 3;
    // camera.lookAt(mesh.position) 
    scene.add(camera)
    // Update objects
    // mesh.rotation.y = elapsedTime;

    // enable damping
    controls.update();
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()