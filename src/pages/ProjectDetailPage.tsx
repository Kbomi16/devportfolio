import Header from '../components/Header'
import greenBg from '../assets/imgs/greenBg.png.jpg'
import ArrowUp from '../components/ArrowUp'
import Footer from '../components/Footer'
import { Link, useParams } from 'react-router-dom'
import { PROJECTS_DATA } from '../constants/PROJECTS_DATA'
import githubImg from '../assets/icons/github.png'
import notionImg from '../assets/icons/notion.png'
import { motion } from 'framer-motion'
import deploy from '../assets/icons/deploy.svg'
import download from '../assets/icons/download.svg'
import { saveAs } from 'file-saver'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const project = PROJECTS_DATA.find((p) => p.id === Number(id))

  if (!project) return null

  const handleDownload = () => {
    if (project.pdfFile) saveAs(project.pdfFileName)
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
        <div className="base-container bg-primary pb-10">
          <div className="flex h-fit flex-col gap-4 py-4 lg:flex-row">
            <img
              src={project.thumnail}
              alt={project.name}
              className="h-auto w-full rounded-xl border-2 border-black lg:h-[22rem] lg:w-[40rem]"
            />
            <div className="flex flex-col md:items-stretch">
              <div className="flex flex-col md:flex-1 md:gap-6">
                <h2 className="pt-4 font-title text-xl font-bold md:text-[2rem]">
                  {project.name}
                </h2>
                <p className="font-title md:text-[1rem]">
                  {project.description}
                </p>
              </div>
              <div className="flex items-end justify-between gap-1 pt-4">
                <div className="flex gap-1">
                  <Link to={project.github} target="_blank">
                    <motion.img
                      src={githubImg}
                      alt=""
                      className="h-12 w-12 cursor-pointer rounded-xl border-[1.5px] border-black bg-white p-1 md:h-20 md:w-20"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  </Link>
                  <Link to={project.notion} target="_blank">
                    <motion.img
                      src={notionImg}
                      alt=""
                      className="h-12 w-12 cursor-pointer rounded-xl border-[1.5px] border-black bg-white p-1 md:h-20 md:w-20"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to={project.deploy} target="_blank">
                    <motion.button
                      className="flex w-[8rem] items-center justify-center gap-1 rounded-full border bg-white py-1 shadow-md transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      DEPLOY <img src={deploy} alt="" className="h-5 w-5" />
                    </motion.button>
                  </Link>
                  <motion.button
                    className="flex w-[8rem] items-center justify-center gap-1 rounded-full border bg-white py-1 shadow-md transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                  >
                    PDF <img src={download} alt="" className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

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
