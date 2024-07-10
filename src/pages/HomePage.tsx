import greenBg from '../assets/imgs/greenBg.png.jpg'
import ArrowUp from '../components/ArrowUp'
import Card from '../components/projects/Card'
import Footer from '../components/Footer'
import Header from '../components/Header'
import AOS from 'aos'
import { useEffect } from 'react'
import fumease from '../assets/imgs/projects/fumease.png'
import gheupPay from '../assets/imgs/projects/gheupPay.png'
import iKonnect from '../assets/imgs/projects/iKonnect.png'
import Aboutme from '../components/Aboutme'
import { useNavigate } from 'react-router-dom'
import { PAGES } from '../constants/paths'

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])

  const navigate = useNavigate()

  const handleCardClick = (id: number) => {
    navigate(`${PAGES.project.link}/${id}`)
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${greenBg})`,
        }}
        className="min-h-fit bg-cover bg-center bg-no-repeat pt-12"
      >
        <Header />
        <div className="base-container rounded-t-xl bg-primary p-4 opacity-85">
          <div className="p-5 md:p-20">
            <h2 className="font-title text-2xl">
              배움엔 끝이 없다. <br />
              끊임없는 배움과 도전을 즐기며 성장하고 있는 김보미입니다.
            </h2>
            <br />
            <h3 className="font-bold">Introduce.</h3>
            <p>
              안녕하세요! 일상생활 속 사용자가 느낄 수 있는 불편을 해소하고자
              하는 프론트엔드 신입 개발자 김보미입니다. 사용자 입자에서 느낀
              불편함을 그냥 넘기지 않고 깊이 이해하는 습관을 통해 프로젝트
              아이디어를 도출하고 있습니다. 웹 기술을 활용하여 직관적이고 미적인
              사용자 경험을 만들어 내도록 노력하고 있습니다. 뛰어난 문제 해결
              능력과 협업 능력을 갖추어 프로젝트를 만들고 있습니다.
            </p>
          </div>
        </div>

        <div className="base-container mb-10 bg-primary">
          {/* Aboutme */}
          <section>
            <div className="flex md:py-8">
              <p className="font-outline-1 relative left-0 top-0 font-title text-[3.5rem] font-bold text-transparent">
                Aboutme.
              </p>
              <p className="-z-5 relative -left-[15.3rem] top-1 font-title text-[3.5rem] font-bold text-green-20 text-opacity-30">
                Aboutme.
              </p>
            </div>
            <div className="mb-8 rounded-xl border-4 border-gray-20 bg-white py-4 shadow-md md:py-0 md:pt-4">
              <Aboutme />
            </div>
          </section>
          {/* Projects */}
          <section>
            <div className="flex pb-4 md:py-8">
              <p className="font-outline-1 relative left-0 top-0 font-title text-[3.5rem] font-bold text-transparent">
                Projects.
              </p>
              <p className="-z-5 relative -left-[14rem] top-1 font-title text-[3.5rem] font-bold text-green-20 text-opacity-30">
                Projects.
              </p>
            </div>
            <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
              <Card
                src={gheupPay}
                title="급PAY"
                description="급하게 일손이 필요한 자리에 더 많은 시급을 제공해서 아르바이트생을 구할 수 있는 서비스"
                onClick={() => handleCardClick(1)}
              />
              <Card
                src={iKonnect}
                title="i-Konnect"
                description="추억의 아이돌 조공 후원 서비스"
                onClick={() => handleCardClick(2)}
              />
              <Card
                src={fumease}
                title="Fumease"
                description="AI 기반 사용자 맞춤 향수 추천 쇼핑몰 웹사이트"
                onClick={() => handleCardClick(3)}
              />
            </div>
          </section>
        </div>
        <div className="fixed bottom-4 right-4 float-end flex">
          <ArrowUp />
        </div>
      </div>
      <Footer />
    </>
  )
}
