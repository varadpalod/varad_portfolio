import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Anchor, Cap, Solid, useAnchor } from './primitives.jsx'
import { EMAIL } from '../data.js'
import { playKey } from '../audio.js'

/* The big yellow Enter key from the hero returns as a mailto button. */
function EnterKey() {
  const group = useRef()
  const anchor = useAnchor()
  useFrame(({ pointer, clock }, dt) => {
    const g = group.current
    if (!g) return
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -0.15 + pointer.y * 0.12 + anchor.ny * 0.1, 4, dt)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.35 + pointer.x * 0.25, 4, dt)
    g.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.06
  })
  return (
    <group ref={group}>
      <Cap
        w={2.18}
        h={3}
        face="#ffe446"
        base="#eab800"
        letter="LET’S TALK"
        vertical
        letterSize={0.62}
        onDown={() => playKey(9)}
        onPress={() => {
          window.location.href = `mailto:${EMAIL}`
        }}
      />
    </group>
  )
}

function Floaters() {
  const box = useAnchor()
  const holder = useRef()
  useFrame(() => {
    if (holder.current) holder.current.visible = box.px > 0
  })
  const caps = [
    { l: 'S', face: '#ffb7d5', base: '#d94f8a', p: [-1.9, 1.35, 0.4], r: [0.2, 0.4, -0.2] },
    { l: 'D', face: '#b9f2df', base: '#2caa85', p: [-2.1, -0.2, -0.3], r: [-0.2, 0.5, 0.15] },
    { l: 'E', face: '#a9ddff', base: '#3886c9', p: [-1.7, -1.5, 0.2], r: [0.3, -0.3, 0.2] }
  ]
  return (
    <group ref={holder}>
      {caps.map((c, i) => (
        <Float key={i} speed={1.6 + i * 0.3} floatIntensity={1.4} rotationIntensity={0.5}>
          <group position={c.p} rotation={c.r}>
            <Cap w={0.95} h={0.95} face={c.face} base={c.base} letter={c.l} letterSize={0.42} />
          </group>
        </Float>
      ))}
      <Float speed={1.2} floatIntensity={1.2}>
        <Solid geo="torusGeometry" args={[0.34, 0.12, 24, 48]} color="#c8b6ff" position={[1.9, 1.5, 0.2]} />
      </Float>
      <Float speed={1.8} floatIntensity={1.2}>
        <Solid geo="icosahedronGeometry" args={[0.26, 0]} color="#ffd98e" position={[1.85, -1.4, 0.2]} />
      </Float>
    </group>
  )
}

export default function ContactScene() {
  return (
    <Anchor id="enter-anchor" width={4.4}>
      <Floaters />
      <EnterKey />
    </Anchor>
  )
}
