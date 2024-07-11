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
        className="max-w-30 h-50 flex w-full cursor-pointer flex-col rounded-xl bg-white p-4 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <img
          src={src}
          alt=""
          className="w-full rounded-xl border border-black"
        />
        <div className="pt-4">
          <h3 className="font-title text-xl font-bold">{title}</h3>
          <p className="font-title">{description}</p>
        </div>
      </motion.div>
    </div>
  )
}
