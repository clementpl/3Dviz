var d3 = require('d3');
var Stats = require('stats-js');
var THREE = require('three');
THREE.TrackballControls = require('three-trackballcontrols');

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
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        //Set mouse control on the camera (pan, rotate, zoom)
        this.addMouseControls();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);

        this.raycaster = new THREE.Raycaster();

        this.dom.appendChild(this.renderer.domElement);

        //        this.setListener();
    }

    initTypes() {
        var t = THREE;
        this.types = {
            'cube': {
                'create': (options = {}) => {
                    var width = options.width || 200;
                    var height = options.height || 200;
                    var depth = options.depth || 200;
                    var geometry = new THREE.CubeGeometry(width, height, depth);
                    var material = new THREE.MeshBasicMaterial({
                        color: options.color || 0xff0000
                    });
                    var c = new THREE.Mesh(geometry, material);
                    if (options.position)
                        c.position.copy(new THREE.Vector3(options.position.x, options.position.y, options.position.z));
                    return c;
                }
            },
            'grid': {
                'create': (options={}) => {
                    var xLength = options.xLength;
                    var zLength = options.zLength;
                    var xSize = options.xSize;
                    var zSize = options.zSize;

                    var geometry = new THREE.Geometry();
                    var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
                    var color= new THREE.Color(0xffffff);

                    for (var i = 0; i <= xLength; i++) {
                        geometry.vertices.push(
                            new THREE.Vector3(i * xSize, 0, 0), new THREE.Vector3(i * xSize, 0, -zLength*zSize),
//                            new THREE.Vector3( i, 0, - sizeZ ), new THREE.Vector3( i, 0, sizeZ )
                        );
                        geometry.colors.push( color, color, color, color );
                    }
//                    var sizeZ = 83.333;
                    for (var i = 0; i <= zLength; i++) {
                        geometry.vertices.push(
                            new THREE.Vector3(0, 0, -i*zSize), new THREE.Vector3(xLength*xSize, 0, -i*zSize),
//                            new THREE.Vector3( i, 0, - sizeZ ), new THREE.Vector3( i, 0, sizeZ )
                        );
                        geometry.colors.push( color, color, color, color );
                    }
                    var grid = new THREE.LineSegments(geometry, material);
                    grid.position.x = -(xSize*(xLength+1))/2;
                    grid.position.z = zSize/2;
                    grid.position.y = -options.yOffset;
                    return grid;
                }
            },
            'axis': {
                'create': (options={}) => {
                    var geometry = new THREE.Geometry();
                    var material;
                    if (options.dashed) {
                        material = new THREE.LineDashedMaterial({
                            linewidth: options.lineWidth,
                            color: options.color,
                            dashSize: 3,
                            gapSize: 3
                        });
                    } else {
                        material = new THREE.LineBasicMaterial({
                            linewidth: options.lineWidth,
                            color: options.color
                        });
                    }
                    geometry.vertices.push(new THREE.Vector3(options.src.x, options.src.y, options.src.z));
                    geometry.vertices.push(new THREE.Vector3(options.dst.x, options.dst.y, options.dst.z));
                    geometry.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
                    var axis = new THREE.Line(geometry, material, THREE.LinePieces);
                    return axis;
                }
            }
        }
    }

    render() {
        this.animate();
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

    add(type, options = {}) {
        var object = this.types[type].create(options);
        this.objects.push(object);
        if (options.draggable)
            this.draggableObjects.push(object);
        this.scene.add(object);
        //        this.render();
        return object;
    }

    remove(objectName) {
        this.scene.remove(scene.getObjectByName(object.name));
        //        this.render();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.cameraControls.update();
        this.renderer.render(this.scene, this.camera);
    }

    addMouseControls() {
        //        this.clock = new THREE.Clock();
        this.cameraControls = new THREE.TrackballControls(this.camera);
//        this.cameraControls.target.set(0, 0, 0);

        this.cameraControls.rotateSpeed = 10;
        this.cameraControls.zoomSpeed = 1.2;
        //        this.cameraControls.panSpeed = 0.8;
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

/*
'grid': {
    'create': (options={}) => {
        var size = 500;
        var step = 83.333;
        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

        var color= new THREE.Color(0xffffff);

        for ( var i = - size; i <= size; i += step ) {
            geometry.vertices.push(
                            new THREE.Vector3( - size, 0, i ), new THREE.Vector3( size, 0, i ),
                new THREE.Vector3( i, 0, - size ), new THREE.Vector3( i, 0, size )
            );
            geometry.colors.push( color, color, color, color );
        }
        var grid = new THREE.LineSegments(geometry, material);
        grid.position.x = -step/2;
        grid.position.z = -step/2;
        return grid;
    }
},
*/
