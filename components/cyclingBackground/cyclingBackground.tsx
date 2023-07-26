"use client"

import { useState, useEffect } from "react"
import "./CyclingBackground.css"

const imageUrls = [
  "./images/landing_page.png",
  "./images/landing_page_2.png",
  "./images/landing_page_3.png",
  "./images/landing_page_4.png",
  "./images/landing_page_5.png",
  "./images/landing_page_6.png",
  "./images/landing_page_7.png",
  "./images/landing_page_8.png",
  "./images/landing_page_9.png",
  "./images/landing_page_10.png",
]

export default function CyclingBackground() {
  const [imageIndex, setImageIndex] = useState(0)
  const [opacity, setOpacity] = useState(0.6)

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0)
      setTimeout(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length)
        setOpacity(0.6)
      }, 400)
    }, 15000)

    return () => {
      clearInterval(interval)
    }
  })

  let backgroundImageStyle = {
    backgroundImage: `url("${imageUrls[imageIndex]}")`,
    opacity: opacity,
  }

  return <div className="cyclingBackground absolute" style={backgroundImageStyle}></div>
}
