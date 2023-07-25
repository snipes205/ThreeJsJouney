import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

THREE.ColorManagement.enabled = false


const parameters = {
    materialColor: '#ffeded'
}
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
const textureLoader= new THREE.TextureLoader();
const gradientTexture1 = textureLoader.load('/textures/gradients/3.jpg');
const gradientTexture2 = textureLoader.load('/textures/gradients/5.jpg');

gradientTexture1.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
    materialColor: parameters.materialColor,
    gradientMap : gradientTexture1,     
})
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

const objectDistance = 4;

mesh1.position.y = - (objectDistance * 0);
mesh2.position.y = - (objectDistance * 1);
mesh3.position.y = - (objectDistance * 2);


mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1,mesh2,mesh3];

/**
 * Particles
 */

const particlesParams = {
    particleCount : 2000, 
    particleSize:0.02,
    radius : 5,
    color: '#ffffff'
}

const particlesPositions = new Float32Array(particlesParams.particleCount * 3);
for( let i = 0; i < particlesParams.particleCount; i ++ ){
    const i3 = i * 3
    //x
    particlesPositions[ i3 ] = ( Math.random() - 0.5 ) * particlesParams.radius 
    //y
    particlesPositions[ i3 + 1 ] =  (objectDistance * 0.5) - (Math.random() * objectDistance * sectionMeshes.length)
    //z
    particlesPositions[ i3 + 2 ] = ( Math.random() - 0.5 ) * particlesParams.radius

}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions,3));

const particlesMaterial = new THREE.PointsMaterial(
    {
       color: particlesParams.color,
       size : particlesParams.particleSize,
       sizeAttenuation: true,
       blending : THREE.AdditiveBlending,
    //    vertexColors:  true,
    }
)

const particles = new THREE.Points(particlesGeometry,particlesMaterial);

scene.add(particles);



/**
 * Light
 */

const directionalLight = new THREE.DirectionalLight(
    '#ffffff', 1
) 

directionalLight.position.set( 1, 1, 0);
scene.add(directionalLight);




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

const cameraGroup = new THREE.Group();

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6

cameraGroup.add(camera);
scene.add(cameraGroup)



/**
 * Debug
 */

const gui = new dat.GUI()

gui
    .addColor(parameters, 'materialColor').onChange(
        ()=>{
            material.color.set(parameters.materialColor)
            particlesMaterial.color.set(parameters.materialColor)
        }    
    );



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha : true,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0); 
// renderer.clearColor = true;
/**
 * Animate
 */
const clock = new THREE.Clock()

let previousTime = 0;

/**
 * Scroll
 */

let scrollY= window.scrollY;

let currentSection = 0;

window.addEventListener('scroll',()=>{
    scrollY = window.scrollY
    const sectionCount = Math.round(scrollY/ sizes.height);

    if(sectionCount != currentSection){
        currentSection = sectionCount
        gsap.to(
            sectionMeshes[currentSection].rotation, {z: '+=3',x: '+=2', y:"+=3", duration:1, ease:'power2.inOut'}  
        )
    }
})

const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (e)=>{
    // normalize
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;

 })


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // 프레임 최적화
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    // console.log(deltaTime);
    // Animate Meshes
    for (const mesh of sectionMeshes){
        // mesh.rotation.reorder('YXZ');
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.2; 
    }

    // Animate Camera

    // 이건 외워야 할듯
    // - 스크롤 픽셀 / 캔버스 사이즈* 객체 사이 거리
    camera.position.y = - scrollY / sizes.height * objectDistance ;

    const parallaxX =   cursor.x * 0.5;
    const parallaxY = - cursor.y * 0.5;

    //easing
    cameraGroup.position.x += ( parallaxX - cameraGroup.position.x ) * deltaTime * 5;
    cameraGroup.position.y += ( parallaxY - cameraGroup.position.y ) * deltaTime * 5;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()