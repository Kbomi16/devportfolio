import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { MathUtils, type Group } from 'three'
import GlossyMaterial from '../GlossyMaterial'
import { heroTravelProgress } from '../scrollProgress'
import {
  TUNNEL_END,
  TUNNEL_GAP,
  TUNNEL_LANE,
  TUNNEL_SCALE,
  TUNNEL_STATIONS,
  TUNNEL_START,
  type TunnelStation,
} from './heroTunnel'

const stationY = (index: number) => (index % 3 === 0 ? 0.05 : index % 3 === 1 ? 0.72 : -0.68)

/** 좌우 복도. 깊이는 고정이고, 스크롤만큼 카메라 쪽으로 빨려 지나간다 */
export default function HeroObjects() {
  const rigRef = useRef<Group>(null)

  useFrame((state) => {
    const rig = rigRef.current
    if (!rig) return
    const progress = heroTravelProgress('#about')
    const nextZ = MathUtils.lerp(TUNNEL_START, TUNNEL_END, progress)
    if (Math.abs(rig.position.z - nextZ) < 0.0008) return
    rig.position.z = nextZ
    rig.children.forEach((child) => {
      const distance = state.camera.position.z - (nextZ + child.position.z)
      child.visible = distance > 0.75
    })
    state.invalidate()
  })

  return (
    <group ref={rigRef} position={[0, 0, TUNNEL_START]}>
      {TUNNEL_STATIONS.map((station, index) => (
        <group
          key={`${station.slug}-${index}`}
          position={[station.side * TUNNEL_LANE, stationY(index), -index * TUNNEL_GAP]}
          rotation={[0, station.side * -0.42, 0]}
          scale={TUNNEL_SCALE}
        >
          <StationMark station={station} />
        </group>
      ))}
    </group>
  )
}

function StationMark({ station }: { station: TunnelStation }) {
  if (station.slug === 'tcc') return station.variant === 0 ? <TccLock /> : <TccKey />
  if (station.slug === 'sites') return station.variant === 0 ? <SitesWindows /> : <SitesTiles />
  if (station.slug === 'alleo') return <AlleoSearch />
  if (station.slug === 'money') return station.variant === 0 ? <MoneyWallet /> : <MoneyChart />
  return station.variant === 0 ? <IsleVillage /> : <IsleHouse />
}

