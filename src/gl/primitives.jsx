import { createContext, createElement, useContext, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, useCursor } from '@react-three/drei'
import interUrl from '@fontsource/inter/files/inter-latin-800-normal.woff?url'

export const FONT = interUrl
export const INK = '#111111'

/* ------------------------------------------------------------------ *
 * Anchor: glues a 3D group to a DOM element. The camera never moves,
 * the group simply follows the element's bounding box every frame, so
 * the 3D scene scrolls, resizes and reflows exactly like the page.
 * ------------------------------------------------------------------ */
const AnchorCtx = createContext(null)
export const useAnchor = () => useContext(AnchorCtx)

export function Anchor({ id, width, fill = false, children }) {
  const group = useRef()
  const elRef = useRef(null)
  const state = useMemo(() => ({ w: 1, h: 1, px: 0, nx: 0, ny: 0 }), [])

  useFrame(({ camera, size }) => {
    if (!elRef.current || !elRef.current.isConnected) elRef.current = document.getElementById(id)
    const el = elRef.current
    if (!el || !group.current) return
    const r = el.getBoundingClientRect()
    const vw = size.width
    const vh = size.height
    const visible = r.bottom > -140 && r.top < vh + 140 && r.width > 0
    group.current.visible = visible
    if (!visible) return
    const unit = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z) / vh
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    group.current.position.set((cx - vw / 2) * unit, -(cy - vh / 2) * unit, 0)
    state.w = r.width * unit
    state.h = r.height * unit
    state.px = r.width
    state.nx = ((cx - vw / 2) / vw) * 2
    state.ny = ((cy - vh / 2) / vh) * 2
    if (!fill) group.current.scale.setScalar(state.w / width)
  })

  return (
    <AnchorCtx.Provider value={state}>
      <group ref={group} visible={false}>
        {children}
      </group>
    </AnchorCtx.Provider>
  )
}

/* ------------------------------------------------------------------ *
 * Rounded slab geometry (extruded rounded rectangle with a bevel).
 * Cached so the 10 keys and the folders share buffers.
 * ------------------------------------------------------------------ */
function roundedRectShape(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x + w, y + h - r)
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  s.lineTo(x + r, y + h)
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

const geoCache = new Map()
export function slabGeometry(w, h, r, d, bevel = 0.035) {
  const key = [w, h, r, d, bevel].map((n) => n.toFixed(3)).join('|')
  if (geoCache.has(key)) return geoCache.get(key)
  const radius = Math.max(0.01, Math.min(r - bevel, (Math.min(w, h) - 2 * bevel) / 2 - 0.002))
  const geo = new THREE.ExtrudeGeometry(roundedRectShape(w - 2 * bevel, h - 2 * bevel, radius), {
    depth: Math.max(0.002, d - 2 * bevel),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 20
  })
  geo.translate(0, 0, bevel)
  geoCache.set(key, geo)
  return geo
}

const candy = { roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.25 }

/** A flat rounded slab with a black inverted-hull outline. Extrudes toward +z. */
export function Slab({ w, h, r = 0.1, d = 0.1, color, outline = 0.035, children, ...rest }) {
  const body = slabGeometry(w, h, r, d)
  const hull = slabGeometry(w + outline * 2, h + outline * 2, r + outline, d + outline * 2)
  return (
    <group {...rest}>
      <mesh geometry={body}>
        <meshPhysicalMaterial color={color} {...candy} />
      </mesh>
      <mesh geometry={hull} position={[0, 0, -outline]}>
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </mesh>
      {children}
    </group>
  )
}

/** Rounded box with outline, used for the archive box walls. */
export function Block({ args, radius = 0.06, color, outline = 0.04, children, ...rest }) {
  const [w, h, d] = args
  return (
    <group {...rest}>
      <RoundedBox args={[w, h, d]} radius={radius} smoothness={4}>
        <meshPhysicalMaterial color={color} {...candy} />
      </RoundedBox>
      <RoundedBox args={[w + outline * 2, h + outline * 2, d + outline * 2]} radius={radius + outline} smoothness={4}>
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </RoundedBox>
      {children}
    </group>
  )
}

