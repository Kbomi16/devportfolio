import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaBook, FaClipboardList, FaLaptopCode, FaUsers } from 'react-icons/fa'
import { TEXT_VARIANTS } from '../constants/TEXT_VARIANTS'
import Light from './Light'

const cardData = [
  {
    icon: <FaBook size={40} />,
    title: '프론트엔드 개발자 김보미입니다.',
    text: '사용자 경험을 중요시하며, 문제 해결 능력과 협업 능력을 갖추었습니다.',
  },
  {
    icon: <FaUsers size={40} />,
    title: '사용자 경험',
    text: '사용자 입장에서 느낀 불편함을 깊이 이해하고 이를 바탕으로 효과적인 프로젝트 아이디어를 제시합니다.',
  },
  {
    icon: <FaLaptopCode size={40} />,
    title: '애자일 스크럼 방법론 활용',
    text: '애자일 사상과 스크럼 방법론을 적극적으로 활용하여 효율적이고 체계적인 프로젝트 관리를 실현합니다.',
  },
  {
    icon: <FaBook size={40} />,
    title: '블로그 운영',
    text: '70개 이상의 글이 작성된 기술 블로그를 운영하며, 배운 지식을 적극적으로 공유하고 있습니다.',
  },
  {
    icon: <FaClipboardList size={40} />,
    title: '프로젝트 관리 도구 사용',
    text: 'Jira, Notion 등의 도구를 활용하여 프로젝트 계획 및 관리에 능숙하며, 업무 효율성을 극대화합니다.',
  },
]

export default function Introduce() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-10">
      <div className="mx-auto max-w-[1200px] overflow-hidden">
        <div className="mb-20 rounded-xl bg-primary bg-opacity-60 p-8">
          <Light />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={TEXT_VARIANTS}
          >
            <h2 className="relative inline-block text-2xl font-bold text-black md:text-[2rem]">
              배움엔 끝이 없다.
              <br />
              끊임없는 배움과 도전을 즐기며 성장하고 있는{' '}
              <p className="inline-block text-5xl font-bold text-white">
                김보미
              </p>
              입니다.
            </h2>
          </motion.div>
        </div>

        {/* 🔄 무한 스크롤 효과 추가 */}
        <div className="relative flex w-full overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${(offset % cardData.length) * 300}px` }} // 카드 크기 늘리기 위해 320px로 조정
            transition={{ ease: 'linear', duration: 0.8 }}
            style={{ width: `${cardData.length * 380}px` }} // 전체 크기 맞추기
          >
            {cardData.map((card, index) => (
              <div
                key={index}
                className="min-w-[380px] rounded-xl border-2 border-primary bg-black px-6 py-10 text-black shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="flex justify-center text-primary">
                    {card.icon}
                  </div>
                  <h3 className="text-center text-lg font-bold text-primary">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-4 px-8 text-center text-gray-400">
                  {card.text}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
