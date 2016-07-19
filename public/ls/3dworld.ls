#    > Author: William
#    > Email: williamjwking@gmail.com


$ !->
    if window.location.pathname is '/lab/threejs'
        scene = new THREE.Scene!
        camera = new THREE.PerspectiveCamera 75, window.inner-width / window.inner-height, 0.1, 1000
        renderer = new THREE.WebGLRenderer!
        create-world = !->
            renderer.set-size window.inner-width, window.inner-height
            $ '#3d-canvas' .append renderer.dom-element

        geometry = new THREE.CubeGeometry 100, 100, 100
        material = new THREE.MeshBasicMaterial {color: 0x234300}
        cube = new THREE.Mesh geometry, material
        scene.add cube

        raycaster = new THREE.Raycaster!
        mouse = new THREE.Vector2!
        on-mouse-move = (event)!->
            mouse.x = event.client-x / window.inner-width * 2 - 1
            mouse.y = event.client-y / window.innerHeight * 2 + 1


        camera.position.z = 5
        render = !->

            raycaster.set mouse, camera
            intersects = raycaster.intersect-objects scene.children

            for i from 0 to intersects.length - 1 by 1
                intersects[i].object.material.color.set 0xff00000

            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
            request-animation-frame render
            renderer.render scene, camera

        window.add-event-listener 'mousemove', on-mouse-move, false

        create-world!
        render!


