import { motion } from 'framer-motion'
import back from '../../assets/icons/back.svg'
import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()

  const goToBack = () => {
    navigate(-1)
  }

  return (
    <div className="mt-10 flex items-center justify-center">
      <motion.div
        className="relative flex w-60 cursor-pointer items-center justify-center gap-2 rounded-full border-b-8 border-red-200 bg-primary py-2 text-center font-bold text-black shadow-lg md:py-3 md:text-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={goToBack}
      >
        GO TO BACK
        <img src={back} alt="돌아가기" className="size-6" />
        <span className="absolute inset-0 rounded-full border-2 border-red-300 shadow-md"></span>
      </motion.div>
    </div>
  )
}
