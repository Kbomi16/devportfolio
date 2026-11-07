import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP }
