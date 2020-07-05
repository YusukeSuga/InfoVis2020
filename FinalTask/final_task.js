function main()
{
    var volume = new KVS.LobsterData();
    var screen = new KVS.THREEScreen();

    //color map
    var cmap = [];
    for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0; // [0,1]
        var R = Math.max( Math.cos( (S - 1.0) * Math.PI ), 0.0 );
        var G = Math.max( Math.cos( (S - 0.5) * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
   
    var sw_shader = 0;    //0:gouraud     1:phong
    var sw_ref = 0;       //0:Lambertian  1:Phong

    screen.init(volume, {
        width: window.innerWidth * 0.6,
        height: window.innerHeight,
        targetDom: document.getElementById('display'),
        enableAutoResize: false
    });
    setup();
    screen.loop();

    function setup()
    {
        var color = new KVS.Vec3( 0, 0, 0 );
        var box = new KVS.BoundingBox();
        box.setColor( color );
        box.setWidth( 2 );

        var smin = volume.min_value;
        var smax = volume.max_value;
        var isovalue = KVS.Mix( smin, smax, 0.5 );    
        var mat_color = KVS.Mix( smin, smax, 0.5 );  
	var ka_value = KVS.Mix( 0, 100, 0.5 );
	var kd_value = KVS.Mix( 0, 100, 0.5 );
	var ks_value = KVS.Mix( 0, 100, 0.5 );
	var n_value = KVS.Mix( 0, 200, 0.25 );

        document.getElementById('label_iso').innerHTML = "Isovalue: " + Math.round( isovalue ) + "<br>";
        document.getElementById('label_col').innerHTML = "Color: " + Math.round( mat_color )+ "<br>";
	document.getElementById('label_ka').innerHTML = "Ambient Reflection: " + Math.round( ka_value )/100 + "<br>";
	document.getElementById('label_kd').innerHTML = "Diffuse Reflection: " + Math.round( ka_value )/100 + "<br>";
	document.getElementById('label_ks').innerHTML = "Specular Reflection: " + Math.round( ka_value )/100 + "<br>";
	document.getElementById('label_n').innerHTML = "Shininess Exponent: " + Math.round(n_value) + "<br>";

        var line = KVS.ToTHREELine( box.exec( volume ) );
        screen.scene.add( line );

        var surfaces = Isosurfaces( volume, isovalue, mat_color, cmap, sw_shader, sw_ref, ka_value, kd_value, ks_value, n_value );
        screen.scene.add( surfaces );

        /** isovalueに関するスライダーの値 **/
        document.getElementById('isovalue')
        .addEventListener('mousemove', function() {
            var value = +document.getElementById('isovalue').value;
            isovalue = KVS.Mix( smin, smax, value );
            document.getElementById('label_iso').innerHTML = "Isovalue: " + Math.round( isovalue ) + "<br>";
        });
        /********************************/

        /** colorに関するスライダーの値    **/
        document.getElementById('color')
        .addEventListener('mousemove', function() {
            var c_value = +document.getElementById('color').value;
            mat_color = KVS.Mix( smin, smax, c_value );
            document.getElementById('label_col').innerHTML = "Color: " + Math.round( mat_color ) + "<br>";
        });
        /********************************/

	/** ambientに関するスライダーの値    **/
        document.getElementById('ambient')
        .addEventListener('mousemove', function() {
            var a_value = +document.getElementById('ambient').value;
            ka_value = KVS.Mix( 0, 100, a_value );
            document.getElementById('label_ka').innerHTML = "Ambient Reflection: " + Math.round( ka_value )/100 + "<br>";
        });
        /********************************/

	/** diffuseに関するスライダーの値    **/
        document.getElementById('diffuse')
            .addEventListener('mousemove', function() {
		var d_value = +document.getElementById('diffuse').value;
		kd_value = KVS.Mix( 0, 100, d_value );
		document.getElementById('label_kd').innerHTML = "Diffuse Reflection: " + Math.round( kd_value )/100 + "<br>";
            });
        /********************************/

	/** specularに関するスライダーの値    **/
        document.getElementById('specular')
            .addEventListener('mousemove', function() {
		var s_value = +document.getElementById('specular').value;
		ks_value = KVS.Mix( 0, 100, s_value );
		document.getElementById('label_ks').innerHTML = "Specular Reflection: " + Math.round( ks_value )/100 + "<br>";
            });
        /********************************/

	/** shininessに関するスライダーの値    **/
        document.getElementById('shininess')
            .addEventListener('mousemove', function() {
		var shine_value = +document.getElementById('shininess').value;
		n_value = KVS.Mix( 0, 200, shine_value );
		document.getElementById('label_n').innerHTML = "Shininess Exponent: " + Math.round( n_value ) + "<br>";
            });
        /********************************/

        /***** Applyの適用 *****/
        document.getElementById('change-status-button')
        .addEventListener('click', function() {
            screen.scene.remove( surfaces );
            ///isovalue///
            var value = +document.getElementById('isovalue').value;
            var isovalue = KVS.Mix( smin, smax, value );
            //////////////

            ///color///
            c_value = +document.getElementById('color').value;
            var mat_color = KVS.Mix( smin, smax, c_value );
            ///////////

            /*** shaderとrefrectionの設定 ***/
            //shaderの選択
            var radios = document.getElementsByName("shader");

            var result;
            for(var i=0; i<radios.length; i++){
                if (radios[i].checked) {
                    //選択されたラジオボタンのvalue値を取得する
                    result = radios[i].value;
                    break;
                }
            }

            if(result=="gouraud"){
                sw_shader = 0;
            }else if (result == "phong") {
                sw_shader = 1;
            }

            //reflectionの選択
            radios = document.getElementsByName("reflection");

            //var result;
            for(var i=0; i<radios.length; i++){
                if (radios[i].checked) {
                    //選択されたラジオボタンのvalue値を取得する
                    result = radios[i].value;
                    break;
                }
            }
            if(result=="Lambertian"){
                sw_ref = 0;
            }else if (result == "Phong") {
                sw_ref = 1;
            }else if (result == "BlinnPhong"){
		sw_ref = 2;
	    }else if (result == "CookTorrance"){
		sw_ref = 3;
	    }

            /*******************************/

	    ///ambient///
            a_value = +document.getElementById('ambient').value;
            var ka_value = KVS.Mix( 0, 100, a_value );
            ///////////

	    ///diffuse///
            d_value = +document.getElementById('diffuse').value;
            var kd_value = KVS.Mix( 0, 100, d_value );
            ///////////

	    ///specular///
            s_value = +document.getElementById('specular').value;
            var ks_value = KVS.Mix( 0, 100, s_value );
            ///////////

	    ///specular///
            shine_value = +document.getElementById('shininess').value;
            var n_value = KVS.Mix( 0, 100, shine_value );
            ///////////

            surfaces = Isosurfaces( volume, isovalue, mat_color, cmap, sw_shader, sw_ref, ka_value, kd_value, ks_value, n_value);
            screen.scene.add( surfaces );
        });
        /**********************/

	

        document.addEventListener( 'mousemove', function() {
            screen.light.position.copy( screen.camera.position );
        });

	/*
        window.addEventListener('resize', function() {
            screen.resize([
                window.innerWidth * 0.6,
                window.innerHeight
            ]);
        });
	*/

        screen.draw();
    }
}
