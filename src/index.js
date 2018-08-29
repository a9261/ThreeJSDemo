import './main.scss';

$(() => {
  //  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  $('#btn').on('click', () => {
    show();
  });
  $('#infoBox')
    .css(
      {
        background: 'rgba(255,255,255,0.5)',
      },
    )
    .dialog({
      autoOpen: false,
      show: { effect: 'fade', duration: 500 },
      hide: { effect: 'fade', duration: 500 },
    });
  function show() {
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
    mouse = { x: 0, y: 0 },
    light;
  init();
  animate();
  function init() {
    let height = window.innerHeight;
    let width = window.innerWidth;
    const container = document.getElementById('container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xff0000);
    light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    light.position.set(0, 100, 0);
    scene.add(light);
    const pLight = new THREE.PointLight(0xffffff);
    pLight.position.set(0, 250, 0);
    scene.add(pLight);

    camera = new THREE.PerspectiveCamera(45,
      width / height, 0.1, 800);
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
      console.log(gltf);
      gltf
        .scene
        .traverse((child) => {
          console.log(child);
          if (child.type === 'Group') {
            for (let i = 0; i < child.children.length; i++) {
              targetList.push(child.children[i]);
            }
          }
          // if (child.isMesh) {
          //     child.material.envMap = envMap;
          // }
        });
      scene.add(gltf.scene);
    });

    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    projector = new THREE.Projector();
    // when the mouse moves, call the given function
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    // stats = new Stats();
    // container.appendChild(stats.dom);
  }
  function onDocumentMouseDown(event) {
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    // event.preventDefault();
    event.preventDefault();
    console.log('Click.');
    // update the mouse variable

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // find intersections
    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    const vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    projector.unprojectVector(vector, camera);
    const ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    // create an array containing all objects in the scene with which the ray intersects
    const intersects = ray.intersectObjects(targetList);
    console.log(intersects);
    // if there is one (or more) intersections
    if (intersects.length > 0) {
      console.log(`Hit @ ${toString(intersects[0].point)}`);
      // change the color of the closest face.
      //   intersects[0].face.color.setRGB(0.8 * Math.random() + 0.2, 0, 0);
      //   intersects[0].object.geometry.colorsNeedUpdate = true;
      show();
    }
  }
  function toString(v) { return `[ ${v.x}, ${v.y}, ${v.z} ]`; }
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // stats.update();
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});
