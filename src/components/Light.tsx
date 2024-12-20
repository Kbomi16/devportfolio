import { PATH_VARIANTS_3 } from '../constants/PATH_VARIANTS'
import { motion } from 'framer-motion'

export default function Light() {
  return (
    <svg
      width="100px"
      height="100px"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            .a {
              fill: none;
              stroke: #000000;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
          `}
        </style>
      </defs>
      <motion.path
        className="a"
        d="M37.2133,17.7292A13.2133,13.2133,0,1,0,16.5058,28.5958a4.0061,4.0061,0,0,1,1.6648,3.315v4.7315H29.8294V31.907A4.0511,4.0511,0,0,1,31.532,28.57,13.1741,13.1741,0,0,0,37.2133,17.7292Z"
        variants={PATH_VARIANTS_3}
        initial="hidden"
        animate="visible"
      />
      <motion.line
        className="a"
        x1="19.4437"
        y1="38.9282"
        x2="28.5563"
        y2="38.9282"
        variants={PATH_VARIANTS_3}
        initial="hidden"
        animate="visible"
      />
      <motion.line
        className="a"
        x1="19.3782"
        y1="41.2141"
        x2="28.4908"
        y2="41.2141"
        variants={PATH_VARIANTS_3}
        initial="hidden"
        animate="visible"
      />
      <motion.line
        className="a"
        x1="21.5213"
        y1="43.5"
        x2="26.4787"
        y2="43.5"
        variants={PATH_VARIANTS_3}
        initial="hidden"
        animate="visible"
      />
      <motion.polyline
        className="a"
        points="26.011 36.642 26.011 29.583 27.66 26.085"
        variants={PATH_VARIANTS_3}
        initial="hidden"
        animate="visible"
      />
      <motion.polyline
        className="a"
        points="21.989 36.642 21.989 29.583 20.34 26.085"
        variants={PATH_VARIANTS_3}
        initial="hidden"
        animate="visible"
      />
    </svg>
  )
}
