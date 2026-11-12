import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { MathUtils, type Group } from 'three'
import GlossyMaterial from '../GlossyMaterial'
import { heroTravelProgress } from '../scrollProgress'
import {
  TUNNEL_END,
  TUNNEL_LANE,
  TUNNEL_OPEN_SCALE,
  TUNNEL_SCALE,
  TUNNEL_SHOW,
  TUNNEL_STATIONS,
  TUNNEL_START,
  openingOffset,
  stationDepth,
  type TunnelStation,
} from './heroTunnel'

/** 처음엔 좌우 하나씩. 나머지는 가까워져야 나타난다 */
export default function HeroObjects() {
  const rigRef = useRef<Group>(null)

  useFrame((state) => {
    const rig = rigRef.current
    if (!rig) return
    const progress = heroTravelProgress('#about')
    const travel = MathUtils.smoothstep(progress, 0.12, 1)
    const nextZ = MathUtils.lerp(TUNNEL_START, TUNNEL_END, travel)
    let changed = Math.abs(rig.position.z - nextZ) > 0.0008
    if (changed) rig.position.z = nextZ
    rig.children.forEach((child) => {
      const distance = state.camera.position.z - (rig.position.z + child.position.z)
      const visible = distance > 0.7 && distance < TUNNEL_SHOW
      if (child.visible !== visible) {
        child.visible = visible
        changed = true
      }
    })
    if (changed) state.invalidate()
  })

  return (
    <group ref={rigRef} position={[0, 0, TUNNEL_START]}>
      {TUNNEL_STATIONS.map((station, index) => (
        <group
          key={`${station.slug}-${index}`}
          visible={index < 2}
          position={[
            openingOffset(index)?.x ?? station.side * TUNNEL_LANE,
            openingOffset(index)?.y ?? 0.08,
            -stationDepth(index),
          ]}
          rotation={[0.02, station.side * (index < 2 ? -0.06 : -0.2), 0]}
          scale={index < 2 ? TUNNEL_OPEN_SCALE : TUNNEL_SCALE}
        >
          <StationMark station={station} />
        </group>
      ))}
    </group>
  )
}

function StationMark({ station }: { station: TunnelStation }) {
  if (station.slug === 'tcc') return station.variant === 0 ? <TccLock /> : <TccKey />
  if (station.slug === 'sites') return station.variant === 0 ? <SitesWindow /> : <SitesStack />
  if (station.slug === 'alleo') return <AlleoSearch />
  if (station.slug === 'money') return station.variant === 0 ? <MoneyWallet /> : <MoneyBars />
  return station.variant === 0 ? <IsleIsland /> : <IsleHouse />
}

function TccLock() {
  return (
    <group>
      <RoundedBox args={[0.78, 0.68, 0.22]} radius={0.14} smoothness={4}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.24, 0.058, 16, 28, Math.PI]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </group>
  )
}

function TccKey() {
  return (
    <group rotation={[0, 0, -0.7]}>
      <mesh position={[-0.28, 0.16, 0]}>
        <torusGeometry args={[0.26, 0.07, 14, 24]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <mesh position={[0.22, -0.18, 0]}>
        <capsuleGeometry args={[0.065, 0.7, 6, 10]} />
        <GlossyMaterial tone="ink" />
      </mesh>
    </group>
  )
}

function SitesWindow() {
  return (
    <group>
      <RoundedBox args={[1.16, 0.78, 0.1]} radius={0.08} smoothness={3}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <RoundedBox args={[0.62, 0.07, 0.04]} radius={0.035} smoothness={2} position={[0, -0.16, 0.08]}>
        <GlossyMaterial tone="neon" />
      </RoundedBox>
    </group>
  )
}

function SitesStack() {
  return (
    <group>
      <RoundedBox args={[1.05, 0.68, 0.06]} radius={0.05} smoothness={3} position={[0, 0.08, -0.08]} rotation={[0.12, 0.18, 0]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <RoundedBox args={[1.05, 0.68, 0.06]} radius={0.05} smoothness={3} position={[0.06, -0.1, 0.06]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
    </group>
  )
}

function AlleoSearch() {
  return (
    <group>
      <mesh position={[-0.06, 0.08, 0]} rotation={[0.4, 0.05, 0]}>
        <torusGeometry args={[0.36, 0.065, 16, 28]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <mesh position={[0.32, -0.32, 0.06]} rotation={[0.35, 0, 0.8]}>
        <capsuleGeometry args={[0.05, 0.34, 6, 8]} />
        <GlossyMaterial tone="ink" />
      </mesh>
    </group>
  )
}

function MoneyWallet() {
  return (
    <group>
      <RoundedBox args={[1.28, 0.78, 0.18]} radius={0.14} smoothness={4}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <mesh position={[-0.28, 0.02, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </group>
  )
}

function MoneyBars() {
  const bars = [
    { height: 0.42, tone: 'mid' as const },
    { height: 0.68, tone: 'ink' as const },
    { height: 0.96, tone: 'neon' as const },
  ]

  return (
    <group>
      {bars.map((bar, index) => (
        <RoundedBox
          key={bar.height}
          args={[0.22, bar.height, 0.14]}
          radius={0.04}
          smoothness={2}
          position={[-0.32 + index * 0.32, -0.48 + bar.height / 2, 0]}
        >
          <GlossyMaterial tone={bar.tone} />
        </RoundedBox>
      ))}
    </group>
  )
}

function IsleIsland() {
  return (
    <group>
      <mesh position={[0, -0.16, 0]} scale={[1.35, 0.22, 1]}>
        <sphereGeometry args={[0.55, 28, 16]} />
        <GlossyMaterial tone="mid" />
      </mesh>
      <mesh position={[0.08, 0.28, 0]}>
        <coneGeometry args={[0.36, 0.62, 20]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </group>
  )
}

function IsleHouse() {
  return (
    <group>
      <RoundedBox args={[0.72, 0.48, 0.46]} radius={0.04} smoothness={2} position={[0, -0.06, 0]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <mesh position={[0, 0.32, 0]}>
        <coneGeometry args={[0.52, 0.34, 4]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </group>
  )
}