/** Generic primitive (sphere, torus, ...) with an outline hull. */
export function Solid({ geo, args, color, outline = 0.06, rough = 0.4, children, ...rest }) {
  return (
    <group {...rest}>
      <mesh>
        {createElement(geo, { args })}
        <meshPhysicalMaterial color={color} roughness={rough} clearcoat={0.5} clearcoatRoughness={0.3} />
      </mesh>
      {outline > 0 && (
        <mesh scale={1 + outline}>
          {createElement(geo, { args })}
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
      )}
      {children}
    </group>
  )
}

/* ------------------------------------------------------------------ *
 * Cap: the sculptural keycap. Base slab + raised face + hard shadow.
 * `auto` returns 0..1 for programmatic presses (the typing animation).
 * ------------------------------------------------------------------ */
export function Cap({
  w,
  h,
  face,
  base,
  letter,
  label,
  vertical = false,
  letterSize,
  textOffset = [0, 0],
  onPress,
  onDown,
  auto,
  onHoverChange,
  restZ = 0,
  ...rest
}) {
  const group = useRef()
  const faceRef = useRef()
  const [hover, setHover] = useState(false)
  const down = useRef(false)
  const press = useRef(0)
  useCursor(hover && !!onPress)

  const faceW = w - 0.2
  const faceH = h - 0.43
  const faceY = (0.33 - 0.1) / 2
  const size = letterSize ?? Math.min(w, h) * 0.46

  useFrame((_, dt) => {
    const target = Math.max(auto ? auto() : 0, down.current ? 1 : 0, hover ? 0.28 : 0)
    press.current = THREE.MathUtils.damp(press.current, target, 22, dt)
    if (group.current) group.current.position.z = restZ - press.current * 0.07
    if (faceRef.current) faceRef.current.position.z = 0.45 - press.current * 0.17
  })

  const over = (e) => {
    e.stopPropagation()
    setHover(true)
    onHoverChange?.(true)
  }
  const out = () => {
    setHover(false)
    down.current = false
    onHoverChange?.(false)
  }

  return (
    <group {...rest}>
      <group
        ref={group}
        onPointerOver={over}
        onPointerOut={out}
        onPointerDown={(e) => {
          e.stopPropagation()
          down.current = true
          onDown?.()
        }}
        onPointerUp={() => {
          down.current = false
        }}
        onClick={(e) => {
          e.stopPropagation()
          onPress?.()
        }}
      >
        {/* hard drop shadow */}
        <mesh geometry={slabGeometry(w, h, Math.min(0.38, h / 2.2), 0.02)} position={[0.07, -0.07, -0.04]}>
          <meshBasicMaterial color={INK} />
        </mesh>
        <Slab w={w} h={h} r={Math.min(0.38, h / 2.2)} d={0.45} color={base} outline={0.03} />
        <group ref={faceRef} position={[0, faceY, 0.45]}>
          <Slab w={faceW} h={faceH} r={Math.min(0.29, faceH / 2.2)} d={0.3} color={face} outline={0.022} />
          {vertical ? (
            <Text
              font={FONT}
              fontSize={size * 0.58}
              color={INK}
              anchorX="center"
              anchorY="middle"
              rotation={[0, 0, -Math.PI / 2]}
              position={[textOffset[0], textOffset[1], 0.32]}
              letterSpacing={0.02}
            >
              {letter}
            </Text>
          ) : (
            <>
              <Text font={FONT} fontSize={size} color={INK} anchorX="center" anchorY="middle" position={[0, label ? 0.22 : 0, 0.32]}>
                {letter}
              </Text>
              {label ? (
                <Text
                  font={FONT}
                  fontSize={Math.max(0.1, size * 0.19)}
                  color={INK}
                  anchorX="center"
                  anchorY="middle"
                  textAlign="center"
                  maxWidth={faceW - 0.3}
                  lineHeight={1.2}
                  letterSpacing={0.06}
                  position={[0, -faceH * 0.3, 0.32]}
                >
                  {label.toUpperCase()}
                </Text>
              ) : null}
            </>
          )}
        </group>
      </group>
    </group>
  )
}
