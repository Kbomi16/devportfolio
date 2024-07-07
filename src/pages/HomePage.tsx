import greenBg from '../assets/imgs/greenBg.png.jpg'
import Aboutme from '../components/Aboutme/Aboutme'
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
          pellendus minima alias earum unde quia, incidunt doloribus?
          Accusantium eum aut quae suscipit ratione, nihil tempora laboriosam
          exercitationem ea quis! Facilis, suscipit. Saepe? Neque voluptatum
          consequatur cumque omnis, blanditiis quasi dignissimos nulla ab
          facilis tenetur adipisci at aliquid aliquam nam labore et? Sapiente
          asperiores quidem est obcaecati! Ipsam quaerat voluptate fugiat quam
          inventore? Accusamus quis, quasi eligendi distinctio magni ut ducimus
          odit, sequi tempora voluptatum adipisci veritatis? Asperiores
          similique neque iure itaque error nisi. Voluptatibus doloribus ex,
          magnam nesciunt impedit numquam provident voluptate! Consequatur nisi
          eos quam maxime officia, debitis molestias, quisquam reprehenderit
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
          labore? Quos minima dignissimos sapiente adipisci. Provident dicta
          aperiam quibusdam accusantium, suscipit rerum labore esse quis
        </div>
      </div>
      <section>
        <div className="base-container">
          <p className="font-outline-1 relative left-0 top-5 font-title text-[3.5rem] font-bold text-transparent">
            Aboutme.
          </p>
          <p className="relative -top-14 left-2 -z-10 font-title text-[3.5rem] font-bold text-green-20 text-opacity-30">
            Aboutme.
          </p>
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
      <Footer />
    </>
  )
}
