import * as THREE from 'three';
import { gsap } from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);

// Time
let time = Date.now();
const clock = new THREE.Clock();


// Animation 


gsap.to(
    mesh.position,{
        duration: 3,
        delay:1,
        x:2,
    }
)

gsap.to(
    mesh.position,{
        duration: 1,
        delay:1,
        x:-2,
    }
)


const tick = ()=>{
    // console.log('tick');
    // adapting framerate
    // const curTime = Date.now();
    // const deltaTime = curTime - time;
    // time = curTime;
    // one tick time
    // console.log(deltaTime);

    // elapsed seconds
    const elapsedTime = clock.getElapsedTime();
    // console.log(elapsedTime);

    // update object
    // mesh.position.x += 0.01ç
    // mesh.rotation.y += 0.002 * deltaTime;
    // // mesh.ro
    mesh.rotation.reorder('YXZ')
    // mesh.rotation.y = elapsedTime * Math.PI *2;
    // mesh.rotation.x = elapsedTime * Math.PI *2;
    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);
    // camera.lookAt(mesh.position);

    // infinite loop
    renderer.render(scene, camera) // refreshing frame
    window.requestAnimationFrame(tick);

}

tick();