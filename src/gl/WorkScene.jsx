import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text, useCursor } from '@react-three/drei'
import { Anchor, Block, FONT, INK, Slab, useAnchor } from './primitives.jsx'
import { PROJECTS } from '../data.js'
import { useUI } from '../store.js'
import { playKey } from '../audio.js'

/* Everything below is authored on a 5.2 x 4.3 board (the box anchor's aspect). */
const FOLDER_W = 3.9
const FOLDER_H = 2.5
const STEP_Y = 0.28
const STEP_Z = 0.42

function Folder({ project, index }) {
  const group = useRef()
  const [hover, setHover] = useState(false)
  useCursor(hover)

  const baseY = -0.53 + index * STEP_Y
  const baseZ = 0.52 - index * STEP_Z
  const tabX = -1.1 + index * 0.73

  useFrame((_, dt) => {
    const hp = useUI.getState().hoverProject
    const raise = hp === null ? 0 : hp === index ? 0.5 : 0.15
    if (group.current) group.current.position.y = THREE.MathUtils.damp(group.current.position.y, baseY + raise, 9, dt)
  })

  const enter = (e) => {
    e.stopPropagation()
    setHover(true)
    useUI.getState().setHoverProject(index)
  }
  const leave = () => {
    setHover(false)
    if (useUI.getState().hoverProject === index) useUI.getState().setHoverProject(null)
  }

  return (
    <group
      ref={group}
      position={[0, baseY, baseZ]}
      onPointerOver={enter}
      onPointerOut={leave}
      onClick={(e) => {
        e.stopPropagation()
        playKey(index + 3, true)
        useUI.getState().openCase(index)
      }}
    >
      <Slab w={FOLDER_W} h={FOLDER_H} r={0.14} d={0.07} color={project.folder} outline={0.03} />
      <Slab w={1.72} h={0.34} r={0.12} d={0.07} color={project.folder} outline={0.03} position={[tabX, FOLDER_H / 2 + 0.1, 0]} />
      <Text
        font={FONT}
        fontSize={0.125}
        color={INK}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        position={[tabX, FOLDER_H / 2 + 0.1, 0.1]}
      >
        {project.folderLabel}
      </Text>
    </group>
  )
}

function ArchiveBox() {
  const group = useRef()
  const anchor = useAnchor()

  useFrame(({ pointer }, dt) => {
    const g = group.current
    if (!g) return
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.3 + pointer.y * -0.08 - anchor.ny * 0.1, 4, dt)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.28 + pointer.x * 0.16, 4, dt)
  })

  const kraft = '#d9a766'
  const kraftDark = '#c4924f'

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      {/* box shell */}
      <Block args={[4.6, 0.12, 2.0]} color={kraftDark} position={[0, -1.84, 0]} />
      <Block args={[4.6, 2.4, 0.12]} color={kraftDark} position={[0, -0.58, -0.94]} />
      <Block args={[0.12, 2.0, 2.0]} color={kraft} position={[-2.24, -0.78, 0]} />
      <Block args={[0.12, 2.0, 2.0]} color={kraft} position={[2.24, -0.78, 0]} />

      {PROJECTS.map((p, i) => (
        <Folder key={p.num} project={p} index={i} />
      ))}

      {/* front wall with label plate */}
      <Block args={[4.6, 1.6, 0.12]} color={kraft} position={[0, -0.98, 0.94]} />
      <Slab w={2.1} h={0.56} r={0.28} d={0.05} color="#fff7e6" outline={0.025} position={[0, -1.02, 1.03]}>
        <Text font={FONT} fontSize={0.24} color={INK} anchorX="center" anchorY="middle" letterSpacing={0.08} position={[0, 0, 0.07]}>
          MY WORKS
        </Text>
      </Slab>
    </group>
  )
}

export default function WorkScene() {
  return (
    <Anchor id="box-anchor" width={5.2}>
      <ArchiveBox />
    </Anchor>
  )
}
