/**
 * CH1 포털 히어로 — 패널 2장·워드마크·코너 메타·중앙 도트.
 * 전부 CSS 변수 --p(스크롤 진행도)에 calc()로 바인딩 — 역스크롤 시 문이 다시 닫힌다.
 */
export function Portal() {
  return (
    <div className="portal" aria-hidden>
      <div className="portal-panel is-left" />
      <div className="portal-panel is-right" />

      <span className="portal-dot is-left" />
      <span className="portal-dot is-right" />

      <h1 className="portal-mark display">
        <span className="portal-bo">BO</span>
        <span className="portal-mi">MI.</span>
      </h1>

      <span className="label portal-corner is-tl">KIM BOMI · FRONTEND</span>
      <span className="label portal-corner is-tr">2026</span>
      <span className="label portal-corner is-bl">KROFFLE</span>
      <span className="label portal-corner is-br">SEOUL</span>

      <span className="label portal-hint">Scroll</span>
    </div>
  )
}
