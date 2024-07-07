import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import bomi from '../../assets/imgs/bomi.png'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Aboutme() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-center text-center">
        <Swiper
          pagination={{
            clickable: true,
          }}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{ delay: 1000, disableOnInteraction: false }}
          modules={[Autoplay]}
        >
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-green-20">
              HTML+CSS
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-green-20">
              JAVASCRIPT
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-green-20">
              TYPESCRIPT
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-green-20">
              REACT
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-green-20">
              NEXT.JS
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-green-20">
              GIT&GITHUB
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-green-20">
              NOTION
            </p>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="flex flex-col justify-between px-8 md:flex-row md:justify-center md:gap-20">
        <div>
          <img src={bomi} alt="" />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 md:gap-8">
          <motion.div
            className="w-60 cursor-pointer rounded-3xl bg-primary py-2 text-center font-bold shadow-lg hover:border-x-2 hover:border-green-10 md:py-3 md:text-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="https://github.com/Kbomi16">GITHUB</Link>
          </motion.div>
          <motion.div
            className="w-60 cursor-pointer rounded-3xl bg-primary py-2 text-center font-bold shadow-lg hover:border-x-2 hover:border-green-10 md:py-3 md:text-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="https://saber-lip-4c8.notion.site/KIM-BOMI-4b670b5efdcb4ab4be31664779248984?pvs=4">
              NOTION
            </Link>
          </motion.div>
          <motion.div
            className="w-60 cursor-pointer rounded-3xl bg-primary py-2 text-center font-bold shadow-lg hover:border-x-2 hover:border-green-10 md:py-3 md:text-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="https://bori-note.tistory.com/">BLOG</Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
