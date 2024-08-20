import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import bomi from '../assets/imgs/bomi.png'
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
          autoplay={{ delay: 1200, disableOnInteraction: false }}
          modules={[Autoplay]}
        >
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-white">
              HTML+CSS
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-white">
              JAVASCRIPT
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-white">
              TYPESCRIPT
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-white">
              REACT
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-white">
              NEXT.JS
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-white">
              GIT&GITHUB
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <p className="font-title text-[2.5rem] font-bold text-white">
              NOTION
            </p>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 px-8 py-10 md:flex-row md:justify-center md:gap-20">
        <div className="w-80">
          <img
            src={bomi}
            alt=""
            className="shadow-x-md rounded-full border-2 border-red-300 p-4 shadow-red-200"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 md:gap-8">
          <Link to="https://github.com/Kbomi16" target="_blank">
            <motion.div
              className="relative w-60 cursor-pointer rounded-full border-b-8 border-red-200 bg-primary py-2 text-center font-bold text-black shadow-lg md:py-3 md:text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              GITHUB
              <span className="absolute inset-0 rounded-full border-2 border-red-300 shadow-md"></span>
            </motion.div>
          </Link>
          <Link
            to="https://volcano-fisherman-e31.notion.site/KIM-BOMI-5c06bf169bf74a828aa979e685a669b8?pvs=4"
            target="_blank"
          >
            <motion.div
              className="relative w-60 cursor-pointer rounded-full border-b-8 border-red-200 bg-primary py-2 text-center font-bold text-black shadow-lg md:py-3 md:text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              NOTION
              <span className="absolute inset-0 rounded-full border-2 border-red-300 shadow-md"></span>
            </motion.div>
          </Link>
          <Link to="https://bori-note.tistory.com/" target="_blank">
            <motion.div
              className="relative w-60 cursor-pointer rounded-full border-b-8 border-red-200 bg-primary py-2 text-center font-bold text-black shadow-lg md:py-3 md:text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              BLOG
              <span className="absolute inset-0 rounded-full border-2 border-red-300 shadow-md"></span>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}
