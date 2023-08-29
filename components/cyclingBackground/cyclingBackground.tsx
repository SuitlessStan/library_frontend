"use client"

import { useState, useEffect } from "react"
import "./CyclingBackground.css"
import { unsplashClient } from "@/config/global"
import useAsyncAction from "@/hooks/useAsyncAction"
import { UnsplashImage } from "@/utils/types"

export default function CyclingBackground() {
  const [imageIndex, setImageIndex] = useState(0)
  const [opacity, setOpacity] = useState(0.6)
  const [photos, setPhotos] = useState<UnsplashImage[]>([])

  const fetchSplashImages = async () => {
    return await unsplashClient.photos.getRandom({ count: 10 })
  }

  const actionConfig = {
    onExecute: fetchSplashImages,
    onSucceed: (result: unknown) => {
      setPhotos(result.response)
    },
    onFailure: (error: Error) => console.error("Error: ", error),
  }

  const { result, error, execute } = useAsyncAction(actionConfig)

  useEffect(() => {
    execute()

    const interval = setInterval(() => {
      setOpacity(0)

      setTimeout(() => {
        setImageIndex((prevIndex) => {
          if (Array.isArray(photos)) {
            return (prevIndex + 1) % photos.length
          }
          return 0
        })
        setOpacity(0.6)
      }, 400)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  let backgroundImageStyle = {
    backgroundImage: `url(${
      photos[imageIndex].urls.full ? photos[imageIndex].urls.full : photos[imageIndex].urls.regular
    })`,
    opacity: opacity,
  }

  return <div className="cyclingBackground absolute" style={backgroundImageStyle}></div>
}
