import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const scrollStyle = {
  base: 'bg-transparent',
  scroll: 'bg-black',
}

export default function Header() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const headerScrollValid =
    scrollPosition === 0 ? scrollStyle.base : scrollStyle.scroll

  const navigate = useNavigate()

  const goToTop = () => {
    navigate('/')
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <header
      className={`fixed top-0 w-full py-1 text-white transition-all duration-500 ${headerScrollValid} z-50`}
    >
      <nav className="flex justify-between font-bold">
        <p>2025</p>
        <p onClick={goToTop} className="cursor-pointer">
          PORTFOLIO
        </p>
        <p>KIM BOMI</p>
      </nav>
    </header>
  )
}
