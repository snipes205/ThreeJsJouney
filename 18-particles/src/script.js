import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/8.png');

/**
 * Particles
 */

// const particlesGeometry = new THREE.SphereGeometry(1,32,32);
const particlesGeometry = new THREE.BufferGeometry();

const particlesCount = 5000;
const particlesArray = new Float32Array(particlesCount * 3 );
// offset to 5

const particleRange = 10;
const particlesColors = new Float32Array(particlesCount * 3);


for(let i = 0; i<= particlesCount * 3 ; i++){
    
    const particlePositon =  ( Math.random() * particleRange ) - (particleRange * 0.5);
    
    particlesArray[i] = particlePositon;
    particlesColors[i] = Math.random();
}

particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particlesColors,3));
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesArray,3));

const particlesMaterial = new THREE.PointsMaterial(
    {
        size: 0.1,
        sizeAttenuation: true, // when particle is close show big and far small
        // sizeAttenuation: false // when particle is close show big and far small
        transparent: true,
        alphaMap:particleTexture,
       
        // map: particleTexture,
        // easy way
        // alphaTest: 0.1,
        // depth buffer
        // depthTest: false,
        // might be best choice
        depthWrite : false,
        //중첩될때 밝아짐 신기함 ㅋㅋ
        blending : THREE.AdditiveBlending,

        vertexColors : true,
    });

// particlesMaterial.color.set('#fc9c04');

const particles = new THREE.Points(particlesGeometry,particlesMaterial);

scene.add(particles);

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

    // Update Particles
    // particles.position.y = - elapsedTime * 0.2;
    // console.log(particlesGeometry.attributes.position.array)
    for (let i = 0 ; i<= particlesCount; i++){
        const combineTo3 = i * 3
        const x = particlesGeometry.attributes.position.array[combineTo3];
        particlesGeometry.attributes.position.array[combineTo3 + 1] = Math.sin(elapsedTime + x) ;
            
    }

    particlesGeometry.attributes.position.needsUpdate = true;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()