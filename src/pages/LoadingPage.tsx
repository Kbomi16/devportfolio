import { motion } from 'framer-motion'
import Typewriter from 'typewriter-effect'
import { PATH_VARIANTS_10 } from '../constants/PATH_VARIANTS'

export default function LoadingPage() {
  return (
    <div className="m-auto flex h-full w-full flex-col items-center justify-center md:mt-20">
      <div>
        <svg
          fill="#000000"
          width="300px"
          height="300px"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M223.51465,52H32.48535A12.49939,12.49939,0,0,0,20,64.48535v127.0293A12.49939,12.49939,0,0,0,32.48535,204h191.0293A12.49939,12.49939,0,0,0,236,191.51465V64.48535A12.49939,12.49939,0,0,0,223.51465,52ZM228,191.51465A4.49023,4.49023,0,0,1,223.51465,196H32.48535A4.49023,4.49023,0,0,1,28,191.51465V64.48535A4.49023,4.49023,0,0,1,32.48535,60h191.0293A4.49023,4.49023,0,0,1,228,64.48535ZM204,128a4.0002,4.0002,0,0,1-4,4H56a4,4,0,0,1,0-8H200A4.0002,4.0002,0,0,1,204,128Zm0-32a4.0002,4.0002,0,0,1-4,4H56a4,4,0,0,1,0-8H200A4.0002,4.0002,0,0,1,204,96ZM68,160a4.0002,4.0002,0,0,1-4,4H56a4,4,0,0,1,0-8h8A4.0002,4.0002,0,0,1,68,160Zm96,0a4.0002,4.0002,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4.0002,4.0002,0,0,1,164,160Zm40,0a4.0002,4.0002,0,0,1-4,4h-8a4,4,0,0,1,0-8h8A4.0002,4.0002,0,0,1,204,160Z"
            fill="none"
            stroke="#000000"
            strokeWidth="1"
            variants={PATH_VARIANTS_10}
            initial="hidden"
            animate="visible"
          />
        </svg>
      </div>
      <div className="font-outline-1 font-title text-[2.5rem] text-transparent md:text-[5rem]">
        <Typewriter
          options={{
            strings: [
              "<span style='font-family: HSSanTokki20-Regular; '>Hi. I'm Bomi,<br/>front-end developer.</span>",
            ],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
    </div>
  )
}
