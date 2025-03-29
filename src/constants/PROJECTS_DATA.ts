import gheupPayImg from '../assets/imgs/projects/gheupPay.png'
import iKonnectImg from '../assets/imgs/projects/iKonnect.png'
import fumeaseImg from '../assets/imgs/projects/fumease.png'
import fittyImg from '../assets/imgs/projects/fitty.png'
import tripZipImg from '../assets/imgs/projects/trip.zip.png'
import growBitImg from '../assets/imgs/projects/growBit.png'
import pickMateImg from '../assets/imgs/projects/pickMate.png'

import gheupPayFile from '../assets/files/gheupPay.pdf'
import iKonnectFile from '../assets/files/iKonnect.pdf'
import fumease2File from '../assets/files/fumease2.pdf'
import tripZipFile from '../assets/files/tripZip.pdf'

export const PROJECTS_DATA = [
  {
    id: 0,
    name: 'PickMate',
    description: '토이 프로젝트 팀원 매칭 플랫폼',
    period: '2025.03 ~ 개발 진행 중 | 팀 프로젝트(2명)',
    function: `
    테스트 계정: test@test.com | aaaaaaa1!

    1️⃣ 프로젝트/스터디 게시글 등록, 수정, 삭제
2️⃣ 프로젝트/스터디 신청하기 + 신청 후 상태 확인 (대기/수락/거절)
3️⃣ 검색 및 카테고리별 프로젝트/스터디 게시글 필터링
4️⃣ 마이페이지에서 내가 작성한 글 & 신청한 글 한눈에 보기
5️⃣ 신청자 관리 (수락/거절) + 오픈채팅 링크 전달
    `,
    stack: `
    - Next.js Page Router
    - React
    - Typescript
    - pnpm
    - tailwind
    - axios
    - eslint, prettier
    - vercel
    - Java
    - MySQL
    - postman
    `,
    contribution: `
   ✅ 백엔드 협업을 위한 공통 타입 정의
- API 요청/응답의 일관성을 위해 백엔드와 협의하여 필수 타입을 정의하고, 프론트엔드 전반에서 타입 안정성 확보

✅ Vercel CI 구축
- Vercel CI를 활용해 PR마다 자동으로 Preview URL을 생성하여 리뷰를 효율화하고, Merge 시 자동으로 배포

✅ Next.js SSR 적용으로 초기 데이터 로딩 최적화
- 페이지의 특성에 맞게 SSR을 적용하여 서버에서 데이터를 선 로딩하고, build 분석을 통해 로딩 속도가 느린 페이지에는 SSG를 적용해 성능 개선

✅ 전역 상태 관리 (zustand)로 로그인/유저정보 관리
- zustand를 활용해 로그인 상태와 유저 정보 전역 관리
- 인증이 필요한 페이지 접근 시 비로그인 사용자를 자동으로 로그인 페이지로 리다이렉트 처리

✅ 폼 관리 및 검증 (react-hook-form + zod)
- react-hook-form과 zod를 조합하여 유효성 검사 체계화
- required 오류 발생 시 사용자 입력값을 실시간으로 useEffect로 상태에 주입해 UX 향상

✅ 프로젝트 / 스터디 CRUD 구현
- 작성자 여부를 [isAuthor]로 판별해 수정/삭제 가능 여부를 분기 처리하고, 게시글 등록, 수정, 삭제의 전체 프로세스를 구현

✅ 마이페이지 신청자 관리 기능 구현
- 마이페이지에서 신청자 목록을 확인하고 [대기/수락/거절] 라벨을 설정할 수 있도록 UI 및 상태 관리 구현
    `,
    github: 'https://github.com/Buddy-Mate/FE_PickMate',
    notion:
      'https://jumpy-kite-a95.notion.site/Buddy-mate-Toy-project-1b3899d1ac3c800782d6df8d3953c511?pvs=4',
    deploy: 'https://fe-pick-mate.vercel.app/',
    thumnail: pickMateImg,
  },
  {
    id: 1,
    name: 'trip.zip',
    description: '체험 상품을 보고 간단하게 예약할 수 있는 서비스',
    period: '2024.07.25 ~ 2024.09.02 | 팀 프로젝트(5명)',
    function: `
    테스트 계정: test22@test.com | aaaaaaa!1

       1️⃣ (소셜) 로그인/회원가입
2️⃣ 검색과 카테고리를 통한 체험 필터링
3️⃣ 체험 예약하기 + 후기 작성하기
4️⃣ 체험 등록 및 수정하기
5️⃣ 내 체험 예약 현황 달력으로 한 눈에 보기
6️⃣ 비밀번호, 닉네임, 프로필 이미지 수정하기
    `,
    stack: `
    - Next.js Page Router
    - React
    - Typescript
    - pnpm
    - tailwind
    - axios
    - eslint, prettier, husky
    - vercel
    - 제공된 API
    `,
    contribution: `
    ✅ 프로젝트 전체적인 일정 관리 (노션, JIRA, Github)

    ✅ Vercel CI 구축을 통해 PR preview 및 배포

    ✅ (소셜) 회원가입/로그인 구현
    - 매번 로그인할 때 사용자가 확인할 수 있는 보안이나 인증 과정이 필요하다고 생각해 로그인 시 URL 뒤에 &prompt=login을 추가하여 매번 로그인할 때마다 로그인 프롬프트가 뜨도록 구현
    
    ✅ input 공통 컴포넌트

    ✅ 마이페이지
    - 데스크탑에서는 사이드바 고정, 모바일에서는 토글 기능 구현 및 탭 클릭 시 자동 닫힘
    - 반응형 UI 최적화 위해 Next.js 페이지 라우팅 및 useMediaQuery 활용
    - MyPageLayout 컴포넌트로 레이아웃 분리
    - TabContext로 활성화된 탭에 맞는 컴포넌트 렌더링
    - 초기 구현에서 느린 모바일 사이드바 문제 해결
    - Framer Motion의 트랜지션 속성 조정으로 애니메이션 최적화해 사용자 경험 부드러움 및 모바일에서 빠른 응답성 제공

    ✅ axios 및 api 설정

    ✅ 다크 모드 구현
    

    `,
    github: 'https://github.com/joraeng-e/trip.zip',
    notion:
      'https://magical-almanac-100.notion.site/8-6da9512d695c44b2a6dd1164441c033a?pvs=4',
    deploy: 'https://trip-zip.vercel.app/',
    thumnail: tripZipImg,
    pdfFile: tripZipFile,
  },
  {
    id: 2,
    name: '급PAY',
    description:
      '급하게 일손이 필요한 자리에 더 많은 시급을 제공해서 아르바이트생을 구할 수 있는 서비스',
    period: '2024.06.20 ~ 2024.07.07 | 팀 프로젝트(5명)',
    function: `
    테스트 계정:
    (사장) io@test.com | aaaaaaa1
    (알바) test22@test.com | aaaaaaa!1
    
    <strong>사장님</strong>
1️⃣ 공고등록: 내 가게를 등록하고, 여러 개의 공고를 등록해보세요.
2️⃣ 즉시채용: 일손이 급한 시기 더 높은 시급으로 빠르게 알바생을 모집하세요.
3️⃣ 간편 신청 관리: 아르바이트생의 지원 현황을 한눈에 확인하고, 쉽게 관리할 수 있습니다.

<strong>알바님</strong>
1️⃣ 높은시급: 급하게 필요한 일손에 더 높은 시급을 제공받으세요.
2️⃣ 다양한 선택: 다양한 일자리를 검색과 필터링을 통해 쉽게 찾아보고, 나에게 맞는 일자리를 선택하세요.
3️⃣ 즉시 지원: 빠르고 간편한 지원절차로 원하는 일자리에 즉시 지원할 수 있습니다.`,
    stack: `
    - Next.js App Router
    - React.
    - Typescript
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
    id: 3,
    name: 'i-Konnect',
    description: '추억의 아이돌 조공 후원 서비스',
    period: '2024.04.27 ~ 2024.05.08 | 팀 프로젝트(5명)',
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
    - eslint, prettier, husky
    - netlify
    - 제공된 API`,
    contribution: `
    ✅ 버튼 공통 컴포넌트

    ✅ 조공 카드 컴포넌트 구현
    - 진행 바로 표현한 남은 후원금 띄우기
    - 마감일을 기준으로 남은 기한 띄우기

    ✅ 조공 등록 폼 구현
    - 아이돌 아바타 클릭 시 해당 아이돌의 ID를 상태에 저장하고, 입력 필드의 유효성을 검사하여 오류 메시지를 표시하는 폼을 구현
    - 상태 관리를 통해 각 입력 필드의 유효성을 boolean 값으로 관리하여 초기 상태를 true로 설정.
    - 사용자가 입력하는 동안 실시간으로 상태를 업데이트하고, 제출 버튼 클릭 시 유효성을 확인하여 오류 메시지 표시
    
    ✅ 아이돌 검색 기능
    `,
    github: 'https://github.com/BestSprinters/i-Konnect',
    notion:
      'https://saber-lip-4c8.notion.site/15-i-Konnect-5afb70e2636e48c1a83f2c9790dacb6c?pvs=4',
    deploy: 'https://i-konnect.netlify.app',
    thumnail: iKonnectImg,
    pdfFile: iKonnectFile,
  },
  {
    id: 4,
    name: 'fumease',
    description: '사용자 맞춤 향수 추천 쇼핑몰 웹사이트',
    period: '2023.06.20 ~ 2023.12.07 | 팀 프로젝트(3명)',
    function: `
        1️⃣ 키워드 색을 선택해서 본인 취향에 맞는 향수를 추천해주는 AI
2️⃣ 추천된 향수가 나오면 구매할 수 있는 향수 쇼핑 기능
3️⃣ 향수 정보 제공
    `,
    stack: `
    - React
    - React Bootstrap
    - moduleCSS
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
- 백엔드(3001 포트)와 프론트엔드(3000 포트) 간 데이터 통신 시 CORS 오류 발생 → 서버 응답 헤더에 CORS 설정을 추가하여 Access-Control-Allow-Origin 헤더로 허용할 도메인을 지정

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
    pdfFile: fumease2File,
  },
  {
    id: 5,
    name: 'GrowBit',
    description:
      '습관 관리 앱: 사용자가 습관을 추가, 수정, 삭제하고, 목표 달성률을 실시간으로 시각화하여 효과적으로 습관을 관리할 수 있는 애플리케이션',
    period: '2024.11 ~ 2025.01 | 개인 프로젝트',
    function: `
    테스트 계정: test@test.com | aaaaaaa!1

        1️⃣ 사용자가 습관을 추가, 삭제할 수 있는 기능
2️⃣ 목표 달성률 시각화
    `,
    stack: `
        - Next.js App Router
      - pnpm
      - tailwind CSS
     - eslint, prettier
    - firebase
    - Chart.js
    - react-calendar
    - react-datepicker
    `,
    contribution: `
     ✅ firebase를 연동해 로그인/회원가입 기능 구현

     ✅ 루틴 관리
- 루틴 추가/삭제: 사용자는 새로운 루틴을 추가, 삭제 기능
- Firestore 연동: 루틴 데이터는 Firestore에 저장되어 실시간으로 동기화

✅ 루틴 달성률 시각화
- Chart.js: 루틴 달성률을 그래프 형태(도넛 차트)로 시각화해 사용자가 얼마나 목표를 달성했는지 쉽게 확인 가능

✅ PWA 지원 + 알림
- 사용자는 앱을 홈 화면에 추가하여 네이티브 앱처럼 사용 가능
- 'next-pwa' 패키지 설정 및 'service worker' 등록
- 'manifest.json' 파일 작성으로 앱 이름, 아이콘 설정
- Firebase Cloud Messaging(FCM)을 사용하여 사용자가 설정한 루틴 알림을 놓치지 않도록 푸시 알림 발송
    `,
    github: 'https://github.com/Kbomi16/GrowBit',
    deploy: 'https://grow-bit.vercel.app/',
    thumnail: growBitImg,
  },
  {
    id: 6,
    name: 'Fitty',
    description:
      '헬스장을 등록하고, 헬스장에 도착하면 인증을 완료할 수 있는 피트니스 관리 애플리케이션',
    period: '2025.02 ~ 2025.03 | 개인 프로젝트',
    function: `
    테스트 계정: test@test.com | aaaaaaa!1

(확실한 인증 테스트를 위해 회원가입 후 위치 등록 후 사용해보세요.)    
(Expo 웹 링크에서는 WebView가 지원되지 않으므로, Expo Go 앱에서 QR 코드를 스캔하여 이용해주세요.)

       1️⃣ 헬스장 인증
- 카카오 맵 API를 통해 현재 사용자 위치를 기반으로 근처 헬스장을 검색할 수 있습니다.
- 헬스장 등록: 사용자는 자신의 헬스장을 등록할 수 있습니다.
- 반경 50m 내 인증: 사용자가 설정한 헬스장 반경 내에 들어가면 인증을 완료할 수 있습니다.

2️⃣ 운동 루틴 기록 및 추천
- 사용자는 각 운동의 세트, 반복 횟수 등을 추천받고, 목표를 달성할 수 있습니다.

3️⃣ 알림 시스템
- Expo-notifications를 사용하여 하루 3번 푸시 알림을 전달합니다.

    `,
    stack: `
    - React Native
    - pnpm
    - Expo
    - eslint, prettier
    - Kakao Map
    `,
    contribution: `
    ✅ firebase를 연동해 로그인/회원가입 기능 구현

    ✅ 카카오맵 API & WebView를 사용해 근처 헬스장 검색 및 지도표시
-  Expo 위치 서비스로 현재 사용자 위치 가져오기
- latitude와 longitude를 전달받아 해당 위치에 마커를 표시

✅ 운동 루틴 기록 및 추천
- react-native-calendars 라이브러리를 사용하여 사용자의 완료된 운동 날짜를 받아와 해당 날짜를 캘린더에 표시
- Firebase에서 운동 데이터를 가져와 오늘 날짜를 기준으로 운동 랜덤 추천(짝수 날짜: 상체, 유산소 | 홀수 날짜: 하체, 유산소)
- FlatList를 사용하여 운동 정보를 수평으로 나열하고, 각 운동의 세부사항(세트, 횟수 등)을 표시

    ✅ Expo-notifications를 사용해 하루 3회 알림 기능 구현

    ✅ 다크 모드
    - useColorScheme을 통해 다크 모드를 자동으로 감지하여 UI 스타일을 변경

    ✅ QR 코드 배포
    `,
    github: 'https://github.com/Kbomi16/Fitty',
    deploy:
      'https://expo.dev/preview/update?message=%E2%9C%A8%20feat%3A%20%EC%8C%8D%EB%B0%A9%ED%96%A5%20%EC%B9%9C%EA%B5%AC%20%EC%B6%94%EA%B0%80%20(%2312)%0A%0A*%20%F0%9F%92%84%20style%3A%20%EC%B9%9C%EA%B5%AC%20%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%20%EC%83%9D%EC%84%B1%0A%0A*%20%E2%9C%A8%20feat%3A%20%EC%B9%9C%EA%B5%AC%20%EA%B2%80%EC%83%89%20%ED%9B%84%20%EC%B6%94%EA%B0%80%20%EA%B5%AC%ED%98%84%0A%0A*%20%E2%9C%A8%20feat%3A%20%EC%8C%8D%EB%B0%A9%ED%96%A5%20%EC%B9%9C%EA%B5%AC%20%EC%B6%94%EA%B0%80%20%EA%B5%AC%ED%98%84%0A%0A*%20%F0%9F%92%84%20style%3A%20%EC%B9%9C%EA%B5%AC%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%20UI%20%EC%88%98%EC%A0%95&updateRuntimeVersion=1.0.0&createdAt=2025-03-07T07%3A03%3A30.715Z&slug=exp&projectId=e425239e-3be5-45d8-8997-bd3611f46083&group=ecd7a8b9-ae9f-4c45-a2f5-acd4c33a4c29',
    thumnail: fittyImg,
  },
]
