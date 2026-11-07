import Label from '../../components/common/Label'

export default function GalleryHeader() {
  return (
    <header className="mx-auto w-full max-w-[1200px]">
      <Label className="text-muted">PROJECTS</Label>
      <h2 className="mt-3 font-kr text-[clamp(26px,3.2vw,48px)] leading-[1.15] font-extrabold tracking-[-0.02em]">
        권한은 막고, 검색은 붙이고,{' '}
        <br className="max-md:hidden" />
        흐름은 이어 붙였습니다.
      </h2>
    </header>
  )
}
