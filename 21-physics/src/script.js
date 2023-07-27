import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sound 
const hitSound = new Audio();
hitSound.src = '/sounds/hit.mp3';
const playHitSound = (collision) => {
    // reset hit sound 
    // 강도가 세면 소리가 나도록
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();

    if(impactStrength < 1 ) return;
    if(impactStrength > 2 ) hitSound.volume = 1;
    if(impactStrength < 2 ) hitSound.volume = impactStrength - 1;
    // hitSound.volume = Math.pow(impactStrength, 0.5)
    hitSound.currentTime = 0;
    hitSound.play();
    
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



/**
 *  Physics World
 */
// world
const world = new CANNON.World();
// set gravity to y - 0.92
world.gravity.set(0,-0.92,0);
// for optimization
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true
// material

// const concreteMaterial = new CANNON.Material('concrete'); //reference name
// const plasticMaterial  = new CANNON.Material('plastic'); 

// const concrerePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial,
//     plasticMaterial,
//     {
//         // default = 0.3 slipery
//         friction: 0.1,
//         // bouncy default = 0.3
//         restitution: 0.9,
//     }
// )

// world.addContactMaterial(concrerePlasticContactMaterial);

const defaultMaterial = new CANNON.Material('default'); 
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7,
    }
)

world.addContactMaterial(defaultContactMaterial);

world.defaultContactMaterial = defaultContactMaterial

// add body mathces with three js 
// shpere mathces with threejs sphere
// const sphereShape = new CANNON.Sphere(0.5,32,32);
// const shpereBody = new CANNON.Body({
//     //weight
//     mass:1,
//     position: new CANNON.Vec3(0,3,0),
//     shape: sphereShape, 
//     // material: defaultMaterial
        
// })
// // hitting force once
// shpereBody.applyLocalForce(new CANNON.Vec3(50,0,0), new CANNON.Vec3(0,0,0));
// // continous force
// shpereBody.applyForce(new CANNON.Vec3(-0.5,0,0), shpereBody.position)

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
// rotate floor
floorBody
    .quaternion
        .setFromAxisAngle(
            new CANNON.Vec3(-1,0,0)
            ,Math.PI * 0.5
            );
floorBody.mass = 0; // it wont move;
floorBody.addShape(floorShape);
// floorBody.material = defaultMaterial;

world.addBody(floorBody);
// world.addBody(shpereBody);
/**
 * Debug
 */
const gui = new dat.GUI()


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
 * Utils
 */
// saving objects
const objectsArray = []
const sphereGeometry = new THREE.SphereGeometry(1,32,32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})

const createSpere = (radius, position) => {
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    )
    // radius setting
    mesh.scale.set(radius,radius,radius);
    mesh.castShadow = true;
    mesh.position.copy( position )
    scene.add(mesh)
    const shape = new CANNON.Sphere(radius,32,32);
    const body = new CANNON.Body({
        mass: 1,
        position : new CANNON.Vec3(0, -3 , 0),
        shape,
        material : defaultMaterial 
    })
    body.position.copy(position);
    body.addEventListener('collide',playHitSound);
    world.addBody(body);

    // saves in objectsArray
    objectsArray.push({
        mesh,
        body
    });
    // console.log(objectsArray);
}   
const boxGeometry = new THREE.BoxGeometry(1,1,1,1,1,1);
const boxMaterial = new THREE.MeshStandardMaterial({
    envMap: environmentMapTexture,
    envMapIntensity: 0.3,
    metalness : 0.7,
    roughness : 0.1,
})

const createBox = (width,height,depth, position) => {
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial,
    )
    mesh.scale.set(width,height,depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);
        // half exteded from center
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5 , height * 0.5 ,depth * 0.5));
    const body = new CANNON.Body({
        mass: 2,
        position : new CANNON.Vec3(0, 3 , 0),
        shape,
        material : defaultMaterial 
    });
    body.position.copy(position);
    body.addEventListener('collide',playHitSound);
    world.addBody(body);

    objectsArray.push({mesh,body})

}

// createSpere( 0.5 , {x: 0 , y: 3 , z: 0});
const debugObject = {
    createSpere : ()=>createSpere(
         Math.random()  * 0.5 ,
        {   
            x: Math.random()  * 0.5 * 3,
            y: 3,
            z: Math.random()  * 0.5 * 3,
        }),
    createBox: ()=>createBox(
        Math.random() ,
        Math.random() ,
        Math.random() ,
        
       {   
           x: Math.random()  * 0.5 * 3,
           y: 3,
           z: Math.random()  * 0.5 * 3,
       }),
       reset : ()=>{
        for( const object of objectsArray) {
            object.body.removeEventListener('collide',playHitSound);
            // remove in physics world
            world.remove(object.body);
            // remove in three js
            scene.remove(object.mesh);
        }
        // clearing object
        objectsArray.splice(0,objectsArray.length);
       }
}
gui.add(debugObject, 'createSpere');
gui.add(debugObject, 'createBox');
gui.add(debugObject, 'reset');

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0;



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;
    // update physics world
    // (framerate? , deltaTimestamp, betweenStep)
    world.step(1/60,deltaTime, 3);
    
    for( const object of objectsArray) {
        object.mesh.position.copy(object.body.position);
        // rotating
        object.mesh.quaternion.copy(object.body.quaternion);
    }

    // update threejs world
    // sphere.position.x = shpereBody.position.x;
    // sphere.position.y = shpereBody.position.y;
    // sphere.position.z = shpereBody.position.z;
    // sphere.position.copy(shpereBody.position)

    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()