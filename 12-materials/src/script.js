import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lilGui from 'lil-gui';

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Textures
 */

// using texture loader 
const loadingManager = new THREE.LoadingManager();
// use load manager
const textureLoader = new THREE.TextureLoader(loadingManager);

const colorTexture              = textureLoader.load('/textures/door/color.jpg');
const alphaTexture              = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture             = textureLoader.load('/textures/door/height.jpg');
const normalTexture             = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture   = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture          = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture          = textureLoader.load('/textures/door/roughness.jpg');

const gradientTexture           = textureLoader.load('/textures/gradients/3.jpg');

const matcapTexture             = textureLoader.load('/textures/matcaps/1.png');

// envirnoment texture

const cubeTextureLoader = new THREE.CubeTextureLoader();
/**
 * 6 jpgs
 */
const environmentTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/ny.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);

/**
 * Object
 */

// const material = new THREE.MeshBasicMaterial();
// color setting;


// const material = new THREE.MeshBasicMaterial({color : red});
// material.color = new THREE.Color('rgb(55,55,22)');
// material.color = new THREE.Color(0xff0000);
// material.color.set('red')

// material.wireframe = true;

// tranceparency
// material.opacity = 0.5;
// material.transparent = true;

// when use alpha map set true transtparent
// material.transparent = true;

// Back Side
// material.side = THREE.DoubleSide

// material.alphaMap = alphaTexture; 

// material.map = colorTexture;

// Normal is Hard.. 노말은 컴퓨터가 이해하는 가깝고 먼 거리를 측정하기위해 컬러를 사용하는데 RGB단위를 사용한다
// Normal Material
// const material = new THREE.MeshNormalMaterial();

// unable smooth
// material.flatShading = true;

// MatCap Material 
// adding teture
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;
// material.flatShading = true;

// texture to bump
// const material = new THREE.MeshDepthMaterial();

// LambertMaterial is for light only;
// const material = new THREE.MeshLambertMaterial();

// light are reflecting;
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// // 번지는 색깔
// material.specular = new THREE.Color(0xff000)

// // cartoon
// const material = new THREE.MeshToonMaterial();

// gradientTexture.magFilter =  THREE.NearestFilter;
// gradientTexture.minFilter =  THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

// 가장 많이 쓰이는
const material = new THREE.MeshStandardMaterial();


// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;

// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;

// material.metalnessMap= metalnessTexture;

// // material.metalness = 0.45;

// material.roughnessMap = roughnessTexture;
// // material.roughness = 0.45;

// //more detail
// material.normalMap = normalTexture;
// // material.normalScale.x = 1;

// material.transparent= true;
// material.alphaMap = alphaTexture;

// material.flatShading;

material.metalness = 0.7;
material.roughness = 0.2;
// 바깥 비추기
material.envMap = environmentTexture;

const sphere = new THREE.Mesh(
     new THREE.SphereGeometry(0.5,64,64),
     material
)
sphere.position.x = -1.5;
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1,100,100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(
        0.3,0.2,64,128
    ),
    material
)

torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Light
 */

const ambinentLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambinentLight)

const pointLight = new THREE.PointLight(0xfffffff,0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight);

/**
 * Debug
 */
material.side = THREE.DoubleSide;
const gui = new lilGui.GUI();

gui.add( material, 'metalness' , 0 ,1, 0.01 ).name("metal")
gui.add( material, 'roughness' , 0 ,1, 0.01 ).name("rough")
gui.add( material , 'aoMapIntensity', 0 ,10)
gui.add( material , 'displacementScale', 0 ,1, 0.01);

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
    sphere.rotation.y = elapsedTime * 0.15;
    plane.rotation.y = elapsedTime * 0.15;
    torus.rotation.y = elapsedTime * 0.15;


    sphere.rotation.x = elapsedTime * 0.1;
    plane.rotation.x = elapsedTime * 0.1;
    torus.rotation.x = elapsedTime * 0.1;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()