import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
// Scene
const scene = new THREE.Scene()

// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Fog
 */
// near == where fog start;
// far == fog density
const fog = new THREE.Fog('#262837',1,15);
// add fog
scene.fog = fog

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()
//door
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// walls
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')

//grass
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')

// repeat texture
grassColorTexture.repeat.set(8,8);
// wrap repaet
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;

grassRoughnessTexture.repeat.set(8,8);
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

grassNormalTexture.repeat.set(8,8);
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;

grassAmbientOcclusionTexture.repeat.set(8,8);
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
/**
 * House
 */
const house  = new THREE.Group();
scene.add(house);
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,3,4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        normalMap: bricksNormalTexture,
        aoMap: bricksAmbientOcclusionTexture,
        roughness :bricksRoughnessTexture,
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
    );
// half size up
walls.position.y = walls.geometry.parameters.height * 0.5;
house.add(walls);

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(4,2,4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
// roof half up + wall height
roof.position.y = walls.geometry.parameters.height + (roof.geometry.parameters.height * 0.5);
// 45 deg
roof.rotation.y = Math.PI * 0.25 ;
house.add(roof);

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3,2.3,16,16),
    new THREE.MeshStandardMaterial({
        map : doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap :doorAmbientOcclusionTexture,
        displacementMap : doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap : doorMetalnessTexture,
        roughness : doorRoughnessTexture,
    })
    ,
)
// 외우시오.. uv 추가해서 ambient orientation 추가
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
    );
house.add(door)
door.position.y = door.geometry.parameters.height * 0.5;
door.position.z = ( walls.geometry.parameters.width * 0.5 ) + 0.01;

// bushes

const bushGeometry = new THREE.SphereGeometry(1,16,16);
const bushMaterial = new THREE.MeshStandardMaterial({color:"#89c854"});

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial);

bush1.scale.set(0.5,0.5,0.5);
bush1.position.set(0.8,0.2,2.2);

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial);
bush2.scale.set(0.25,0.25,0.25);
bush2.position.set(1.4,0.1,2.2);

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial);
bush3.scale.set(0.4,0.4,0.4);
bush3.position.set(-0.8,0.1,2.2);

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial);
bush4.scale.set(0.15,0.15,0.15);
bush4.position.set(-1,0.05,2.6);

scene.add(bush1,bush2,bush3,bush4);

const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({color:"#b2b6b1"});


for(let i = 0; i < 50; i++ ){
    const grave = new THREE.Mesh(graveGeometry,graveMaterial);

    const angle = Math.random() * ( Math.PI * 2 );
    // console.log(angle);
    const graveX = Math.sin(angle);
    const graveZ = Math.cos(angle);
    const radius = 4 + (Math.random() * 5);
    grave.position.x = graveX * radius;
    grave.position.z = graveZ * radius;
    grave.rotation.reorder('YXZ');
    grave.rotation.y =  (Math.random() - 0.5) * 0.6;
    grave.rotation.x =  (Math.random() - 0.5) * 0.2;
    grave.rotation.z =  (Math.random() - 0.5) * 0.2;
    grave.castShadow =true;
    graves.add(grave);
}

graves.position.y  = 0.4;



// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map : grassColorTexture,
        aoMap : grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap :grassRoughnessTexture,
        }
    )
)

floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
    );
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0

scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9df55', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#ff7d46',1, 7);
doorLight.position.set(0,walls.geometry.parameters.height - 0.1,2.2);
scene.add(doorLight);

const ghost1 = new THREE.PointLight('#ff00ff',2,3);
const ghost2 = new THREE.PointLight('#00ffff',2,3);
const ghost3 = new THREE.PointLight('#ff0000',2,3);

scene.add(ghost1,ghost2,ghost3);


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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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

// background color
renderer.setClearColor('#262837');
/**
 * Shadow
 */

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

doorLight.castShadow = true;
moonLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow =true;
// roof.castShadow = true;
bush1.castShadow =true;
bush2.castShadow =true;
bush3.castShadow =true;
bush4.castShadow =true;

floor.receiveShadow = true;
walls.receiveShadow = true;

// optimize
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update();

    // Update ghost

    // ghost1
    const radius1 = 5
    const rotateRate1 = elapsedTime * 0.5
    ghost1.position.x = Math.cos(rotateRate1) * radius1;
    ghost1.position.z = Math.sin(rotateRate1) * radius1;
    ghost1.position.y = Math.abs(Math.sin(rotateRate1 * 3 )  ) ; 

    // ghost2
    const radius2 = 6
    const rotateRate2 =  -elapsedTime * 0.8
    ghost2.position.x = Math.cos(rotateRate2) * radius2;
    ghost2.position.z = Math.sin(rotateRate2) * radius2;
    ghost2.position.y = Math.sin(rotateRate2 ) + Math.sin(rotateRate1 * 2 )  ; 

    // ghost3

    const radius3 = 4;
    const rotateRate3 =  -elapsedTime * 0.8
    ghost3.position.x = Math.cos(rotateRate3) + Math.tan( rotateRate1) + 2;
    ghost3.position.z = Math.sin(rotateRate3) * radius3;
    ghost3.position.y = Math.sin(rotateRate3 ) + Math.sin(rotateRate1 * 2 )  ; 
    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()