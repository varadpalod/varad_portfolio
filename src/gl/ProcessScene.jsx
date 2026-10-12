import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Anchor, Block, INK, Solid } from './primitives.jsx'
import { reduceMotion, useUI } from '../store.js'

/* Each icon lives in a 2 x 1.2 stage (the .p-stage banner of its card). */

function useHover(index, group) {
  useFrame(({ pointer, clock }, dt) => {
    const g = group.current
    if (!g) return
    const hovered = useUI.getState().hoverProcess === index
    const s = THREE.MathUtils.damp(g.scale.x, hovered ? 1.18 : 1, 8, dt)
    g.scale.setScalar(s)
    // gentle swing (never edge-on) that speeds up when the card is hovered
    const swing = reduceMotion ? 0 : Math.sin(clock.elapsedTime * (hovered ? 2.2 : 0.9) + index) * 0.55
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, swing + pointer.x * 0.3, 6, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.2 + pointer.y * -0.15, 4, dt)
  })
}

function Strut({ to }) {
  const q = useMemo(() => {
    const v = new THREE.Vector3(...to)
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize())
  }, [to])
  const len = Math.hypot(...to)
  return (
    <mesh quaternion={q} position={[to[0] / 2, to[1] / 2, to[2] / 2]}>
      <cylinderGeometry args={[0.035, 0.035, len, 8]} />
      <meshBasicMaterial color={INK} />
    </mesh>
  )
}

function Architect() {
  const g = useRef()
  useHover(0, g)
  const nodes = [
    { p: [0.8, 0.45, 0.2], c: '#a9ddff' },
    { p: [-0.8, 0.35, -0.25], c: '#ffd98e' },
    { p: [0.45, -0.55, -0.5], c: '#b9f2df' },
    { p: [-0.5, -0.5, 0.5], c: '#c8b6ff' }
  ]
  return (
    <group ref={g}>
      <Solid geo="sphereGeometry" args={[0.34, 32, 32]} color="#ff9ec6" />
      {nodes.map((n, i) => (
        <group key={i}>
          <Strut to={n.p} />
          <Solid geo="sphereGeometry" args={[0.17, 24, 24]} color={n.c} position={n.p} outline={0.08} />
        </group>
      ))}
    </group>
  )
}

function Gear({ teeth = 10, radius = 0.55, color, ...rest }) {
  return (
    <group {...rest}>
      <Solid geo="cylinderGeometry" args={[radius, radius, 0.28, 36]} color={color} rotation={[Math.PI / 2, 0, 0]} outline={0.05} />
      {Array.from({ length: teeth }, (_, i) => {
        const a = (i / teeth) * Math.PI * 2
        return (
          <Solid
            key={i}
            geo="boxGeometry"
            args={[0.26, 0.2, 0.28]}
            color={color}
            position={[Math.cos(a) * (radius + 0.07), Math.sin(a) * (radius + 0.07), 0]}
            rotation={[0, 0, a]}
            outline={0.1}
          />
        )
      })}
      <Solid geo="cylinderGeometry" args={[radius * 0.32, radius * 0.32, 0.34, 24]} color="#fff7e6" rotation={[Math.PI / 2, 0, 0]} outline={0.1} />
    </group>
  )
}

function Engineer() {
  const g = useRef()
  const big = useRef()
  const small = useRef()
  useHover(1, g)
  useFrame((_, dt) => {
    if (reduceMotion) return
    if (big.current) big.current.rotation.z += dt * 0.6
    if (small.current) small.current.rotation.z -= dt * 0.9
  })
  return (
    <group ref={g}>
      <group ref={big} position={[-0.25, 0.1, 0]}>
        <Gear teeth={12} radius={0.58} color="#7bdcb5" />
      </group>
      <group ref={small} position={[0.7, -0.5, 0]}>
        <Gear teeth={8} radius={0.34} color="#ffb7d5" />
      </group>
    </group>
  )
}

function Deploy() {
  const g = useRef()
  const ring = useRef()
  useHover(2, g)
  useFrame((_, dt) => {
    if (ring.current && !reduceMotion) ring.current.rotation.z += dt * 0.8
  })
  return (
    <group ref={g}>
      <Block args={[1.1, 0.34, 0.5]} color="#ffd98e" position={[0, -0.42, 0]} radius={0.05} />
      <Block args={[1.1, 0.34, 0.5]} color="#ffb7d5" position={[0.12, -0.05, 0]} radius={0.05} />
      <Block args={[1.1, 0.34, 0.5]} color="#a9ddff" position={[-0.1, 0.32, 0]} radius={0.05} />
      <group ref={ring} position={[0, -0.05, 0]} rotation={[1.2, 0, 0]}>
        <Solid geo="torusGeometry" args={[0.95, 0.05, 16, 64]} color="#2caa85" outline={0.2} />
      </group>
    </group>
  )
}

export default function ProcessScene() {
  return (
    <>
      <Anchor id="p3d-1" width={3.8}>
        <Float speed={1.5} floatIntensity={0.6} rotationIntensity={0.1}>
          <Architect />
        </Float>
      </Anchor>
      <Anchor id="p3d-2" width={3.8}>
        <Float speed={1.5} floatIntensity={0.6} rotationIntensity={0.1}>
          <Engineer />
        </Float>
      </Anchor>
      <Anchor id="p3d-3" width={3.8}>
        <Float speed={1.5} floatIntensity={0.6} rotationIntensity={0.1}>
          <Deploy />
        </Float>
      </Anchor>
    </>
  )
}
