import Header from '../components/Header'
import greenBg from '../assets/imgs/greenBg.png.jpg'
import ArrowUp from '../components/ArrowUp'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'
import { projectData } from '../constants/projectData'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const project = projectData.find((p) => p.id === Number(id))

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
        <div className="base-container mb-10 bg-primary">
          <div>
            <img
              src={project.thumnail}
              alt={project.name}
              className="h-auto w-full"
            />
            <h1>{project.name}</h1>
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
