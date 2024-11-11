import { motion } from 'framer-motion'
import {
  TEXT_UNDERLINE_VARIANTS,
  TEXT_VARIANTS,
} from '../constants/TEXT_VARIANTS'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UnderlineAnimation from './UnderlineAnimation'
import Light from './Light'
import todayMenu from '../assets/files/todayMenu.pdf'
import toytie from '../assets/files/toytie.pdf'
import fumease from '../assets/files/fumease.pdf'

export default function Introduce() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index)
  }

  const handleMouseLeave = () => {
    setHoverIndex(null)
  }

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  const projects = [
    {
      name: '질문 선택을 통한 메뉴 추천 앱',
      pdfUrl: todayMenu,
      textColor: 'text-yellow-400',
    },
    {
      name: '토이 프로젝트 팀원 매칭 웹사이트',
      pdfUrl: toytie,
      textColor: 'text-amber-700',
    },
    {
      name: ' AI를 활용한 향수 쇼핑 웹사이트',
      pdfUrl: fumease,
      textColor: 'text-black',
    },
  ]

  return (
    <div className="max-w-1200 bg-white p-4 opacity-60">
      <div className="base-container p-5 text-black md:p-20">
        <Light />
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
                프론트엔드 개발자 김보미입니다.{' '}
              </strong>
              <br />
              <br />
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
              <br />
              애자일 사상에 따른 스크럼 방법론을 적극 활용해 보다 체계적으로
              프로젝트를 관리하고, 마감 계획을 이행하는 것을 중요시합니다.
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
              에 적극 참여했고, 블로그를 운영하여{' '}
              <Link
                to="https://bori-note.tistory.com"
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
              {projects.map((project, index) => (
                <div key={index} className="relative inline-block">
                  <p
                    className={`cursor-pointer text-xl font-bold transition-all duration-700 hover:text-2xl ${project.textColor}`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={project.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.name},
                    </Link>{' '}
                  </p>
                  {hoverIndex === index && (
                    <div
                      className={`${project.textColor} no-opacity absolute left-0 z-30 w-fit rounded bg-primary p-2 text-sm transition-all duration-700`}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      텍스트 클릭 시 PDF를 볼 수 있어요.
                    </div>
                  )}
                </div>
              ))}
              등을 개발하며, 사용자 중심의 개발 방법과 문제해결 능력을
              키웠습니다. 이러한 프로젝트 과정에서 여러 문제를 해결하며, 사용자
              경험을 개선하는 데에 집중했습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
