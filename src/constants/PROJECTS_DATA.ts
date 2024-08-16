import gheupPayImg from '../assets/imgs/projects/gheupPay.png'
import iKonnectImg from '../assets/imgs/projects/iKonnect.png'
import fumeaseImg from '../assets/imgs/projects/fumease.png'
import devportfolioImg from '../assets/imgs/projects/devportfolio.png'
import gheupPayFile from '../assets/files/gheupPay.pdf'
import iKonnectFile from '../assets/files/iKonnect.pdf'

export const PROJECTS_DATA = [
  {
    id: 1,
    name: '급PAY',
    description:
      '급하게 일손이 필요한 자리에 더 많은 시급을 제공해서 아르바이트생을 구할 수 있는 서비스',
    period: '2024.06.20 ~ 2024.07.07',
    function: `<strong>사장님</strong>
1️⃣ 공고등록: 내 가게를 등록하고, 여러 개의 공고를 등록해보세요.
2️⃣ 즉시채용: 일손이 급한 시기 더 높은 시급으로 빠르게 알바생을 모집하세요.
3️⃣ 간편 신청 관리: 아르바이트생의 지원 현황을 한눈에 확인하고, 쉽게 관리할 수 있습니다.

<strong>알바님</strong>
1️⃣ 높은시급: 급하게 필요한 일손에 더 높은 시급을 제공받으세요.
2️⃣ 다양한 선택: 다양한 일자리를 검색과 필터링을 통해 쉽게 찾아보고, 나에게 맞는 일자리를 선택하세요.
3️⃣ 즉시 지원: 빠르고 간편한 지원절차로 원하는 일자리에 즉시 지원할 수 있습니다.`,
    stack: `
    - Next.js App Router
    - React + Typescript
    - yarn
    - tailwind
    - axios
    - eslint, prettier
    - vercel
    - 제공된 API
    `,
    contribution: `
    ✅ 프로젝트 노션 관리

    ✅ 프로젝트 초기 세팅
    - tailwind 색상 변수, 폰트, eslint, prettier, 기초 폴더구조 설정

    ✅ framermotion과 aos를 활용한 랜딩 페이지 구현

    ✅ 공고리스트 페이지 구현
    - get API 연결
    - 맞춤 공고 스와이퍼 적용
    - 반응형일 때 카드 겹치는 이슈 해결

    ✅ 공고 카드 구현
    - 최저시급대비 주어진 시급에 따른 퍼센트 라벨 구현
    - 카드 클릭시 해당 공고 페이지로 이동

    ✅ 기본 모달 구현
    - 확인, 경고, 선택에 따른 기본 모달 구현

    ✅ 내 가게 상세 페이지 구현
    - get API 연결

    ✅ 특정 가게의 특정 공고 상세 페이지 구현

    ✅ 신청 내역 테이블 구현
    - status에 따른 라벨 구현
    - 모바일, 테블릿일 때 테이블 첫 컬럼 고정 후 나머지 컬럼 스크롤 구현
    - 대기 중일 때 버튼 클릭 시 put 요청으로 status 바꾸기

    ✅ 프로필 유무에 따른 화면 구현
    - 쿠키에 저장되어 있는 address의 유무에 따른 프로필 페이지 구현

    ✅ 맞춤공고 없을시 시급 높은 순으로 정렬

    ✅ 사장 가게 소유자에 따른 화면 구현
    - 공고 카드 클릭시 알바인지 사장인지 판단 후 notice-detail or admin/notice-detail 경로 처리
    - 알바인지 사장인지 판단 후 버튼 분기 처리
    `,
    github: 'https://github.com/902z/gheupPAY',
    notion:
      'https://marbled-pony-2be.notion.site/902z-5662a254ddaa44e9a5446bb315848cc1?pvs=4',
    deploy: 'https://gheup-pay-project.vercel.app/',
    thumnail: gheupPayImg,
    pdfFile: gheupPayFile,
  },
  {
    id: 2,
    name: 'i-Konnect',
    description: '추억의 아이돌 조공 후원 서비스',
    period: '2024.04.27 ~ 2024.05.08',
    function: `
    1️⃣ 크레딧으로 아이돌 후원하기
2️⃣ 크레딧 충전하기
3️⃣ 이 달의 아이돌 투표하기
4️⃣ 아이돌 조공 추가하기
5️⃣ 관심 있는 아이돌 추가하기
    `,
    stack: `  
    - React + Vite
    - yarn
    - tailwind
    - axios
    - eslint, prettier husky
    - netlify
    - 제공된 API`,
    contribution: ``,
    github: 'https://github.com/BestSprinters/i-Konnect',
    notion:
      'https://saber-lip-4c8.notion.site/15-i-Konnect-5afb70e2636e48c1a83f2c9790dacb6c?pvs=4',
    deploy: 'https://i-konnect.netlify.app',
    thumnail: iKonnectImg,
    pdfFile: iKonnectFile,
  },
  {
    id: 3,
    name: 'fumease',
    description: '사용자 맞춤 향수 추천 쇼핑몰 웹사이트',
    period: '2024.06.20 ~ 2024.07.07',
    function: `
        1️⃣ 키워드 색을 선택해서 본인 취향에 맞는 향수를 추천해주는 AI
2️⃣ 추천된 향수가 나오면 구매할 수 있는 향수 쇼핑 기능
3️⃣ 향수 정보 제공
    `,
    stack: `
    - React, React Bootstrap, moduleCSS
- MySQL
- NodeJS
- Express
- OpenAI
    `,
    contribution: `
    ✅ 메인, 로그인, 회원가입, 제품 목록, 마이페이지, 헤더, 푸터 UI 구현

✅ 헤더에 라우팅 설정하여 사용자가 메뉴를 통해 쉽게 페이지 간 이동이 가능하도록 구현

✅ 로그인하지 않은 경우에는 접근할 수 없는 페이지에 대한 접근 제한을 설정

✅ DB 데이터 가져와 메인페이지에 키워드 띄우기

✅ 사용자가 선택한 키워드를 OpenAI API에 전달하여 향수 추천 데이터를 가져와 모달을 통해 추천 향수 띄우기

✅ 키워드 선택 시 로딩 상태를 표시하는 화면 구현

✅ 백엔드와의 통신에서 발생하는 CORS(Cross-Origin Resource Sharing) 오류를 해결하고, 서버와 클라이언트 간의 데이터 통신 처리

✅ DB와 연결하여 회원가입, 로그인 로직 구현

✅ 장바구니 기본적인 구현(장바구니 추가, 삭제 기능)

✅ 주문 내역 관리
- 사용자가 주문한 내역을 로컬 스토리지에 저장하고, 해당 내역을 사용자의 ID와 연결하여 관리
- 주문 시간을 포함한 주문 내역을 저장하여 마이페이지에서 사용자가 볼 수 있도록 구현
    `,
    github: 'https://github.com/Kbomi16/fumease',
    notion:
      'https://saber-lip-4c8.notion.site/Fumease-76d9a29fa5344fdca68c434ee19d2fc6?pvs=4',
    thumnail: fumeaseImg,
    pdfFile: '',
  },
  {
    id: 4,
    name: 'devportfolio',
    description: '포트폴리오',
    period: '2024.06.20 ~ 2024.07.07',
    stack: `
     - React + Vite
    - yarn
    - tailwind
    - eslint, prettier
    `,
    contribution: `
    ✅ 스크롤 위치에 따른 헤더 배경색 변환

    ✅ 화살표 클릭 시 상단으로 이동

    ✅ 카드 클릭 시 해당 프로젝트의 id에 따라 링크 이동

    ✅ 초기 로딩 화면 구현
    - Typewriter 라이브러리로 타이핑 효과 및 밑줄 적용
    - svg로 선이 그려지는 효과 구현

    ✅ useParams로 주소의 id 값 받아와 프로젝트 상세 페이지 구현

    ✅ file-saver 라이브러리로 버튼 클릭 시 pdf 다운 구현
    `,
    github: 'https://github.com/Kbomi16/devportfolio',
    notion:
      'https://saber-lip-4c8.notion.site/devportfolio-4b6ed986c550482faeb93fc849417083?pvs=4',
    deploy: 'https://kimbomi-devportfolio.netlify.app/',
    thumnail: devportfolioImg,
  },
  {
    id: 5,
    name: 'trip.zip',
    description: '체험 상품을 보고 간단하게 예약할 수 있는 서비스',
    period: '2024.07.25 ~ 2024.09.02',
    function: `
       1️⃣ (소셜) 로그인/회원가입
2️⃣ 검색과 카테고리를 통한 체험 필터링
3️⃣ 체험 예약하기 + 후기 작성하기
4️⃣ 체험 등록 및 수정하기
5️⃣ 내 체험 예약 현황 달력으로 한 눈에 보기
6️⃣ 비밀번호, 닉네임, 프로필 이미지 수정하기
    `,
    stack: `
    - Next.js Page Router
    - React + Typescript
    - pnpm
    - tailwind
    - axios
    - eslint, prettier, husky
    - vercel
    - 제공된 API
    `,
    contribution: `
    ✅ 프로젝트 전체적인 일정 관리 (노션, JIRA, Github)

    ✅ (소셜) 회원가입/로그인 구현
    
    ✅ input 공통 컴포넌트

    ✅ 마이페이지
    - 내 정보
    - 내 정보 수정 (닉네임, 프로필, 비밀번호 변경)
    - 내 예약 내역

    ✅ axios 및 api 설정

    ✅ 다크 모드 구현
    

    `,
    github: 'https://github.com/joraeng-e/trip.zip',
    notion:
      'https://magical-almanac-100.notion.site/8-6da9512d695c44b2a6dd1164441c033a?pvs=4',
    deploy: 'https://trip-zip.vercel.app/',
    thumnail: gheupPayImg,
    pdfFile: gheupPayFile,
  },
]
