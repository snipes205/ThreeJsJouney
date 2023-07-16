import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
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

const matcapTexture = textureLoader.load(
    '/textures/matcaps/3.png'
)

/**
 * Fonts
 */
// fonts needs to be loaded with fontloader
const fontLoader = new FontLoader();
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font)=>{
        // console.log('loading',font)
        const textGeometry = new TextGeometry(
            'Hello World',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments:2
            }
        )
        
        // textGeometry.computeBoundingBox();
        // console.log(textGeometry.boundingBox);
        // center text
        // bevel size , thickness도 생각해야해
        // textGeometry.translate(
        //     //x
        //         - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     //y
        //         - (textGeometry.boundingBox.max.y - 0.02 )* 0.5,
        //     //z
        //         - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
        // )

        textGeometry.center();

        const textMaterial = new THREE.MeshMatcapMaterial(
        );
        textMaterial.matcap = matcapTexture;
        
        const text = new THREE.Mesh(textGeometry,textMaterial);

        scene.add(text);

        // 반복되는것은 루프 밖으로 빼기

        const torusGeometry = new THREE.TorusGeometry(
            0.3, 0.2, 20, 45
        )
        const torusMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture});
            

        for(let i = 0; i < 100; i++){

            const torusMesh = new THREE.Mesh(torusGeometry,torusMaterial);

            torusMesh.position.x = (Math.random() - 0.5) * 10;
            torusMesh.position.y = (Math.random() - 0.5) * 10;
            torusMesh.position.z = (Math.random() - 0.5) * 10;

            torusMesh.rotation.x = (Math.random() * Math.PI);
            torusMesh.rotation.y = (Math.random() * Math.PI);
            torusMesh.rotation.z = (Math.random() * Math.PI);
            
            const randomScaleNumber = Math.random() +0.2;

            torusMesh.scale.set(randomScaleNumber,randomScaleNumber,randomScaleNumber);

            scene.add(torusMesh)
        }

    }
)

// const axisHelper = new THREE.AxesHelper();

// scene.add(axisHelper)

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()