import { motion } from 'framer-motion'
import { PATH_VARIANTS_3 } from '../constants/PATH_VARIANTS'
import {
  TEXT_UNDERLINE_VARIANTS,
  TEXT_VARIANTS,
} from '../constants/TEXT_VARIANTS'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import UnderlineAnimation from './UnderlineAnimation'

export default function Introduce() {
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  return (
    <div className="bg-white p-4 opacity-50">
      <div className="base-container p-5 text-black md:p-20">
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
          <h2 className="relative inline-block font-title text-2xl md:text-[2rem]">
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
        <div className="z-10 flex flex-col gap-8">
          <div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
            <UnderlineAnimation>Introduce.</UnderlineAnimation>

            <p>
              안녕하세요!{' '}
              <strong>
                일상생활 속 사용자가 느낄 수 있는 불편을 해소하고자 하는
                프론트엔드 신입 개발자 김보미입니다.{' '}
              </strong>
              사용자 입장에서 느낀 불편함을 그냥 넘기지 않고 깊이 이해하는
              습관을 통해 프로젝트 아이디어를 도출하고 있습니다. 체계적으로
              계획을 세워 프로젝트를 진행하며, 웹 기술을 활용하여 직관적이고
              미적인 사용자 경험을 만들어 내도록 노력하고 있습니다. 뛰어난 문제
              해결 능력과 협업 능력을 갖추어 프로젝트를 성공적으로 완성하고
              있습니다.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
            <UnderlineAnimation>
              일의 우선순위를 정하고, 계획하는 것을 좋아합니다.
            </UnderlineAnimation>
            <p>
              저는 복잡한 상황에서도 해야 할 일들을 체계적으로 정리하고 조율할
              수 있습니다. 중요한 일과 중요하지 않은 일을 구분하며 앞으로 해야
              할 일들을 계획적으로 준비합니다.
              <br />
              저는 하기로 한 일은 반드시 완수합니다. 스스로 목표를 세우고
              기대치를 만족시키기 위해 끈기 있게 행동합니다. 세부적인 것까지
              꼼꼼하게 체크하며 완벽하게 마무리합니다. 주어진 일을 성실하게
              처리하고, 일이 시작되면 마침표를 찍을 때까지 안도하지 않습니다
            </p>
          </div>
          <div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
            <UnderlineAnimation>
              배움을 나누며 기록하는 것을 좋아합니다.
            </UnderlineAnimation>
            <p>
              저는{' '}
              <Link
                to="https://github.com/Study-FE-Techbook/Modern-React-Deep-Dive"
                target="_blank"
                className="text-xl font-bold text-red-400 transition-all duration-700 hover:text-2xl hover:underline"
              >
                스터디 활동
              </Link>
              에 적극 참여하고 있으며, 블로그를 운영하여{' '}
              <Link
                to="https://github.com/Study-FE-Techbook/Modern-React-Deep-Dive"
                target="_blank"
                className="text-xl font-bold text-purple-400 transition-all duration-700 hover:text-2xl hover:underline"
              >
                50개 이상의 글
              </Link>
              을 작성했습니다. 이를 통해 제가 배운 지식을 정리하고, 다른
              사람들과 나누는 데 큰 기쁨을 느끼고 있습니다. 이러한 기록은 제게
              지속적인 학습의 원동력이 되고 있습니다.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
            <UnderlineAnimation>사용자 경험을 중시합니다.</UnderlineAnimation>
            <p>
              사용자 입장에서 느끼는 불편함을 간과하지 않고 깊이 이해하는 습관을
              통해 다양한 프로젝트 아이디어를 도출하고 있습니다. 사용자의
              목소리에 귀 기울이며, 그들의 필요와 문제를 해결하기 위한 해결책을
              고민하는 과정에서 더욱 창의적인 아이디어를 발전시킬 수 있었습니다.
              사용자의 불편함을 해소하기 위한 다양한 프로젝트를 수행했습니다.
              <br />
              질문 선택을 통한 메뉴 추천 앱, 토이 프로젝트 팀원 매칭 웹사이트,
              AI를 활용한 향수 쇼핑 웹사이트 등을 개발하며, 사용자 중심의 개발
              방법과 문제해결 능력을 키웠습니다. 이러한 프로젝트 과정에서 여러
              문제를 해결하며, 사용자 경험을 개선하는 데에 집중했습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
