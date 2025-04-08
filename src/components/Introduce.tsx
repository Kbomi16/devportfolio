import { useState } from 'react'
import deatailImg1 from '../assets/imgs/bomiFavicon.png'
import deatailImg2 from '../assets/imgs/deatailImg2.png'
import deatailImg3 from '../assets/imgs/deatailImg3.png'
import deatailImg4 from '../assets/imgs/deatailImg4.png'
import deatailImg5 from '../assets/imgs/deatailImg5.png'

const cardData = [
  {
    emoji: '💻',
    title: '프론트엔드 개발자',
    short: 'UI/UX 중심의 코드로 사용자 중심 서비스를 만듭니다.',
    detailImage: deatailImg1,
    detailList: [
      '사용자 입장에서 자연스러운 화면 흐름을 고민합니다.',
      'React, Next.js 기반의 프로젝트 경험이 있습니다.',
      '유지보수와 협업을 고려한 컴포넌트 설계를 지향합니다.',
    ],
  },
  {
    emoji: '🎯',
    title: '사용자 경험',
    short: '불편함을 관찰하고 개선하여 더 나은 흐름을 만듭니다.',
    detailImage: deatailImg4,
    detailList: [
      'UX 관점에서 문제를 정의하고 개선 방향을 고민합니다.',
      '간단한 프로토타입을 만들어보며 아이디어를 검증해 봅니다.',
      '사용자 피드백을 적극 반영하여 화면을 다듬은 경험이 있습니다.',
    ],
  },
  {
    emoji: '🌀',
    title: '스크럼 방식 협업',
    short: '일일 스탠드업, 회고, 반복적 배포 중심의 애자일 실천',
    detailImage: deatailImg2,
    detailList: [
      '데일리 미팅, 회고 등 스크럼 방식으로 프로젝트를 진행해 봤습니다.',
      'Notion을 활용해 업무 흐름을 정리하고 공유했습니다.',
      '역할을 나누고 마감일에 맞춰 작업을 조율한 경험이 있습니다.',
    ],
  },
  {
    emoji: '📚',
    title: '블로그 운영',
    short: '꾸준한 글쓰기로 지식 정리 및 커뮤니티에 기여',
    detailImage: deatailImg5,
    detailList: [
      '학습한 내용을 글로 정리하며 복습합니다.',
      '현재까지 70편 이상의 포스팅을 작성했습니다.',
      '다른 개발자들과 소통하며 의견을 나눈 경험이 있습니다.',
    ],
  },
  {
    emoji: '🗂️',
    title: '프로젝트 관리',
    short: 'Notion, Jira 등 협업 툴 능숙',
    detailImage: deatailImg3,
    detailList: [
      '일정과 업무 흐름을 시각적으로 정리하는 데 익숙합니다.',
      '회의 내용을 정리하고 공유하는 역할을 주도한 경험이 있습니다.',
      'Jira를 사용한 이슈 관리 경험이 있습니다.',
    ],
  },
]

export default function Introduce() {
  const [selected, setSelected] = useState(cardData[0])
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid max-h-[300px] grid-cols-1 gap-4 overflow-y-auto px-8 py-4 md:grid-cols-3 lg:grid-cols-5">
        {cardData.map((card, idx) => (
          <div
            key={idx}
            onClick={() => setSelected(card)}
            className={`transform cursor-pointer rounded-2xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ring-1 ring-white/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_20px_rgba(255,255,255,0.2)] ${
              selected.title === card.title
                ? 'bg-white/30 ring-2 ring-primary/50'
                : ''
            }`}
          >
            <div className="mb-1 text-3xl">{card.emoji}</div>
            <div className="font-bold text-white">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_30px_rgba(255,255,255,0.05)] backdrop-blur-xl transition duration-300 md:flex-row">
        <div className="flex h-full w-full items-center justify-center md:w-1/2">
          {selected.detailImage && (
            <img
              src={selected.detailImage}
              alt={`${selected.title} 이미지`}
              className="max-h-64 max-w-full cursor-pointer rounded-xl object-contain"
              onClick={() => setIsModalOpen(true)}
            />
          )}
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex flex-col items-stretch justify-between">
            <div className="mb-4 flex items-center gap-2 text-2xl font-bold">
              <span>{selected.emoji}</span>
              <h3>{selected.title}</h3>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-white/90">
              {selected.detailList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="mt-24 text-sm text-white/60">
            📍이미지 클릭 시 크게 볼 수 있어요.
          </p>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={selected.detailImage}
            alt="확대 이미지"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
