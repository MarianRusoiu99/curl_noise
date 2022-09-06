import * as THREE from 'three'
import { useMemo, useState, useRef,Suspense,useEffect } from 'react'
import { createPortal, useFrame, Canvas, Camera , useThree} from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import './shaders/simulationMaterial'
import './shaders/dofPointsMaterial'
import mp3 from "./Audio/a.mp3";
import { suspend } from 'suspend-react'
export function Particles({ speed, fov, aperture, focus, curl, size = 512, ...props }) {

  const simRef = useRef()
  const renderRef = useRef()
  // Set up FBO
  const [scene] = useState(() => new THREE.Scene())
  let [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1))
  const [positions] = useState(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]))
  const [uvs] = useState(() => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]))
  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  })
  // Normalize points
  const particles = useMemo(() => {
    const length = size * size
    const particles = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      let i3 = i * 3
      particles[i3 + 0] = (i % size) / size
      particles[i3 + 1] = i / size / size
    }
    return particles
  }, [size])
  // Update FBO and pointcloud every frame

  
   async function createAudio(url) {
    // Fetch audio data and create a buffer source
    var res = await fetch(url)
    var audio = document.getElementById("audio");
   audio.src = url
   audio.load();
    console.log(audio)
    //  var src = context.createMediaElementSource(audio);
    var buffer = await res.arrayBuffer()
    var context = new AudioContext();
    var source = context.createBufferSource()
    source.buffer = await new Promise((res) => context.decodeAudioData(buffer, res))
    source.loop = true

    source.start(0)
    // res.play()
    // context.resume()
    // Create gain node and an analyser
    // const gain = context.createGain()
    var analyser = context.createAnalyser()
    analyser.fftSize = 64
    source.connect(analyser)
    // analyser.connect(gain)
    
    // The data array receive the audio frequencies
    var data = new Uint8Array(analyser.frequencyBinCount)
    return {
      context,
      source,
      // gain,
      data,
      // This function gets called every frame per audio source
      update: () => {
        analyser.getByteFrequencyData(data)
        // Calculate a frequency average
        
        return (data.avg = data.reduce((prev, cur) => prev + cur / data.length, 0))
      },
    }
  }
const norm = function(val, max, min) { return (val - min) / (max - min); }
const { gain, context, update, data } = suspend(() => createAudio(mp3), [mp3])
// useEffect(()=>{
  window.addEventListener("click" , () => {
    // createAudio(mp3).then((audio)=>{console.log(audio) })
   
    context.resume()
    // context.play()
    curl = norm(update(),0.9,0.1)
    // console.log(curl)
    console.log(context)
    audio.play()
  
  // })



},[])

  
  useFrame((state) => {
    console.log(update()/250)
    state.gl.setRenderTarget(target)
    state.gl.clear()
    state.gl.render(scene, camera)
    state.gl.setRenderTarget(null)
    renderRef.current.uniforms.positions.value = target.texture
    renderRef.current.uniforms.uTime.value = state.clock.elapsedTime
    renderRef.current.uniforms.uFocus.value = THREE.MathUtils.lerp(renderRef.current.uniforms.uFocus.value, focus, 0.1)
    renderRef.current.uniforms.uFov.value = THREE.MathUtils.lerp(renderRef.current.uniforms.uFov.value, fov, 0.1)
    renderRef.current.uniforms.uBlur.value = THREE.MathUtils.lerp(renderRef.current.uniforms.uBlur.value, (5.6 - aperture) * 9, 0.1)
    simRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed
    simRef.current.uniforms.uCurlFreq.value = THREE.MathUtils.lerp(simRef.current.uniforms.uCurlFreq.value, update()/250, 0.1)
  })
  
  return (
    <>
    
 
    
      {/* Simulation goes into a FBO/Off-buffer */}
      {createPortal(
        <mesh >
          <simulationMaterial ref={simRef} />
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-uv" count={uvs.length / 2} array={uvs} itemSize={2} />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      {/* The result of which is forwarded into a pointcloud via data-texture */}
      <points {...props}>
        <dofPointsMaterial ref={renderRef} />
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
        </bufferGeometry>
      </points>
   
    </>
  )
}
