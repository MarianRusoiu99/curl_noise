import React, {useRef} from "react"
import { OrbitControls, CameraShake } from '@react-three/drei'
import { useControls } from 'leva'
import  {Particles}  from './Particles'
import { createPortal, useFrame, Canvas, render} from '@react-three/fiber'
import mp3 from "./Audio/a.mp3";
// import { AudioContext } from 'standardized-audio-context';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default function App() {


//   async function createAudio(url) {
//     // Fetch audio data and create a buffer source
//     const res = await fetch(url)
//     const buffer = await res.arrayBuffer()
//     const context = new (window.AudioContext || window.webkitAudioContext)()
//     const source = context.createBufferSource()
//     source.buffer = await new Promise((res) => context.decodeAudioData(buffer, res))
//     source.loop = true
//     // This is why it doesn't run in Safari 🍏🐛. Start has to be called in an onClick event
//     // which makes it too awkward for a little demo since you need to load the async data first
//     source.start(0)
//     console.log(source)
//     // Create gain node and an analyser
//     const gain = context.createGain()
//     const analyser = context.createAnalyser()
//     analyser.fftSize = 64
//     source.connect(analyser)
//     analyser.connect(gain)
//     // The data array receive the audio frequencies
//     const data = new Uint8Array(analyser.frequencyBinCount)
//     return {
//       context,
//       source,
//       gain,
//       data,
//       // This function gets called every frame per audio source
//       update: () => {
//         analyser.getByteFrequencyData(data)
//         // Calculate a frequency average
        
//         return (data.avg = data.reduce((prev, cur) => prev + cur / data.length, 0))
//       },
//     }
//   }
//   console.log(createAudio(mp3))
// var audio = createAudio(mp3)

  

  render(<Particles />, document.querySelector('canvas'))
  return (
    <>
    <Canvas camera={{ fov: 75, position: [0, 0, 6]}}>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} zoomSpeed={0.1} />
      <CameraShake yawFrequency={1} maxYaw={0.05} pitchFrequency={1} maxPitch={0.05} rollFrequency={0.5} maxRoll={0.5} intensity={0.2} />
      {/* <Particles  /> */}
      </Canvas>
    
    
    </>
  )
}
