// 랜덤 색상 생성 함수
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// 두 개의 랜덤 색상으로 그라데이션 생성
export const getRandomGradient = () => {
  const color1 = getRandomColor()
  const color2 = getRandomColor()
  return `linear-gradient(45deg, ${color1}, ${color2})`
}
