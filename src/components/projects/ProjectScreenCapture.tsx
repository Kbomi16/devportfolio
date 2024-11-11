import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/navigation'
import { Navigation, Pagination } from 'swiper/modules'

type ProjectScreenCaptureProps = {
  images: string[]
}

export default function ProjectScreenCapture({
  images,
}: ProjectScreenCaptureProps) {
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination]}
        pagination={{ clickable: true }}
        navigation
        spaceBetween={20}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Project Screenshot ${index + 1}`}
              className="h-auto w-full rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
