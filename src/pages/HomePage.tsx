import greenBg from '../assets/imgs/greenBg.png.jpg'
import Aboutme from '../components/Aboutme/Aboutme'
import ArrowUp from '../components/ArrowUp'
import Footer from '../components/Footer'
import Header from '../components/Header'
import AOS from 'aos'
import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])

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
            <h2 className="text-2xl font-bold">
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
      </div>
      <section>
        <div className="base-container">
          <div className="flex">
            <p className="font-outline-1 relative left-0 top-0 font-title text-[3.5rem] font-bold text-transparent">
              Aboutme.
            </p>
            <p className="relative -left-[15.3rem] top-1 -z-10 font-title text-[3.5rem] font-bold text-green-20 text-opacity-30">
              Aboutme.
            </p>
          </div>
          <div className="mb-8 rounded-xl border-4 border-gray-20 bg-white py-4 shadow-md md:py-0 md:pt-4">
            <Aboutme />
          </div>
          perferendis, dicta laborum cum dolores hic incidunt nostrum esse
          tempora? Fugiat excepturi sunt voluptatem reiciendis corrupti
          asperiores repellendus minima alias earum unde quia, incidunt
          doloribus? Accusantium eum aut quae suscipit ratione, nihil tempora
          laboriosam exercitationem ea quis! Facilis, suscipit. Saepe? Neque
          voluptatum consequatur cumque omnis, blanditiis quasi dignissimos
          nulla ab facilis tenetur adipisci at aliquid aliquam nam labore et?
          Sapiente asperiores quidem est obcaecati! Ipsam quaerat voluptate
          fugiat quam inventore? Accusamus quis, quasi eligendi distinctio magni
          ut ducimus odit, sequi tempora voluptatum adipisci veritatis?
          Asperiores similique neque iure itaque error nisi. Voluptatibus
          doloribus ex, magnam nesciunt impedit numquam provident voluptate!
          Consequatur nisi eos quam maxime officia, debitis molestias, quisquam
          reprehenderit expedita harum, voluptatibus illo omnis error voluptatem
          explicabo saepe ex adipisci dolor quasi aliquid labore? Quos minima
          dignissimos sapiente adipisci. Provident dicta aperiam quibusdam
          accusantium, suscipit rerum labore esse quis tempora? Fugiat excepturi
          sunt voluptatem reiciendis corrupti asperiores repellendus minima
          alias earum unde quia, incidunt doloribus? Accusantium eum aut quae
          suscipit ratione, nihil tempora laboriosam exercitationem ea quis!
          Facilis, suscipit. Saepe? Neque voluptatum consequatur cumque omnis,
          blanditiis quasi dignissimos nulla ab facilis tenetur adipisci at
          aliquid aliquam nam labore et? Sapiente asperiores quidem est
          obcaecati! Ipsam quaerat voluptate fugiat quam inventore? Accusamus
          quis, quasi eligendi distinctio magni ut ducimus odit, sequi tempora
          voluptatum adipisci veritatis? Asperiores similique neque iure itaque
          error nisi. Voluptatibus doloribus ex, magnam nesciunt impedit numquam
          provident voluptate! Consequatur nisi eos quam maxime officia, debitis
          molestias, quisquam reprehenderit expedita harum, voluptatibus illo
          omnis error voluptatem explicabo saepe ex adipisci dolor quasi aliquid
          labore? Quos minima dignissimos sapiente adipisci. Provident dicta
          aperiam quibusdam accusantium, suscipit rerum labore esse quis
          expedita harum, voluptatibus illo omnis error voluptatem explicabo
          saepe ex adipisci dolor quasi aliquid labore? Quos minima dignissimos
          sapiente adipisci. Provident dicta aperiam quibusdam accusantium,
          suscipit rerum labore esse quis pellendus minima alias earum unde
          quia, incidunt doloribus? Accusantium eum aut quae suscipit ratione,
          nihil tempora laboriosam exercitationem ea quis! Facilis, suscipit.
          Saepe? Neque voluptatum consequatur cumque omnis, blanditiis quasi
          dignissimos nulla ab facilis tenetur adipisci at aliquid aliquam nam
          labore et? Sapiente asperiores quidem est obcaecati! Ipsam quaerat
          voluptate fugiat quam inventore? Accusamus quis, quasi eligendi
          distinctio magni ut ducimus odit, sequi tempora voluptatum adipisci
          veritatis? Asperiores similique neque iure itaque error nisi.
          Voluptatibus doloribus ex, magnam nesciunt impedit numquam provident
          voluptate! Consequatur nisi eos quam maxime officia, debitis
          molestias, quisquam reprehenderit expedita harum, voluptatibus illo
          omnis error voluptatem explicabo saepe ex adipisci dolor quasi aliquid
        </div>
      </section>
      <div className="fixed bottom-4 right-4 float-end flex">
        <ArrowUp />
      </div>
      <Footer />
    </>
  )
}
