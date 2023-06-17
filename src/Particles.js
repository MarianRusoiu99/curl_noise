import * as THREE from "three";
import { useMemo, useState, useRef } from "react";
import { createPortal, useFrame } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import "./shaders/simulationMaterial";
import "./shaders/dofPointsMaterial";
import mp3 from "./Audio/a.mp3";

import { suspend } from "suspend-react";


export function Particles() {
  const size = 512;
  const focus = 6.1;
  const speed = 40;
  const aperture = 4.57;
  const fov = 95;
  const simRef = useRef();
  const renderRef = useRef();
  // Set up FBO
  const [scene] = useState(() => new THREE.Scene());
  let [camera] = useState(
    () => new THREE.OrthographicCamera(-1, 0, 1, -1, 1 / Math.pow(2, 53), 1)
  );
  // camera.position.set([0,0,1])
  const [positions] = useState(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ])
  );
  const [uvs] = useState(
    () => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
  );
  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
   
  });
  // Normalize points
  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);
  // Update FBO and pointcloud every frame

  async function createAudio(url) {
    // Fetch audio data and create a buffer source
    var audio = document.getElementById("audio");
    audio.src = url;
    audio.load();
    var res = await fetch(url);

    var buffer = await res.arrayBuffer();
    var context = new AudioContext(audio);

    var source = context.createMediaElementSource(audio);
    source.buffer = await new Promise((res) =>
      context.decodeAudioData(buffer, res)
    );
    source.connect(context.destination);
    audio.pause();

    console.log(source);

    var analyser = context.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);

    // The data array receive the audio frequencies
    var data = new Uint8Array(analyser.frequencyBinCount);
    return {
      context,
      source,
      data,
      // This function gets called every frame per audio source
      update: () => {
        analyser.getByteFrequencyData(data);
        // Calculate a frequency average

        return (data.avg = data.reduce(
          (prev, cur) => prev + cur / data.length,
          0
        ));
      },
    };
  }

  const { context, update } = suspend(() => createAudio(mp3), [mp3]);

  document.getElementById("btn").addEventListener("click", () => {
    context.resume();
    document.getElementById("audio").play();
    document.getElementById("btn").style.display = "none";
    console.log(audio);
  });

  useFrame((state) => {
    // console.log(400/update())
    state.gl.setRenderTarget(target);
    state.gl.clear();
    camera.rotateX += 100;
    state.gl.render(scene, camera);
    state.gl.setRenderTarget(null);
    renderRef.current.uniforms.positions.value = target.texture;
  
    renderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    renderRef.current.uniforms.uFocus.value = THREE.MathUtils.lerp(
      renderRef.current.uniforms.uFocus.value,
      update() / 49 + 2,
      0.8
    );
    renderRef.current.uniforms.uFov.value = THREE.MathUtils.lerp(
      renderRef.current.uniforms.uFov.value,
      update(),
      0.1
    );
    renderRef.current.uniforms.uBlur.value = THREE.MathUtils.lerp(
      renderRef.current.uniforms.uBlur.value,
      (4.6 - aperture) * 9,
  
      0.5
    );
  
  
    renderRef.current.uniforms.vColor.value = new THREE.Vector3(
      // THREE.MathUtils.lerp(
      //   0.1,
      //   0.3,
      //   1/simRef.current.uniforms.uCurlFreq.value),
      // THREE.MathUtils.lerp(
      //   0.4,
      //   0.7,
      //   2/simRef.current.uniforms.uTime.value*100),
      //   THREE.MathUtils.lerp(
      //     0.2,
      //     0.7,
      //     3/state.clock.elapsedTime))

      update()/140,update()/170,update()/140
    )
    simRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
    simRef.current.uniforms.uCurlFreq.value = THREE.MathUtils.lerp(
      simRef.current.uniforms.uCurlFreq.value,
      update() / 300 + 0.01,
      0.1
    );
  });

  return (
    <>
      {/* <CameraControler/>   */} {/* Simulation goes into a FBO/Off-buffer */}{" "}
      {createPortal(
        <mesh>
          <simulationMaterial ref={simRef} />{" "}
          <bufferGeometry >
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              
              itemSize={3}
            />{" "}
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />{" "}
          </bufferGeometry>{" "}
        </mesh>,
        scene
      )}{" "}
      {/* The result of which is forwarded into a pointcloud via data-texture */}{" "}
      <points
        rotateOnAxis={Math.PI / 2}
        scale={2}
        {...{
          focus,
          speed,
          aperture,
          fov,
        
        }}
      >
        <ambientLight  />
         <dofPointsMaterial  ref={renderRef} />{" "}
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />{" "}
        </bufferGeometry>{" "}
      </points>
    </>
  );
}
