/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const load = element => {
  if (element.getAttribute("data-src")) {
    element.src = element.getAttribute("data-src")
    element.setAttribute("data-loaded", true)
  }
}

const isLoaded = element => element.getAttribute("data-loaded") === "true"

const pikaLazy = options => {
  if (
    "loading" in HTMLImageElement.prototype &&
    // iphone safari 加loading=‘lazy’ 会崩溃
    options.device?.ua?.broswer?.name === "Chrome"
  ) {
    options.imgRef.loading = "lazy"
    return {
      lazyObserver: imgRef => {
        load(imgRef)
      },
    }
  }
  let observer
  if (typeof window !== "undefined" && window.IntersectionObserver) {
    observer = new IntersectionObserver(
      (entries, originalObserver) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0 || entry.isIntersecting) {
            originalObserver.unobserve(entry.target)
            if (!isLoaded(entry.target)) {
              load(entry.target)
            }
          }
        })
      },
      {
        // ...options,
        rootMargin: "0px",
        threshold: 0,
      },
    )
  }

  return {
    lazyObserver: imgRef => {
      if (isLoaded(imgRef)) {
        return null
      }
      if (observer) {
        observer.observe(imgRef)
        return observer
      }

      load(imgRef)
      return null
      // const eles = document.querySelectorAll(".pika-lazy")
      // for (const ele of Array.from(eles)) {
      //   if (observer) {
      //     observer.observe(ele)
      //     continue
      //   }
      //   if (isLoaded(ele)) continue

      //   load(ele)
      // }
    },
  }
}

export default pikaLazy
