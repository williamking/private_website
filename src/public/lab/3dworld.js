// Author: William
// Email: williamjwking@gmail.com

function MyScene() {
    var scene = this.scene = new THREE.Scene();
    this.goem = new THREE.Geometry();
    // scene.add(this.goem);
    this.initStats();
    this.initControlAndGui();
    this.initCamera();
    this.initAxis();
    this.initLights();
    this.initVerticesAndFaces();    
    this.initRenderer();
};

MyScene.prototype = {
    initStats: function() {
        var stats = this.stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.right = '0px';
        $(this.id).append(stats.domElement);
        return stats;
    },

    initAxis: function() {
        this.axis = new THREE.AxisHelper(200);
        this.scene.add(this.axis);
    },

    initCamera: function() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(-4, -6, 3);
        this.camera.lookAt(this.scene.position);
    },

    initLights: function() {
        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(0, 0, 100);
        this.scene.add(this.spotLight);
    },

    initRenderer: function() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xEEEEEE);        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render.showMapEnabled = true;
    },

    initControlAndGui: function() {
        var verticesNum = 8;        
        var control = this.control = new (function() {
            var vertices = [
                1, 3, 1,
                1, 3, -1,
                1, -1, 1,
                1, -1, -1,
                -1, 3, -1,
                -1, 3, 1,
                -1, -1, -1,
                -1, -1, 1
            ];
            this.vertices = [];
            for (var i = 0; i < verticesNum; ++i) {
                this.vertices.push({
                    x: vertices[i * 3],
                    y: vertices[i * 3 + 1],
                    z: vertices[i * 3 + 2]
                });
            }
        })();

        var gui = this.gui = new dat.GUI();
        for (var i = 0; i < verticesNum; ++i) {
            gui.addFolder('Vertices ' + (i + 1));
            gui.add(control.vertices[i], 'x', -10, 10);
            gui.add(control.vertices[i], 'y', -10, 10);
            gui.add(control.vertices[i], 'z', -10, 10);            
        }
    },

    initVerticesAndFaces: function() {

        var vertices = this.control.vertices.map(function(vertice, index) {
            return new THREE.Vector3(vertice.x, vertice.y, vertice.z);
        });

        var faces = [
            0, 2, 1,
            2, 3, 1,
            4, 6, 5,
            6, 7, 5,
            4, 5, 1,
            5, 0, 1,
            7, 6, 2,
            6, 3, 2,
            5, 7, 0,
            7, 2, 0,
            1, 3, 4,
            3, 6, 4
        ];
        var facesNum = 12;
        this.faces = [];
        for (var i = 0; i < facesNum; ++i) {
            this.faces.push(new THREE.Face3(faces[i * 3], faces[i * 3 + 1], faces[i * 3 + 2]));
        }

        var goem = this.goem;
        goem.vertices = vertices;
        goem.faces = this.faces;
        goem.computeFaceNormals();

        var materials = [
            new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true }),
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
        ];

        var mesh = this.mesh = THREE.SceneUtils.createMultiMaterialObject(goem, materials);
        mesh.children.forEach(function(e) {
            e.castShadow = true;
        });

        this.scene.add(mesh);
    },

    updateVertices: function() {
        var vertices = this.control.vertices.map(function(vertice, index) {
            return new THREE.Vector3(vertice.x, vertice.y, vertice.z);
        });
        this.mesh.children.forEach(function(e) {
            e.geometry.vertices = vertices;
            e.geometry.verticesNeedUpdate = true;
            e.geometry.computeFaceNormals();
        })
    },

    render: function() {
        this.stats.update();
        this.updateVertices();
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    },

    show: function(id) {
        this.id = id;
        this.initStats();
        $(id).append(this.renderer.domElement);
    },

    addCube: function() {
        var geometry = new THREE.CubeGeometry(4, 4, 4);
        var material = new THREE.MeshBasicMaterial({color: 0x234300});
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        var cube = new THREE.Mesh(geometry, cubeMaterial);

        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;
        cube.castShadow = true;

        this.scene.add(cube);        
    }
}

