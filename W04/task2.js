function main()
{
    document.addEventListener('mousedown', mouse_down_event);
    
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );

    var light = new THREE.PointLight();
    light.position.set( 1, 1, 1 );
    scene.add( light );

    var light2 = new THREE.PointLight();
    light2.position.set( -1, -1, 1);
    scene.add( light2 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var vertices = [
        [ -1/2,  1/2, 1/2 ], // v0
        [ -1/2, -1/2, 1/2 ], // v1
        [  1/2, -1/2, 1/2 ], // v2
	[  1/2,  1/2, 1/2 ], // v3
	[ -1/2,  1/2, -1/2 ], // v4
        [ -1/2, -1/2, -1/2 ], // v5
        [  1/2, -1/2, -1/2 ], // v6
	[  1/2,  1/2, -1/2 ], // v7
    ];

    var v0 = new THREE.Vector3().fromArray( vertices[0] );
    var v1 = new THREE.Vector3().fromArray( vertices[1] );
    var v2 = new THREE.Vector3().fromArray( vertices[2] );
    var v3 = new THREE.Vector3().fromArray( vertices[3] );
    var v4 = new THREE.Vector3().fromArray( vertices[4] );
    var v5 = new THREE.Vector3().fromArray( vertices[5] );
    var v6 = new THREE.Vector3().fromArray( vertices[6] );
    var v7 = new THREE.Vector3().fromArray( vertices[7] );

    var f0 = new THREE.Face3( 0, 1, 3 );
    var f1 = new THREE.Face3( 1, 2, 3 );
    var f2 = new THREE.Face3( 0, 7, 4 );
    var f3 = new THREE.Face3( 0, 3, 7 );
    var f4 = new THREE.Face3( 0, 4, 5 );
    var f5 = new THREE.Face3( 0, 5, 1 );
    var f6 = new THREE.Face3( 2, 7, 3 );
    var f7 = new THREE.Face3( 2, 6, 7 );
    var f8 = new THREE.Face3( 2, 1, 5 );
    var f9 = new THREE.Face3( 2, 5, 6 );
    var f10 = new THREE.Face3( 4, 7, 6 );
    var f11 = new THREE.Face3( 4, 6, 5 );

    //near aspect
    var geometry = new THREE.Geometry();
    geometry.vertices.push( v0 );
    geometry.vertices.push( v1 );
    geometry.vertices.push( v2 );
    geometry.vertices.push( v3 );
    geometry.vertices.push( v4 );
    geometry.vertices.push( v5 );
    geometry.vertices.push( v6 );
    geometry.vertices.push( v7 );
    
    geometry.faces.push( f0 );
    geometry.faces.push( f1 );
    geometry.faces.push( f2 );
    geometry.faces.push( f3 );
    geometry.faces.push( f4 );
    geometry.faces.push( f5 );
    geometry.faces.push( f6 );
    geometry.faces.push( f7 );
    geometry.faces.push( f8 );
    geometry.faces.push( f9 );
    geometry.faces.push( f10 );
    geometry.faces.push( f11 );

    var material = new THREE.MeshLambertMaterial();
    material.vertexColors = THREE.FaceColors;

    for(n=0;n<12;n++){
	geometry.faces[n].color = new THREE.Color( 1, 1, 1);
    }

    geometry.computeFaceNormals();
    
    material.side = THREE.FrontSide;
    var triangle = new THREE.Mesh( geometry, material );
    
    scene.add( triangle );

    loop();

    function loop()
    {
        triangle.rotation.x += 0.003;
        triangle.rotation.y += 0.003;
        renderer.render( scene, camera );
	requestAnimationFrame( loop );
    }

    function mouse_down_event(event)
    {
	var x_win = event.clientX;
	var y_win = event.clientY;

	var vx = renderer.domElement.offsetLeft;
	var vy = renderer.domElement.offsetTop;
	var vw = renderer.domElement.width;
	var vh = renderer.domElement.height;

	var x_NDC = 2 * (x_win - vx) / vw - 1;
	var y_NDC = - (2 * (y_win - vy) / vh - 1);

	var mouse = new THREE.Vector2(x_NDC, y_NDC);
	
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse,camera);
	var intersects = raycaster.intersectObject(triangle);
	if(intersects.length > 0)
	{
	    intersects[0].face.color.setRGB(1,0,0);
	    intersects[0].object.geometry.colorsNeedUpdate = true;
	}
    }
}
