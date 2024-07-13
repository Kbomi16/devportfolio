import { motion } from 'framer-motion'
import {
  TEXT_UNDERLINE_VARIANTS,
  TEXT_VARIANTS,
} from '../constants/TEXT_VARIANTS'

type UnderlineAnimationProps = {
  children: string
}

export default function UnderlineAnimation({
  children,
}: UnderlineAnimationProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={TEXT_VARIANTS}
      className="relative"
    >
      <h3 className="py-4 font-title text-2xl">{children}</h3>
      <motion.svg
        width="100%"
        height="5px"
        xmlns="http://www.w3.org/2000/svg"
        className="relative bottom-5 left-0"
      >
        <motion.line
          x1="0"
          y1="2.5"
          x2="100%"
          y2="2.5"
          stroke="#000000"
          strokeWidth="2"
          initial="hidden"
          animate="visible"
          variants={TEXT_UNDERLINE_VARIANTS}
        />
      </motion.svg>
    </motion.div>
  )
}
