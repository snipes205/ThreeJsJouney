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
 * Galaxy
 */
const parameters = {
    count : 100000,
    radius : 5,
    branch : 3,
    spin    : 1,
    randomness: 0.5,
    //intensity
    randomnessPower:3,
    insideColor :"#ff5588",
    outsideColor :"#00b5f2"
};

let geometry = null;;
let material = null; ;
let points = null;

const generateGalacxy = (parameters) => {
    // destroy old galaxy
    if(points !== null){
        geometry.dispose();
        material.dispose();
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(parameters.count * 3);
    const colorsArray = new Float32Array(parameters.count * 3);
    
    const galaxyInsideColor = new THREE.Color(parameters.insideColor);
    const galaxyOutsideColor = new THREE.Color(parameters.outsideColor);
    
    for(let i = 0 ; i< parameters.count; i++){
        const i3 =  i * 3
        
        const galaxyRadius = Math.random() * parameters.radius;
        
        // 은하수 꼬기
        const spinAngle = galaxyRadius * parameters.spin;
        const branchAngle =( ( i % parameters.branch ) / parameters.branch ) * Math.PI * 2;
    
        // const randomX = ( Math.random()-0.5  ) * parameters.randomness;
        // const randomY = ( Math.random()-0.5  ) * parameters.randomness;
        // const randomZ = ( Math.random()-0.5  ) * parameters.randomness;

        const randomX =  Math.pow(Math.random() ,parameters.randomnessPower) * (Math.random()<0.5 ? 1 : -1);
        const randomY =  Math.pow(Math.random() ,parameters.randomnessPower) * (Math.random()<0.5 ? 1 : -1);
        const randomZ =  Math.pow(Math.random() ,parameters.randomnessPower) * (Math.random()<0.5 ? 1 : -1);


        // if(i<20){
        //     console.log(branchAngle);
        // }
        //x
        positionArray[i3] =  Math.cos(branchAngle + spinAngle) * galaxyRadius + randomX;
        //y
        positionArray[i3 + 1] = randomY;
        //z
        positionArray[i3 + 2] =  Math.sin(branchAngle + spinAngle) * galaxyRadius + randomZ;

        const mixedColor = galaxyInsideColor.clone();
        mixedColor.lerp(galaxyOutsideColor,galaxyRadius/ parameters.radius);
        // Red
        colorsArray[i3 + 0] = mixedColor.r;
        // Green
        colorsArray[i3 + 1] = mixedColor.g;
        // Blue
        colorsArray[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray,3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray,3));
    

    material = new THREE.PointsMaterial({
        color: '#ffffff',
        size: 0.01,
        sizeAttenuation: true,
        blending : THREE.AdditiveBlending,
        vertexColors:  true,
        
    })

    points = new THREE.Points(geometry,material);

    scene.add(points);


};
generateGalacxy(parameters)
/**
 * Debug
 */
gui.add(parameters,'count',1,parameters.count,100).onFinishChange(()=>generateGalacxy(parameters));
gui.add(parameters,'radius',1,parameters.radius * 10,1).onFinishChange(()=>generateGalacxy(parameters));
gui.add(parameters,'branch',1,parameters.branch * 10,1).onFinishChange(()=>generateGalacxy(parameters));
gui.add(parameters,'spin',-5,5,0.1).onFinishChange(()=>generateGalacxy(parameters));
gui.add(parameters,'randomness',0,1,0.01).onFinishChange(()=>generateGalacxy(parameters));
gui.add(parameters,'randomnessPower',1,10,1).onFinishChange(()=>generateGalacxy(parameters));
gui.addColor(parameters,'insideColor').onFinishChange(()=>generateGalacxy(parameters));
gui.addColor(parameters,'outsideColor').onFinishChange(()=>generateGalacxy(parameters));
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
camera.position.x = 3
camera.position.y = 3
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()