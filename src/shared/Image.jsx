import React, { memo, useState, useEffect } from "react"

const ImageLoader = memo(({ url, children }) => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      setLoaded(true)
    }

    image.onerror = () => {
      setLoaded(false)
    }
    image.src = url
  }, [])

  return children(isLoaded, url)
})

export default ImageLoader
