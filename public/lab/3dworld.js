// Author: William
// Email: williamjwking@gmail.com

function MyScene() {
    this.scene = new THREE.Scene();
    this.goem = new THREE.Geometry();
    this.scene.add(this.goem);
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
        this.renderer.setClearColorHex(0xEEEEEE);        
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
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        var stats = initStats();

        var renderer = new THREE.WebGLRenderer();
        var effect = null;

        var createWorld = function() {
            renderer.setClearColorHex(0xEEEEEE);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.showMapEnabled = true;
            $('#3d-canvas').append(renderer.domElement);

            // ascii renderer
            effect = new THREE.AsciiEffect(renderer);
            effect.setSize(window.innerWidth, window.innerHeight);
            $('#ascii-output').append(effect.domElement);
        };

        // 添加立方体并设置其参数
        var geometry = new THREE.CubeGeometry(4, 4, 4);
        var material = new THREE.MeshBasicMaterial({color: 0x234300});
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        var cube = new THREE.Mesh(geometry, cubeMaterial);

        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;
        cube.castShadow = true;

        scene.add(cube);

        // 添加平面
        var planeGeometry = new THREE.PlaneGeometry(60, 40, 0, 0);
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.position.z = -40;
        scene.add(plane);

        // 添加坐标轴
        var axes = new THREE.AxisHelper(200);
        scene.add(axes);

        // 添加点光源
        var spotLight = new THREE.SpotLight(0xffffff);
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        spotLight.position.set(-40, -40, 60);
        spotLight.castShadow = true;
        scene.add(spotLight);
        scene.add(ambientLight);

        //添加雾气环境
        scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        var onMouseMove = function(event) {
            mouse.x = event.clientX / window.innerWidth * 2 - 1
            mouse.y = event.clientY / window.innerHeight * 2 + 1
        }

        var gui = new dat.GUI();
        var control = new Control();
        gui.add(control, 'rotationSpeed', 0, 0.5);
        gui.add(control, 'cameraX', -100, 100);
        gui.add(control, 'cameraY', -100, 100);
        gui.add(control, 'cameraZ', -100, 100);
        gui.add(control, 'runningSpeed', 1, 5);
        gui.add(control, 'addRotateCube');

        var render = function() {
            stats.update();

            // raycaster.set(mouse, camera);
            // var intersects = raycaster.intersectObjects(scene.children);
            // for (var i = 0; i < intersects.length; ++i) {
            //     intersects[i].object.material.color.set(0xff00000);
            // }

            setCameraPosition(control, scene, camera);
            camera.lookAt(scene.position);            
            control.rotate();

            cube.rotation.x += control.rotationSpeed;
            cube.rotation.y += control.rotationSpeed;
            cube.rotation.z += control.rotationSpeed;
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            effect.render(scene, camera);
        };

        window.addEventListener('mousemove', onMouseMove, false)

        createWorld();
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
        this.cameraX = 0;
        this.cameraY = -40;
        this.cameraZ = 30;
        this.rotateRadius = 30;
        this.cubes = [];
        this.angle = 0;

        this.addRotateCube = function() {
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
        }
    }

    // Control.prototype = {

    function setCameraPosition(control, scene, camera) {
        camera.position.x = control.cameraX;
        camera.position.y = control.cameraY;
        camera.position.z = control.cameraZ;
        // camera.lookAt(scene.position);
    }
};

function runDemo2() {
    var demo3 = new MyScene();
    demo3.show('#demo3-output');
    demo3.render();
}

$(function() {
    runDemo1();
    runDemo2();
});

