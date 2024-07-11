import { motion } from 'framer-motion'
import { PATH_VARIANTS_3 } from '../constants/PATH_VARIANTS'
import {
  TEXT_UNDERLINE_VARIANTS,
  TEXT_VARIANTS,
} from '../constants/TEXT_VARIANTS copy'

export default function Introduce() {
  return (
    <div className="p-5 md:p-20">
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
      <motion.div initial="hidden" animate="visible" variants={TEXT_VARIANTS}>
        <h2 className="relative inline-block font-title text-2xl">
          배움엔 끝이 없다. <br />
          끊임없는 배움과 도전을 즐기며 성장하고 있는 김보미입니다.
          <motion.svg
            className="absolute bottom-0 left-0"
            width="100%"
            height="10px"
            viewBox="0 0 800 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.line
              x1="0"
              y1="5"
              x2="800"
              y2="5"
              stroke="#000000"
              strokeWidth="2"
              initial="hidden"
              animate="visible"
              variants={TEXT_UNDERLINE_VARIANTS}
            />
          </motion.svg>
        </h2>
      </motion.div>
      <br />
      <h3 className="font-bold">Introduce.</h3>
      <p>
        안녕하세요! 일상생활 속 사용자가 느낄 수 있는 불편을 해소하고자 하는
        프론트엔드 신입 개발자 김보미입니다. 사용자 입자에서 느낀 불편함을 그냥
        넘기지 않고 깊이 이해하는 습관을 통해 프로젝트 아이디어를 도출하고
        있습니다. 웹 기술을 활용하여 직관적이고 미적인 사용자 경험을 만들어
        내도록 노력하고 있습니다. 뛰어난 문제 해결 능력과 협업 능력을 갖추어
        프로젝트를 만들고 있습니다.
      </p>
    </div>
  )
}