function runDemo1() {

    if (window.location.pathname == '/lab/threeJs') {
        var stats = initStats();

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // var camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16,
        // window.innerHeight / 16, window.innerHeight / -16,
        // 5, 500);
        scene.add(camera);

        var renderer = new THREE.WebGLRenderer();
        // var effect = null;

        var createWorld = function() {
            renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMapEnabled = true;

            // ascii renderer
            effect = new THREE.AsciiEffect(renderer);
            effect.setSize(window.innerWidth, window.innerHeight);
            $('#ascii-output').append(effect.domElement);
        };

        createWorld();

        // 添加平面
        var planeGeometry = new THREE.PlaneBufferGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // plane.castShadow = true;
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 0, 0);
        
        scene.add(plane);

        // 添加点光源
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        var spotLight = new THREE.SpotLight(0xffffff);        
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        $('#3d-canvas').append(renderer.domElement);
        

        // 添加立方体并设置其参数
        var geometry = new THREE.BoxGeometry(3, 3, 3);
        var material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});
        var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
        var cube = new THREE.Mesh(geometry, cubeMaterial);

        cube.position.x = 0;
        cube.position.y = 10;
        cube.position.z = 0;
        cube.castShadow = true;
        cube.receiveShadow = true;

        scene.add(cube);

        // 添加坐标轴
        var axes = new THREE.AxisHelper(200);
        scene.add(axes);

        //添加雾气环境
        // scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

        // var raycaster = new THREE.Raycaster();
        // var mouse = new THREE.Vector2();
        // var onMouseMove = function(event) {
        //     mouse.x = event.clientX / window.innerWidth * 2 - 1
        //     mouse.y = event.clientY / window.innerHeight * 2 + 1
        // }

        var gui = new dat.GUI();
        var control = new Control();
        gui.add(control, 'rotationSpeed', 0, 0.5);
        gui.add(control, 'cameraX', -100, 100);
        gui.add(control, 'cameraY', -100, 100);
        gui.add(control, 'cameraZ', -100, 100);
        gui.add(control, 'runningSpeed', 1, 5);
        gui.add(control, 'addRotateSphere');
        gui.add(control, 'addCube');

        var render = function() {
            stats.update();

            // raycaster.set(mouse, camera);
            // var intersects = raycaster.intersectObjects(scene.children);
            // for (var i = 0; i < intersects.length; ++i) {
            //     intersects[i].object.material.color.set(0xff00000);
            // }

            setCameraPosition(control, scene, camera);
            control.rotate();

            // cube.rotation.x += control.rotationSpeed;
            // cube.rotation.y += control.rotationSpeed;
            // cube.rotation.z += control.rotationSpeed;
            scene.traverse(function (e) {
                if (e instanceof THREE.Mesh && e != plane) {

                    e.rotation.x += control.rotationSpeed;
                    e.rotation.y += control.rotationSpeed;
                    e.rotation.z += control.rotationSpeed;
                }
            });
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            effect.render(scene, camera);
        };

        // window.addEventListener('mousemove', onMouseMove, false)

        render();
    }
    
    function initStats() {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.right = '0px';
        $('#stats-output').append(stats.domElement);
        return stats;
    }

    function Control() {
        this.rotationSpeed = 0.01;
        this.runningSpeed = 1;
        this.centerX = -4;
        this.centerY = 3;
        this.centerZ = 0;
        this.cameraX = -30;
        this.cameraY = 40;
        this.cameraZ = 30;
        this.rotateRadius = 30;
        this.cubes = [];
        this.angle = 0;

        this.addRotateSphere = function() {
            var sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
            var sphereMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
            var cube = new THREE.Mesh(sphereGeometry, sphereMaterial);
            cube.castShadow = true;
            cube.name = 'cube-' + this.cubes.length;
            scene.add(cube);
            this.cubes.push(cube);
            this.angle = 0;
            this.setCubes();
        };

        this.setCubes = function() {
            var l = this.cubes.length;
            for (var i = 0; i < l; ++i) {
                var angle = 2 * Math.PI * i / l + this.angle;
                var radius = this.rotateRadius;
                var x = radius * Math.cos(angle) + this.centerX;
                var y = radius * Math.sin(angle) + this.centerY;
                var z = this.centerZ;
                this.cubes[i].position.set(x, y, z);
                this.cubes[i].rotation.x += this.rotationSpeed;
                this.cubes[i].rotation.y += this.rotationSpeed;
                this.cubes[i].rotation.z += this.rotationSpeed;
            }
        };

        this.rotate = function() {
            this.angle += this.runningSpeed * 2 * Math.PI / 360;
            if (this.angle > 2 * Math.PI) this.angle -= 2 * Math.PI;
            this.setCubes();
        };

        this.addCube = function() {
                var cubeSize = Math.ceil((Math.random() * 3));
                var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;
                cube.name = "cube-" + scene.children.length;


                // position the cube randomly in the scene

                cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
                cube.position.y = Math.round((Math.random() * 5));
                cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

                // add the cube to the scene
                scene.add(cube);
                this.numberOfObjects = scene.children.length;
        };
    }

    // Control.prototype = {

    function setCameraPosition(control, scene, camera) {
        camera.position.x = control.cameraX;
        camera.position.y = control.cameraY;
        camera.position.z = control.cameraZ;
        camera.lookAt(scene.position);
    }
};

function runDemo2() {
    var demo3 = new MyScene();
    demo3.show('#demo3-output');
    demo3.render();
}

function runDemo3() {
        var stats = initStats();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene.add(camera);

        // create a render and set the size
        var renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // add the output of the renderer to the html element
        document.getElementById("3d-canvas").appendChild(renderer.domElement);

        // call the render function
        var step = 0;

        var controls = new function () {
            this.rotationSpeed = 0.02;
            this.numberOfObjects = scene.children.length;

            this.removeCube = function () {
                var allChildren = scene.children;
                var lastObject = allChildren[allChildren.length - 1];
                if (lastObject instanceof THREE.Mesh) {
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;
                }
            };

            this.addCube = function () {

                var cubeSize = Math.ceil((Math.random() * 3));
                var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;
                cube.name = "cube-" + scene.children.length;


                // position the cube randomly in the scene

                cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
                cube.position.y = Math.round((Math.random() * 5));
                cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

                // add the cube to the scene
                scene.add(cube);
                this.numberOfObjects = scene.children.length;
            };

            this.outputObjects = function () {
                console.log(scene.children);
            }
        };

        var gui = new dat.GUI();
        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'addCube');
        gui.add(controls, 'removeCube');
        gui.add(controls, 'outputObjects');
        gui.add(controls, 'numberOfObjects').listen();

        render();

        function render() {
            stats.update();

            // rotate the cubes around its axes
            scene.traverse(function (e) {
                if (e instanceof THREE.Mesh && e != plane) {

                    e.rotation.x += controls.rotationSpeed;
                    e.rotation.y += controls.rotationSpeed;
                    e.rotation.z += controls.rotationSpeed;
                }
            });

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        function initStats() {

            var stats = new Stats();

            stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            document.getElementById("stats-output").appendChild(stats.domElement);

            return stats;
        }
}

$(function() {
    runDemo1();
    runDemo2();
    // runDemo3();
});

