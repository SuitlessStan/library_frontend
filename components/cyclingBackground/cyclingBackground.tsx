"use client"

import { useState, useEffect } from "react"
import "./CyclingBackground.css"
import { unsplashClient } from "@/config/global"
import { UnsplashImage } from "@/utils/types"
import { Random } from "unsplash-js/dist/methods/photos/types"

export default function CyclingBackground() {
  const [imageIndex, setImageIndex] = useState(0)
  const [opacity, setOpacity] = useState(0.6)
  const [photos, setPhotos] = useState<UnsplashImage[] | Random | Random[] | undefined>([])

  const fetchSplashImages = async () => {
    try {
      return await unsplashClient.photos.getRandom({ count: 10 })
    } catch (err) {
      console.error(err)
    }
  }

  const changeIndex = (array: Random | Random[] | UnsplashImage[]) => {
    setImageIndex((prevIndex) => {
      if (Array.isArray(array)) {
        return (prevIndex + 1) % array?.length
      }
      return 0
    })
  }

  useEffect(() => {
    fetchSplashImages()
      .then((res) => {
        if (res) setPhotos(res.response)
      })
      .catch((err) => console.error(err))

    const interval = setInterval(() => {
      setOpacity(0)
      if (photos) changeIndex(photos)
      setOpacity(0.6)
    }, 15000)

    return () => clearInterval(interval)
  })

  let backgroundImageStyle = {
    backgroundImage: photos && `url(${photos[imageIndex]?.urls?.full})`,
    opacity: opacity,
  }

  return <div className="cyclingBackground absolute" style={backgroundImageStyle}></div>
}
