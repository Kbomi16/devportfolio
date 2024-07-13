import githubImg from '../../assets/icons/github.png'
import notionImg from '../../assets/icons/notion.png'
import { motion } from 'framer-motion'
import deploy from '../../assets/icons/deploy.svg'
import download from '../../assets/icons/download.svg'
import { saveAs } from 'file-saver'
import { Link } from 'react-router-dom'

type ProjectDetailCard = {
  id: number
  name: string
  description: string
  function: string
  stack: string
  contribution: string
  github: string
  notion: string
  deploy?: string
  thumnail: string
  pdfFile?: string
}

type ProjectDetailCardProps = {
  project: ProjectDetailCard
}

export default function ProjectDetailCard({ project }: ProjectDetailCardProps) {
  const handleDownload = () => {
    if (project.pdfFile) saveAs(project.pdfFile)
  }

  return (
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
          <p className="font-title md:text-[1rem]">{project.description}</p>
        </div>
        <div className="flex w-full items-end justify-between gap-1 pt-4">
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
            {project.deploy && (
              <Link to={project.deploy} target="_blank">
                <motion.button
                  className="flex w-[8rem] items-center justify-center gap-1 rounded-full border bg-white py-1 shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  DEPLOY <img src={deploy} alt="" className="h-5 w-5" />
                </motion.button>
              </Link>
            )}
            {project.pdfFile && (
              <motion.button
                className="flex w-[8rem] items-center justify-center gap-1 rounded-full border bg-white py-1 shadow-md transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
              >
                PDF <img src={download} alt="" className="h-6 w-6" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
