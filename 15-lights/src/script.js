import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// rect area helper
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

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
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

const ambientLight = new THREE.AmbientLight();
ambientLight.color.set(0xffffff);
ambientLight.intensity = 0.5;

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight();

directionalLight.color.set(0xffffc);
directionalLight.intensity = 0.2;
directionalLight.position.set(1,0.25,0);

scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.2);
scene.add(directionalLightHelper);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

gui.add(pointLight.position,'x',-5,5,0.1).name('pointX');
gui.add(pointLight.position,'y',-5,5,0.1).name('pointY');
gui.add(pointLight.position,'z',-5,5,0.1).name('pointZ');

gui.add(pointLight,'distance',0.1,10,0.1).name('pointDistance');
gui.add(pointLight,'decay',0,10,0.1).name('pointDecay');
gui.add(pointLight,'intensity',0,1,0.01).name('pointIntensity');


scene.add(pointLight);
// hemisphereLight.color.addColors(0xff0000, 0x0000ff);
// hemisphereLight.intensity = 1;

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);

scene.add(hemisphereLight);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight,0.2);
scene.add(hemisphereLightHelper);

gui.add(ambientLight,'intensity',0,1,0.01);

// studio light only work with mesh stadard , physical material
const rectAreaLight = new THREE.RectAreaLight(0x3e00ff,2,1,1);

rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3(0,0,0));
scene.add(rectAreaLight);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// round point light
const spotLight = new THREE.SpotLight('0x78ff00',0.5,10, Math.PI * 0.05, 0.25, 1);
spotLight.position.set(0,2,3);
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// to rotate light
spotLight.target.position.x = - 0.7;
scene.add(spotLight.target);


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()