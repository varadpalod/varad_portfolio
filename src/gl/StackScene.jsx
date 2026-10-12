import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Anchor, Cap, useAnchor } from './primitives.jsx'
import { STACK, STACK_CATS, stackCols } from '../data.js'
import { reduceMotion, useUI } from '../store.js'
import { playKey } from '../audio.js'

/* Toolkit chips: a grid of floating keycaps. Clicking one (or a category button in
 * the DOM) lights up that category and shrinks the rest. */
function Chips() {
  const anchor = useAnchor()
  const refs = useRef([])

  useFrame(({ clock }, dt) => {
    if (anchor.px <= 0) return
    const cols = stackCols(anchor.px)
    const rows = Math.ceil(STACK.length / cols)
    const cw = anchor.w / cols
    const ch = anchor.h / rows
    const size = Math.min(cw / 2.0, ch / 1.4)
    const filter = useUI.getState().stackFilter
    const t = reduceMotion ? 0 : clock.elapsedTime

    STACK.forEach((item, i) => {
      const g = refs.current[i]
      if (!g) return
      const c = i % cols
      const r = Math.floor(i / cols)
      const inRow = r === rows - 1 ? STACK.length - r * cols : cols
      const x = (c + (cols - inRow) / 2 - (cols - 1) / 2) * cw
      const y = ((rows - 1) / 2 - r) * ch + Math.sin(t * 1.3 + i * 0.8) * 0.045 * ch
      const active = filter === 'All' || item.cat === filter
      const target = size * (filter === 'All' ? 1 : active ? 1.14 : 0.74)

      g.position.set(x, y, active && filter !== 'All' ? 0.5 : 0)
      g.rotation.z = Math.sin(t * 0.9 + i) * 0.035
      const s = THREE.MathUtils.damp(g.scale.x, target, 8, dt)
      g.scale.setScalar(s)
    })
  })

  return (
    <>
      {STACK.map((item, i) => {
        const colors = STACK_CATS[item.cat]
        const size = Math.min(0.34, 1.25 / (item.name.length * 0.62))
        return (
          <group key={item.name} ref={(el) => (refs.current[i] = el)}>
            <Cap
              w={1.6}
              h={1.1}
              face={colors.face}
              base={colors.base}
              letter={item.name}
              letterSize={size}
              onDown={() => playKey(i, true)}
              onPress={() => {
                const s = useUI.getState()
                s.setStackFilter(s.stackFilter === item.cat ? 'All' : item.cat)
              }}
            />
          </group>
        )
      })}
    </>
  )
}

export default function StackScene() {
  return (
    <Anchor id="stack-anchor" fill>
      <Chips />
    </Anchor>
  )
}
