import arrow from '../assets/icons/arrow.svg'
import { motion } from 'framer-motion'

export default function ArrowUp() {
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={goToTop}
    >
      <img
        src={arrow}
        alt=""
        className="h-12 w-12 rotate-180 cursor-pointer rounded-full border-2 border-white p-1"
      />
    </motion.div>
  )
}
