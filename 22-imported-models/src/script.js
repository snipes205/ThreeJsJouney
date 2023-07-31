import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
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
 * Model
 */
const gltfLoader = new GLTFLoader();
// gltfLoader.load('/models/Duck/glTF/Duck.gltf',
//     (data)=>{
//         console.log("loaded");
//         // console.log(data);
//         scene.add(data.scene.children[0])
//     },
//     ()=>{
//         console.log('progress');
//     },
//     ()=>{

//     }
// );

// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (data)=>{
//         console.log("loaded");
//         console.log(data.scene);
//         // 메시로 나눠서 scene에 저장
//         // 1
//         // while(data.scene.children.length){
//         //     scene.add(data.scene.children[0])
//         // } 
//         // 2 == deep copy
//         // const childrenArray = [...data.scene.children];
//         // for(const child of  childrenArray ){
//         //     scene.add(child);
//         // }
//         // 3 whole group
//         // scene.add(data.scene)
//     },
//     ()=>{
//         console.log('progress');
//     },
//     ()=>{

//     }
// );

// // Draco Loader 
// const dracoLoader = new DRACOLoader();
// // draco library
// dracoLoader.setDecoderPath('/draco/')
// // set gltf to dracolodaer
// gltfLoader.setDRACOLoader(dracoLoader)

// gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf',
//     (data)=>{
//         console.log("loaded");
//         console.log(data); 
//         scene.add(data.scene.children[0])
//     },
//     ()=>{
//         console.log('progress');
//     },
//     ()=>{

//     }
// );

let mixer = null;

gltfLoader.load('/models/Fox/glTF/Fox.gltf',(data)=>{
    data.scene.scale.set(0.025,0.025,0.025);
    // console.log(data);
    mixer = new THREE.AnimationMixer(data.scene);
    const action  = mixer.clipAction(data.animations[0]);
    action.play();
    // console.log(action);
    

    scene.add(data.scene);
    
})

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    // Mixer Update
    // when scene loaded
    if(mixer!==null)mixer.update(deltaTime)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()