function TccLock() {
  return (
    <group>
      <RoundedBox args={[0.28, 1.35, 0.12]} radius={0.05} smoothness={3} position={[-0.42, 0, -0.06]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <RoundedBox args={[0.14, 0.14, 0.05]} radius={0.04} smoothness={2} position={[-0.42, 0.38, 0.05]}>
        <GlossyMaterial tone="neon" />
      </RoundedBox>
      <RoundedBox args={[0.14, 0.09, 0.05]} radius={0.03} smoothness={2} position={[-0.42, 0.12, 0.05]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <RoundedBox args={[0.14, 0.09, 0.05]} radius={0.03} smoothness={2} position={[-0.42, -0.14, 0.05]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <RoundedBox args={[0.78, 0.66, 0.22]} radius={0.12} smoothness={4} position={[0.12, -0.16, 0]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <mesh position={[0.12, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.065, 14, 24, Math.PI]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <mesh position={[0.12, -0.12, 0.14]}>
        <sphereGeometry args={[0.07, 14, 10]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </group>
  )
}

function TccKey() {
  return (
    <group rotation={[0, 0, -0.55]}>
      <RoundedBox args={[0.72, 0.48, 0.06]} radius={0.04} smoothness={2} position={[-0.15, 0.05, -0.12]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <RoundedBox args={[0.14, 0.1, 0.04]} radius={0.02} smoothness={2} position={[-0.32, 0.12, -0.06]}>
        <GlossyMaterial tone="neon" />
      </RoundedBox>
      <mesh position={[-0.42, 0.22, 0]}>
        <torusGeometry args={[0.28, 0.07, 14, 24]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <mesh position={[0.22, -0.12, 0]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.07, 0.72, 6, 10]} />
        <GlossyMaterial tone="ink" />
      </mesh>
      <RoundedBox args={[0.16, 0.08, 0.06]} radius={0.02} smoothness={2} position={[0.48, -0.02, 0.04]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <RoundedBox args={[0.14, 0.08, 0.06]} radius={0.02} smoothness={2} position={[0.42, -0.22, 0.04]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
    </group>
  )
}

function SitesWindows() {
  return (
    <group>
      <RoundedBox args={[1.05, 0.72, 0.05]} radius={0.04} smoothness={3} position={[-0.28, 0.16, -0.22]} rotation={[0.04, -0.42, 0.04]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <RoundedBox args={[1.05, 0.72, 0.05]} radius={0.04} smoothness={3} position={[0.22, -0.02, -0.02]} rotation={[-0.02, 0.28, -0.02]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <mesh position={[-0.12, 0.22, 0.04]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <mesh position={[0.02, 0.22, 0.05]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <GlossyMaterial tone="mid" />
      </mesh>
      <RoundedBox args={[0.92, 0.62, 0.05]} radius={0.04} smoothness={3} position={[0.02, -0.02, 0.16]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <RoundedBox args={[0.36, 0.1, 0.04]} radius={0.03} smoothness={2} position={[0.02, -0.2, 0.22]}>
        <GlossyMaterial tone="neon" />
      </RoundedBox>
    </group>
  )
}

type SiteTile = {
  position: [number, number, number]
  tone: 'ink' | 'neon' | 'mid'
  args: [number, number, number]
}

function SitesTiles() {
  const tiles: SiteTile[] = [
    { position: [-0.38, 0.28, 0], tone: 'ink', args: [0.62, 0.42, 0.08] },
    { position: [0.32, 0.34, 0.08], tone: 'neon', args: [0.5, 0.36, 0.08] },
    { position: [-0.28, -0.28, 0.06], tone: 'mid', args: [0.7, 0.4, 0.08] },
    { position: [0.36, -0.22, 0.14], tone: 'ink', args: [0.48, 0.46, 0.08] },
  ]

  return (
    <group>
      {tiles.map((tile) => (
        <RoundedBox key={tile.position.join(':')} args={tile.args} radius={0.05} smoothness={3} position={tile.position}>
          <GlossyMaterial tone={tile.tone} />
        </RoundedBox>
      ))}
    </group>
  )
}

function AlleoSearch() {
  return (
    <group>
      <RoundedBox args={[0.62, 0.86, 0.05]} radius={0.04} smoothness={2} position={[-0.42, 0.02, -0.1]} rotation={[0, 0.2, 0]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <RoundedBox args={[0.36, 0.05, 0.03]} radius={0.02} smoothness={2} position={[-0.42, 0.22, -0.04]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.05, 0.03]} radius={0.02} smoothness={2} position={[-0.46, 0.08, -0.04]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <mesh position={[0.16, 0.08, 0.08]} rotation={[0.35, 0.1, 0]}>
        <torusGeometry args={[0.38, 0.07, 14, 28]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <mesh position={[0.48, -0.32, 0.16]} rotation={[0.4, 0, 0.85]}>
        <capsuleGeometry args={[0.055, 0.36, 6, 8]} />
        <GlossyMaterial tone="ink" />
      </mesh>
      <mesh position={[0.42, 0.42, 0.12]}>
        <octahedronGeometry args={[0.14, 0]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </group>
  )
}

function MoneyWallet() {
  return (
    <group>
      <RoundedBox args={[1.35, 0.82, 0.2]} radius={0.12} smoothness={4}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <RoundedBox args={[0.46, 0.62, 0.04]} radius={0.03} smoothness={2} position={[0.18, 0.22, 0.12]} rotation={[0, 0, -0.08]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.06, 0.03]} radius={0.02} smoothness={2} position={[0.16, 0.38, 0.16]}>
        <GlossyMaterial tone="neon" />
      </RoundedBox>
      <mesh position={[-0.32, 0.02, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 20]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <RoundedBox args={[0.22, 0.7, 0.03]} radius={0.02} smoothness={2} position={[0.58, -0.42, 0.1]} rotation={[0.15, 0, 0.08]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
    </group>
  )
}

function MoneyChart() {
  const bars = [
    { height: 0.38, tone: 'mid' as const },
    { height: 0.62, tone: 'ink' as const },
    { height: 0.92, tone: 'neon' as const },
  ]

  return (
    <group>
      {bars.map((bar, index) => (
        <RoundedBox
          key={bar.height}
          args={[0.2, bar.height, 0.14]}
          radius={0.04}
          smoothness={2}
          position={[-0.42 + index * 0.32, -0.28 + bar.height / 2, 0]}
        >
          <GlossyMaterial tone={bar.tone} />
        </RoundedBox>
      ))}
      {[0, 1, 2].map((coin) => (
        <mesh key={coin} position={[0.42, -0.15 + coin * 0.12, 0.12]} rotation={[Math.PI / 2.4, 0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 20]} />
          <GlossyMaterial tone={coin === 1 ? 'neon' : 'ink'} />
        </mesh>
      ))}
    </group>
  )
}

function IsleVillage() {
  return (
    <group>
      <mesh position={[0, -0.28, 0]} scale={[1.45, 0.28, 1.05]}>
        <sphereGeometry args={[0.55, 24, 14]} />
        <GlossyMaterial tone="mid" />
      </mesh>
      <mesh position={[0.22, 0.22, 0]}>
        <coneGeometry args={[0.38, 0.7, 16]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <mesh position={[-0.48, -0.02, 0.12]}>
        <cylinderGeometry args={[0.04, 0.05, 0.28, 8]} />
        <GlossyMaterial tone="ink" />
      </mesh>
      <mesh position={[-0.48, 0.22, 0.12]}>
        <coneGeometry args={[0.16, 0.32, 8]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <RoundedBox args={[0.26, 0.2, 0.2]} radius={0.03} smoothness={2} position={[-0.08, -0.06, 0.22]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <mesh position={[-0.08, 0.1, 0.22]}>
        <coneGeometry args={[0.18, 0.16, 4]} />
        <GlossyMaterial tone="mid" />
      </mesh>
    </group>
  )
}

function IsleHouse() {
  return (
    <group>
      <mesh position={[0, -0.38, 0]} scale={[1.25, 0.22, 1]}>
        <sphereGeometry args={[0.58, 22, 12]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <RoundedBox args={[0.62, 0.42, 0.4]} radius={0.04} smoothness={2} position={[-0.08, -0.02, 0]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <mesh position={[-0.08, 0.32, 0]}>
        <coneGeometry args={[0.46, 0.32, 4]} />
        <GlossyMaterial tone="mid" />
      </mesh>
      <RoundedBox args={[0.1, 0.18, 0.04]} radius={0.02} smoothness={2} position={[-0.08, -0.12, 0.22]}>
        <GlossyMaterial tone="neon" />
      </RoundedBox>
      <RoundedBox args={[0.32, 0.24, 0.24]} radius={0.03} smoothness={2} position={[0.48, -0.12, -0.05]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <mesh position={[0.48, 0.08, -0.05]}>
        <coneGeometry args={[0.24, 0.18, 4]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </group>
  )
}
