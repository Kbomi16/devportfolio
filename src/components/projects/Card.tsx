import { motion } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import ProjectStackTags from './ProjectStackTags'

type CardProps = {
  src: string
  title: string
  description: string
  stack: string
  onClick(): void
}

export default function Card({
  src,
  title,
  description,
  stack,
  onClick,
}: CardProps) {
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  return (
    <div data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
      <motion.div
        className="flex h-fit w-full cursor-pointer flex-col rounded-xl border-2 bg-black p-4 shadow-lg md:flex-row md:gap-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <img
          src={src}
          alt=""
          className="w-30 h-full rounded-xl border border-black md:w-2/4"
        />
        <div className="flex flex-col justify-between pt-4 md:flex-grow md:gap-3">
          <div>
            <h3 className="mb-4 font-title text-2xl font-bold md:text-3xl">
              {title}
            </h3>
            <p className="font-title">{description}</p>
          </div>
          <ProjectStackTags stack={stack} />
        </div>
      </motion.div>
    </div>
  )
}
