import { useRef } from 'react'
import { useCursorFollow } from '../../lib/useCursorFollow'

export default function NeonCursorRing() {
  const followRef = useRef<HTMLDivElement>(null)

  useCursorFollow(followRef)

  return (
    <div ref={followRef} className="neon-cursor" aria-hidden>
      <div className="neon-cursor__visual">
        <div className="neon-cursor__ring" />
      </div>
    </div>
  )
}
