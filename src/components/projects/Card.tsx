import { motion } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

type CardProps = {
  src: string
  title: string
  description: string
  onClick(): void
}

export default function Card({ src, title, description, onClick }: CardProps) {
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
        <div className="flex flex-col pt-4 md:gap-3">
          <h3 className="font-title text-xl font-bold md:text-2xl">{title}</h3>
          <p className="font-title">{description}</p>
        </div>
      </motion.div>
    </div>
  )
}
