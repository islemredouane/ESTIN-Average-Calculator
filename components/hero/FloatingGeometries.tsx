'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function useFloat(ref: React.RefObject<THREE.Object3D>, baseY: number, amp: number, spd: number, phase: number) {
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = baseY + Math.sin(state.clock.elapsedTime * spd + phase) * amp
  })
}

// ── Math plus sign (+) — arithmetic / calculator
function PlusSign({
  position, color, speed, phase,
}: { position: [number,number,number]; color: string; speed: number; phase: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const baseY = position[1]
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z += 0.004 * speed
    groupRef.current.rotation.y += 0.002 * speed
    groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.4 + phase) * 0.3
  })
  const mat = <meshStandardMaterial color={color} wireframe transparent opacity={0.65} emissive={color} emissiveIntensity={0.3} />
  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <boxGeometry args={[1.0, 0.22, 0.18]} />
        {mat}
      </mesh>
      <mesh>
        <boxGeometry args={[0.22, 1.0, 0.18]} />
        {mat}
      </mesh>
    </group>
  )
}

// ── Helix spiral — infinite series / recursion / algorithms
function MathHelix({
  position, color, speed, phase,
}: { position: [number,number,number]; color: string; speed: number; phase: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const baseY = position[1]

  const lineGeo = useMemo(() => {
    const pts: number[] = []
    const N = 120
    // lineSegments needs pairs: [p0,p1, p1,p2, p2,p3 ...]
    for (let i = 0; i < N; i++) {
      const t0 = (i / N) * Math.PI * 5
      const t1 = ((i + 1) / N) * Math.PI * 5
      pts.push(Math.cos(t0) * 0.5, (i / N) * 2.0 - 1.0, Math.sin(t0) * 0.5)
      pts.push(Math.cos(t1) * 0.5, ((i + 1) / N) * 2.0 - 1.0, Math.sin(t1) * 0.5)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    return geo
  }, [])

  const dotGeo = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i <= 20; i++) {
      const t = (i / 20) * Math.PI * 5
      pts.push(Math.cos(t) * 0.5, (i / 20) * 2.0 - 1.0, Math.sin(t) * 0.5)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    return geo
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.005 * speed
    groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.35 + phase) * 0.25
  })

  return (
    <group ref={groupRef} position={position}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.35} />
      </lineSegments>
      <points geometry={dotGeo}>
        <pointsMaterial color={color} size={0.06} transparent opacity={0.8} />
      </points>
    </group>
  )
}

// ── Torus knot — mathematical knot theory / topology / calculus
function MathKnot({
  position, color, speed, phase, wireframe = false,
}: { position: [number,number,number]; color: string; speed: number; phase: number; wireframe?: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const baseY = position[1]
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.003 * speed
    ref.current.rotation.y += 0.007 * speed
    ref.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.3 + phase) * 0.35
  })
  return (
    <mesh ref={ref} position={position}>
      <torusKnotGeometry args={[0.45, 0.13, 120, 16]} />
      <meshStandardMaterial color={color} wireframe={wireframe} transparent opacity={0.55} emissive={color} emissiveIntensity={0.25} />
    </mesh>
  )
}

// ── Matrix grid of dots — linear algebra / matrices / data
function MatrixDots({
  position, color, speed, phase,
}: { position: [number,number,number]; color: string; speed: number; phase: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const baseY = position[1]

  const cells = useMemo<[number,number,number][]>(() => {
    const items: [number,number,number][] = []
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        items.push([(i - 1.5) * 0.32, (j - 1.5) * 0.32, 0])
    return items
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.004 * speed
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + phase) * 0.25
    groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.4 + phase) * 0.2
  })

  return (
    <group ref={groupRef} position={position}>
      {cells.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.065, 6, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={i % 3 === 0 ? 0.9 : 0.25}
            transparent
            opacity={i % 3 === 0 ? 0.9 : 0.38}
          />
        </mesh>
      ))}
    </group>
  )
}

// ── Wireframe icosahedron — Platonic solid / geometric math
function PlatonicSolid({
  position, color, speed, phase,
}: { position: [number,number,number]; color: string; speed: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const baseY = position[1]
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.003 * speed
    ref.current.rotation.y += 0.005 * speed
    ref.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.45 + phase) * 0.28
  })
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.75, 0]} />
      <meshStandardMaterial color={color} wireframe transparent opacity={0.55} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}

// ── Graph nodes + edges — graph theory / algorithm complexity
function GraphNodes({
  position, color, speed, phase,
}: { position: [number,number,number]; color: string; speed: number; phase: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const baseY = position[1]

  const nodes: [number,number,number][] = [
    [0, 0.8, 0],
    [-0.7, -0.3, 0.3],
    [0.7, -0.3, -0.3],
    [0, -0.7, 0.6],
    [0.4, 0.3, 0.8],
  ]

  const lineGeo = useMemo(() => {
    const edges = [[0,1],[0,2],[0,4],[1,2],[1,3],[2,3],[3,4],[4,0]]
    const pts: number[] = []
    edges.forEach(([a, b]) => pts.push(...nodes[a], ...nodes[b]))
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    return geo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.004 * speed
    groupRef.current.rotation.x += 0.002 * speed
    groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.45 + phase) * 0.3
  })

  return (
    <group ref={groupRef} position={position}>
      {nodes.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[i === 0 ? 0.14 : 0.09, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} transparent opacity={0.85} />
        </mesh>
      ))}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.28} />
      </lineSegments>
    </group>
  )
}

// ── Torus ring — integral loop / Σ representation
function IntegralRing({
  position, color, speed, phase, wireframe = false,
}: { position: [number,number,number]; color: string; speed: number; phase: number; wireframe?: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const baseY = position[1]
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.005 * speed
    ref.current.rotation.z += 0.003 * speed
    ref.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.4 + phase) * 0.25
  })
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.6, 0.16, 16, 64]} />
      <meshStandardMaterial color={color} wireframe={wireframe} transparent opacity={0.55} emissive={color} emissiveIntensity={0.22} />
    </mesh>
  )
}

export default function FloatingGeometries() {
  return (
    <>
      {/* Upper-left: math plus sign — arithmetic / calculator */}
      <PlusSign     position={[-5.5, 2.8, -3]}  color="#8b5cf6" speed={1.0} phase={0}   />
      {/* Upper-right: Platonic icosahedron — geometric math */}
      <PlatonicSolid position={[5.2, 3.0, -4]}  color="#60a5fa" speed={0.9} phase={1.5} />
      {/* Right-mid: helix spiral — sequences / recursion */}
      <MathHelix    position={[5.5, 0.0, -4]}   color="#a78bfa" speed={0.8} phase={0.8} />
      {/* Left-mid: integral torus ring — calculus loop */}
      <IntegralRing position={[-5.0, 0.5, -5]}  color="#ec4899" speed={0.7} phase={2.0} wireframe />
      {/* Lower-left: matrix dots — linear algebra */}
      <MatrixDots   position={[-4.8, -3.0, -5]} color="#f472b6" speed={1.1} phase={3.0} />
      {/* Lower-right: torus knot — topology / knot theory */}
      <MathKnot     position={[4.5, -2.8, -4]}  color="#764ba2" speed={0.6} phase={1.2} />
      {/* Bottom-center: graph nodes — graph theory / algorithms */}
      <GraphNodes   position={[0.5, -4.0, -5]}  color="#60a5fa" speed={0.9} phase={2.5} />
    </>
  )
}
