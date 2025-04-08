import Header from '../components/commons/Header'
import bgBlack from '../assets/imgs/bgBlack.png'
import ArrowUp from '../components/commons/ArrowUp'
import Footer from '../components/commons/Footer'
import { useParams } from 'react-router-dom'
import { PROJECTS_DATA } from '../constants/PROJECTS_DATA'
import { motion } from 'framer-motion'
import ProjectDetailCard from '../components/projects/ProjectDetailCard'
import { convertToHtml } from '../utils/convertToHtml'
import BackButton from '../components/commons/BackButton'
import ProjectScreenCapture from '../components/projects/ProjectScreenCapture'
import { projectImages } from '../utils/imageLoader'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const project = PROJECTS_DATA.find((p) => p.id === Number(id))

  if (!project) return null

  const projectFunction = project.function
    ? convertToHtml(project.function)
    : ''
  const projectStack = convertToHtml(project.stack)
  const projectContribution = convertToHtml(project.contribution)

  const projectScreenshots = projectImages[Number(id)] || []

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          backgroundImage: `url(${bgBlack})`,
        }}
        className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat text-white"
      >
        <div className="base-container py-10 md:my-20">
          <ProjectDetailCard project={project} />
          <hr className="my-4 h-0.5 border bg-black md:my-6" />
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="relative inline-block font-title text-2xl">
                💡주제
              </h2>
              <p>{project.description}</p>
            </div>
            <div>
              <h2 className="relative inline-block font-title text-2xl">
                🗓️개발 기간
              </h2>
              <p>{project.period}</p>
            </div>
            {project.function && (
              <div>
                <h2 className="relative inline-block font-title text-2xl">
                  ✨주요 기능
                </h2>
                <p dangerouslySetInnerHTML={{ __html: projectFunction }}></p>
              </div>
            )}
            <div>
              <h2 className="relative inline-block font-title text-2xl">
                🛠️기술 스택
              </h2>
              <p dangerouslySetInnerHTML={{ __html: projectStack }}></p>
            </div>
            <div>
              <h2 className="relative inline-block font-title text-2xl">
                👧🏻기여도
              </h2>
              <p dangerouslySetInnerHTML={{ __html: projectContribution }}></p>
            </div>
            {projectScreenshots.length > 0 && (
              <div className="my-8">
                <h2 className="relative inline-block pb-4 font-title text-2xl">
                  📸 동작 화면 캡쳐
                </h2>
                <ProjectScreenCapture images={projectScreenshots} />
              </div>
            )}
          </div>
          <BackButton />
        </div>

        <div className="fixed bottom-4 right-4 float-end flex">
          <ArrowUp />
        </div>
      </motion.div>
      <Footer />
    </>
  )
}
