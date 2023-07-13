import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// const geometry = new THREE.BufferGeometry();

// // Object
// // const geometry = new THREE.BoxGeometry(1, 1, 1,4,4,4)

// // const positionsArray = new Float32Array(9);

// // /**
// //  * positions  x y z
// //  */ 
// // positionsArray[0] = 0;
// // positionsArray[1] = 0;
// // positionsArray[2] = 0;

// // positionsArray[3] = 0;
// // positionsArray[4] = 1;
// // positionsArray[5] = 0;

// // positionsArray[6] = 0;
// // positionsArray[7] = 0;
// // positionsArray[8] = 1;

// // const positionsArray = new Float32Array([
// //     0,0,0, // first vertex
// //     0,1,0, // second vertex
// //     0,0,1  // third vertex
// // ]);

// // // on second 
// // // uv cordinate == 2,
// // // position cordinate == 3
// // const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

// // geometry.setAttribute('position', positionsAttribute);


// const count = 500; // triangles 

// const positionsArray = new Float32Array( count * 3 * 3); // the number of traingle vertex cordinates (x , y, z)

// for(let i =  0; i < count * 3 * 3; i++ ){
//     positionsArray[i] = Math.random() - 0.5;
// }
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

// position name is fixed on shaders.. 
// geometry.setAttribute('position',positionsAttribute);

const geometry = new THREE.SphereGeometry(1);

const material = new THREE.MeshBasicMaterial({
     color: 0xff0000,
     // use wire frame
     wireframe: true,
     })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()