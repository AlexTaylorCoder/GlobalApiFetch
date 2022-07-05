const { TextureLoader } = require("three")

const form = document.querySelector("form")
const field = document.getElementById("apiSubmit")
const display = document.getElementById("display")
//https://www.thecocktaildb.com/api/json/v1/1/search.php?s=

//let depth = 0
const depthArr = []
let countDepthOccur = {

}
form.addEventListener("submit",(e)=> {
    e.preventDefault()
    fetch(field.value).then(resp=>resp.json()).then(parseData).then(threeJsStart)
})

function parseData(data) {
    dataDepth(data,0)
    for (let depth in countDepthOccur) {
        const layerInfo = document.createElement("h3")
        layerInfo.textContent = countDepthOccur[depth]
        display.append(layerInfo)
    }

    }


function dataDepth(data,currentDepth) {
    if (typeof data === "object") {
        for (let obj in data) {
            dataDepth(data[obj],currentDepth+1)
        }
    }
    else if (Array.isArray(data)) {
        for (let arr of data) {
            dataDepth(arr,currentDepth+1)
        }
    }
    else {
        depthSort(currentDepth)
        currentDepth = 0
    }
}

function depthSort(currentDepth) {
    if (currentDepth  in countDepthOccur) {
        countDepthOccur[currentDepth] = parseInt(countDepthOccur[currentDepth])+ 1

    }
    else {
        countDepthOccur[currentDepth] = 0
    }   
}

function threeJsStart() {

    const metalNormal = TextureLoader.load("textures/Metal_Abstract_001_normal.jpg")
    const metalRough = TextureLoader.load("textures/Metal_Abstract_001_roughness.jpg")
    const metalColor = TextureLoader.load("textures/Metal_Abstract_001_basecolor.jpg")


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    console.log(countDepthOccur[1],countDepthOccur[2],countDepthOccur[3])
    const geometry = new THREE.BoxGeometry(countDepthOccur[1],countDepthOccur[2],countDepthOccur[3]);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    const light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.set( 50, 50, 50 );
    scene.add( light );
    scene.add( cube );

    camera.position.z = countDepthOccur[3]*2;

  
    function animate() {
        requestAnimationFrame( animate );

        cube.rotation.x += .01;
        cube.rotation.y += .01;
        
        renderer.render( scene, camera );
    };

    animate();
        }