var d3 = require('d3');
var Stats = require('stats-js');
var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');

module.exports = class RendererManager {
    constructor(dom, width, height) {
        this.initTypes();
        this.width = width;
        this.height = height;
        this.dom = dom;
        //this.stats();

        this.scene = new THREE.Scene();
        this.objects = []; //Init array who will contains all object on the scene
        this.draggableObjects = []; //Init array who will contains all object on the scene
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 1000;

        this.controls = new THREE.TrackballControls(this.camera);
        this.controls.target.set(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);

        this.raycaster = new THREE.Raycaster();

        this.dom.appendChild(this.renderer.domElement);
                this.setListener();
    }

    initTypes() {
        var t = THREE;
        this.types = {
            'cube': {
                'create': (options={}) => {
                    var geometry = new THREE.CubeGeometry(200, 200, 200);
                    var material = new THREE.MeshBasicMaterial({
                        color: options.color || 0xff0000
                    });
                    return new THREE.Mesh(geometry, material);
                }
            }
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    //Add statistic on javascript performance
    stats() {
//        this.stats = new Stats();
//        stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
//        this.dom.appendChild( stats.dom );
        this.stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        this.dom.appendChild(stats.domElement);
    }

    add(type, options={}) {
        var object = this.types[type].create(options);
        this.objects.push(object);
        if (options.draggable)
            this.draggableObjects.push(object);
        this.scene.add(object);
        this.render();
        return object;
    }

    remove(objectName) {
        this.scene.remove(scene.getObjectByName(object.name));
        this.render();
    }

    animate() {
//        requestAnimationFrame(this.animate.bind(this));
        this.scene.children[0].rotation.x += 0.01;
        this.scene.children[0].rotation.y += 0.02;
        this.render();
    }

    setListener() {
        //SELECT AN OBJECT
        document.addEventListener('mousedown', (event) => {
            event.preventDefault();
            this.clicked = true;
            var rect = this.renderer.domElement.getBoundingClientRect();
            var mouse = new THREE.Vector2();
            mouse.x = ((event.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
            this.raycaster.setFromCamera(mouse, this.camera);
            var intersects = this.raycaster.intersectObjects(this.draggableObjects);
            if (intersects.length > 0) {
                this.selection = intersects[0].object;
                console.log("selection init");
                if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                    this.offset.copy(this.intersection).sub(this.selection.position);
                }
            }
        }, false);
        //MOVE THE OBJECT
        document.addEventListener('mousemove', (event) => {
            if (this.clicked) {
                var rect = this.renderer.domElement.getBoundingClientRect();
                var mouse = new THREE.Vector2();
                mouse.x = ((event.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
                //If something drag
                if (this.selection) {
                    this.selection.position.x += mouse.x;
                    this.selection.position.y += mouse.y;
                    console.log("drag");
                }
                //Else rotate all the object
                else {
                    console.log("rotate");
                    this.scene.children[0].rotation.x += 0.01;
                    this.scene.children[0].rotation.y += 0.02;
                }
                this.renderer.render(this.scene, this.camera);
            }
        }, false);
        //UNSELECT THE OBJECT
        document.addEventListener('mouseup', (event) => {
            event.preventDefault();
            this.selection = undefined;
            this.clicked = false;
        }, false);
    }
}
