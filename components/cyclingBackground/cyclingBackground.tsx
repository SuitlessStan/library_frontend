"use client"

import { useState, useEffect, CSSProperties } from "react"
import "./CyclingBackground.css"
import { unsplashClient } from "@/config/global"
import { UnsplashImage } from "@/utils/types"

export default function CyclingBackground() {
  const [imageIndex, setImageIndex] = useState(0)
  const [opacity, setOpacity] = useState(0.8)
  const [photos, setPhotos] = useState<UnsplashImage | UnsplashImage[]>([])

  useEffect(() => {
    const fetchSplashImages = async () => {
      try {
        const res = await unsplashClient.photos.getRandom({ count: 10 })
        if (res && Array.isArray(res.response)) {
          setPhotos(res.response as UnsplashImage[])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchSplashImages()
  }, [])

  useEffect(() => {
    if (!Object.values(photos).length) return

    const changeIndex = () => {
      setOpacity(0)
      setTimeout(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % Object.values(photos).length)
        setOpacity(0.6)
      }, 1000)
    }

    const interval = setInterval(() => {
      setOpacity(0)
      changeIndex()
      setOpacity(0.8)
    }, 15000)

    return () => clearInterval(interval)
  }, [photos])

  const backgroundImage =
    Object.values(photos).length && photos[imageIndex as keyof typeof photos]["urls"]["full"]

  let backgroundImageStyle: CSSProperties = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : "",
    opacity: opacity,
    backgroundPosition: "center",
    backgroundRepeat: "repeat-y",
  }

  return <div className="cyclingBackground absolute top-16" style={backgroundImageStyle}></div>
}
