import Header from '../components/Header'
import greenBg from '../assets/imgs/greenBg.png.jpg'
import ArrowUp from '../components/ArrowUp'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'
import { PROJECTS_DATA } from '../constants/PROJECTS_DATA'

import ProjectDetailCard from '../components/projects/ProjectDetailCard'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const project = PROJECTS_DATA.find((p) => p.id === Number(id))

  if (!project) return null

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${greenBg})`,
        }}
        className="min-h-fit bg-cover bg-center bg-no-repeat pt-12"
      >
        <Header />
        <div className="base-container bg-primary pb-10">
          <ProjectDetailCard project={project} />
          <hr className="my-4 h-0.5 border bg-black md:my-6" />
          <div>
            <h2 className="relative inline-block font-title text-2xl">
              💡주제
            </h2>
            <p>{project.description}</p>
          </div>
          <div>
            <h2 className="relative inline-block font-title text-2xl">
              ✨주요 기능
            </h2>
            <p>{project.description}</p>
          </div>
          <div>
            <h2 className="relative inline-block font-title text-2xl">
              🛠️기술 스택
            </h2>
            <p>{project.description}</p>
          </div>
          <div>
            <h2 className="relative inline-block font-title text-2xl">
              👧🏻기여도
            </h2>
            <p>{project.description}</p>
          </div>
        </div>
        <div className="fixed bottom-4 right-4 float-end flex">
          <ArrowUp />
        </div>
      </div>
      <Footer />
    </>
  )
}
