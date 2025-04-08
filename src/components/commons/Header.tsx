import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const scrollStyle = {
  base: 'bg-transparent',
  scroll: 'bg-black',
}

export default function Header() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollPercent, setScrollPercent] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const percent = (scrollY / totalHeight) * 100

      setScrollPosition(scrollY)
      setScrollPercent(percent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const headerScrollValid =
    scrollPosition === 0 ? scrollStyle.base : scrollStyle.scroll

  const goToTop = () => {
    navigate('/')
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      const yOffset = -80 // 네비 높이보다 조금 더 여유 있게
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 w-full text-white transition-all duration-500 ${headerScrollValid} z-50 backdrop-blur-sm`}
    >
      {/* Progress Bar */}
      <div className="h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Top Nav */}
      <nav className="flex items-center justify-between bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-widest">
        <span className="text-gray-300">2025</span>
        <button
          onClick={goToTop}
          className="text-lg font-bold tracking-wide transition-colors hover:text-red-300"
        >
          PORTFOLIO
        </button>
        <span className="text-gray-300">KIM BOMI</span>
      </nav>

      {/* Section Buttons */}
      <div className="flex justify-center gap-6 border-t border-white/10 bg-white/5 px-4 py-2 text-sm font-medium">
        <button
          onClick={goToTop}
          className="px-2 py-1 transition-colors hover:text-red-300"
        >
          Introduce
        </button>
        <button
          onClick={() => scrollToSection('aboutme')}
          className="px-2 py-1 transition-colors hover:text-red-300"
        >
          About Me
        </button>
        <button
          onClick={() => scrollToSection('projects')}
          className="px-2 py-1 transition-colors hover:text-red-300"
        >
          Projects
        </button>
      </div>
    </header>
  )
}
