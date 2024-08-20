import bgFooter from '../../assets/imgs/bgFooter.png'
import ArrowUp from './ArrowUp'

export default function Footer() {
  return (
    <footer
      className="mt-auto w-full bg-cover bg-center bg-no-repeat py-4 text-center text-sm text-white"
      style={{ backgroundImage: `url(${bgFooter})` }}
    >
      <div className="fixed bottom-4 right-4 float-end flex">
        <ArrowUp />
      </div>
      <div>Contact me: kimbomi2172@naver.com</div>
      <div>Copyright © 2024 KIM BOMI.</div>
    </footer>
  )
}
