import './main.scss';
$(() => {
  //  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  $('#infoBox').css({
    background: 'rgba(255,255,255,0.5)'
  },).dialog({
    autoOpen: false,
    show: {
      effect: 'fade',
      duration: 500
    },
    hide: {
      effect: 'fade',
      duration: 500
    }
  });
  function show(item) {
    $('.content').html(`你點擊了${item.object.name}`)
    $('#infoBox').dialog('open');
  }

  let container,
    stats,
    controls;
  let camera,
    scene,
    renderer,
    projector,
    targetList = [],
    light,
    height,
    width
    ;
  init();
  animate();
  function init() {
    height = window.innerHeight;
    width = window.innerWidth;
    const container = document.getElementById('container');

    scene = new THREE.Scene();
    var light = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
    scene.add(light)
    // var plight = new THREE.PointLight(new THREE.Color('rgb(255,255,255)'), 1, 100);
    // plight
    //   .position
    //   .set(10, 10, 30);
    // scene.add(plight);
    //可視範圍default:50,60~90 , aspect render比例 , near 從多近的距離開始render , far 能看到多遠
    camera = new THREE.PerspectiveCamera(45, width / height,0.1, 800);
    camera
      .position
      .set(10, 10, 30);
    camera.lookAt(scene.position)
    controls = new THREE.OrbitControls(camera);
    controls
      .target
      .set(0, -0.2, -0.2);
    controls.update();
    const loader = new THREE.GLTFLoader();
    loader.load('demo.glb', (gltf) => {
      gltf
        .scene
        .traverse((child) => {
          // console.log(child);
          if (child.type === 'Mesh' && (child.name==='Desktop3_1'||child.name=='Chair03')) {
            console.log(child);
            targetList.push(child)
            for (let i = 0; i < child.children.length; i++) {
              targetList.push(child.children[i]);
            }
          }
        });
      scene.add(gltf.scene);
    });
    renderer = new THREE.WebGLRenderer({antialias:true,alpha: true});
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
   
    projector = new THREE.Projector();

    // when the mouse moves, call the given function
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    // stats = new Stats(); container.appendChild(stats.dom);
  }
  function onDocumentMouseDown(event) {
    //https://blog.csdn.net/qq_30100043/article/details/79054862
    event.preventDefault();
    var raycaster = new THREE.Raycaster(); // create once
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX /renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    // create an array containing all objects in the scene with which the ray
    // intersects
    var intersects = raycaster.intersectObjects( scene.children, true );
    // var intersects = raycaster.intersectObjects( targetList, true );
    // if there is one (or more) intersections
    if (intersects.length > 0) {
      let child = intersects[0].object;
      if((child.name==='Desktop3_1'||child.name=='Chair03')){
        show(intersects[0])
        console.log('child')
        console.log(child)
      }
    }
  }
  function toString(v) {
    return `[ ${v.x}, ${v.y}, ${v.z} ]`;
  }
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // stats.update();
  }
  function onWindowResize() {
    // camera.aspect = window.innerWidth / window.innerHeight;
    // camera.updateProjectionMatrix();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    var aspect = window.innerWidth / window.innerHeight;
    camera.left   = - frustumSize * aspect / 2;
    camera.right  =   frustumSize * aspect / 2;
    camera.top    =   frustumSize / 2;
    camera.bottom = - frustumSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

  }
});
