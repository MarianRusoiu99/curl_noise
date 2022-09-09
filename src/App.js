import React,{useState} from "react"


import  {Particles}  from './Particles'
import {  Canvas, render} from '@react-three/fiber'



export default function App() {


 
  render(<Particles />, document.querySelector('canvas'))
  return (
    <div className="App">
      
   
    <Canvas>
      {/* <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} zoomSpeed={0.1} />
      <CameraShake yawFrequency={1} maxYaw={0.05} pitchFrequency={1} maxPitch={0.05} rollFrequency={0.5} maxRoll={0.5} intensity={0.2} /> */}
    
      </Canvas>
    
    
    </div>
  )
}
