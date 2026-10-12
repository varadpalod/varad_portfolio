import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import HeroScene from './HeroScene.jsx'
import WorkScene from './WorkScene.jsx'
import ProcessScene from './ProcessScene.jsx'
import StackScene from './StackScene.jsx'
import ContactScene from './ContactScene.jsx'
import { useUI } from '../store.js'

/** Fires once the fonts are loaded, shaders compiled and a few frames are drawn. */
function Ready() {
  const frames = useRef(0)
  const done = useRef(false)
  useFrame(({ clock }) => {
    if (done.current) return
    frames.current += 1
    if (frames.current > 18) {
      done.current = true
      useUI.getState().setReady(clock.elapsedTime)
    }
  })
  return null
}

export default function Scene() {
  const dark = useUI((s) => s.theme) === 'dark'
  return (
    <Canvas
      className="gl"
      flat
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], fov: 40, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
    >
      {/* Dark mode: less fill light so the pastel keys read as glowing candy against the night background. */}
      <ambientLight intensity={dark ? 0.55 : 0.85} color={dark ? '#d9defc' : '#ffffff'} />
      <directionalLight position={[4, 6, 8]} intensity={dark ? 1.0 : 1.1} color={dark ? '#fff1fa' : '#ffffff'} />
      <Suspense fallback={null}>
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={dark ? 1.1 : 1.6} position={[0, 5, 6]} scale={[12, 5, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1} position={[-6, 1, 4]} scale={[3, 8, 1]} color="#ffd6ea" />
          <Lightformer form="rect" intensity={1} position={[6, 0, 4]} scale={[3, 8, 1]} color="#d6dcff" />
          <Lightformer form="ring" intensity={0.8} position={[0, -4, 5]} scale={5} color="#ffffff" />
        </Environment>
        <HeroScene />
        <WorkScene />
        <ProcessScene />
        <StackScene />
        <ContactScene />
        <Ready />
      </Suspense>
    </Canvas>
  )
}
