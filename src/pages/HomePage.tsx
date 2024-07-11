import greenBg from '../assets/imgs/greenBg.png.jpg'
import ArrowUp from '../components/ArrowUp'
import Card from '../components/projects/Card'
import Footer from '../components/Footer'
import Header from '../components/Header'
import AOS from 'aos'
import { useEffect } from 'react'
import Aboutme from '../components/Aboutme'
import { useNavigate } from 'react-router-dom'
import Introduce from '../components/Introduce'
import { PATHS } from '../constants/PATHS'
import { PROJECTS_DATA } from '../constants/PROJECTS_DATA'

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])

  const navigate = useNavigate()

  const handleCardClick = (id: number) => {
    navigate(`${PATHS.project.link}/${id}`)
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
          <Introduce />
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
              {PROJECTS_DATA.map((project) => (
                <Card
                  key={project.id}
                  src={project.thumnail}
                  title={project.name}
                  description={project.description}
                  onClick={() => handleCardClick(project.id)}
                />
              ))}
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
