'use client'

import StarField from './StarField'
import FloatingGeometries from './FloatingGeometries'

export default function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#8b5cf6" intensity={3} />
      <pointLight position={[-10, -10, -10]} color="#ec4899" intensity={1.5} />
      <pointLight position={[0, 10, -5]} color="#60a5fa" intensity={1} />
      <fog attach="fog" args={['#030712', 15, 35]} />
      <StarField />
      <FloatingGeometries />
    </>
  )
}
