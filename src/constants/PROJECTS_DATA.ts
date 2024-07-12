import gheupPayImg from '../assets/imgs/projects/gheupPay.png'
import iKonnectImg from '../assets/imgs/projects/iKonnect.png'
import fumeaseImg from '../assets/imgs/projects/fumease.png'
import devportfolioImg from '../assets/imgs/projects/devportfolio.png'
import gheupPayFile from '../assets/files/gheupPay.pdf'

export const PROJECTS_DATA = [
  {
    id: 1,
    name: '급PAY',
    description:
      '급하게 일손이 필요한 자리에 더 많은 시급을 제공해서 아르바이트생을 구할 수 있는 서비스',
    function: '',
    stack: '',
    contribution: '',
    github: 'https://github.com/902z/gheupPAY',
    notion:
      'https://marbled-pony-2be.notion.site/902z-5662a254ddaa44e9a5446bb315848cc1?pvs=4',
    deploy: 'https://gheup-pay-project.vercel.app/',
    thumnail: gheupPayImg,
    pdfFile: gheupPayFile,
    pdfFileName: '급PAY',
  },
  {
    id: 2,
    name: 'i-Konnect',
    description: '추억의 아이돌 조공 후원 서비스',
    function: '',
    stack: '',
    contribution: '',
    github: 'https://github.com/BestSprinters/i-Konnect',
    notion:
      'https://saber-lip-4c8.notion.site/15-i-Konnect-5afb70e2636e48c1a83f2c9790dacb6c?pvs=4',
    deploy: 'https://i-konnect.netlify.app',
    thumnail: iKonnectImg,
  },
  {
    id: 3,
    name: 'fumease',
    description: '사용자 맞춤 향수 추천 쇼핑몰 웹사이트',
    function: '',
    stack: '',
    contribution: '',
    github: 'https://github.com/902z/gheupPAY',
    notion:
      'https://saber-lip-4c8.notion.site/Fumease-76d9a29fa5344fdca68c434ee19d2fc6?pvs=4',
    deploy: '',
    thumnail: fumeaseImg,
  },
  {
    id: 4,
    name: 'devportfolio',
    description: '포트폴리오',
    function: '',
    stack: '',
    contribution: '',
    github: 'https://github.com/Kbomi16/devportfolio',
    notion:
      'https://saber-lip-4c8.notion.site/devportfolio-4b6ed986c550482faeb93fc849417083?pvs=4',
    deploy: 'https://kimbomi-devportfolio.netlify.app/',
    thumnail: devportfolioImg,
  },
]
