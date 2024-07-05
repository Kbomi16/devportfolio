import bg from '../assets/imgs/bg.png'

export default function Footer() {
  return (
    <footer
      className="mt-auto w-full bg-contain py-4 text-center text-sm font-bold"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div>Contact me: kimbomi2172@naver.com</div>
      <div>Copyright © 2024 KIM BOMI.</div>
    </footer>
  )
}
