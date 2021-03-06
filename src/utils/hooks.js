/* eslint-disable import/prefer-default-export */
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react"

export const useIsomorphicEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

export const useOrientationChange = fn => {
  const [, setIsPortrait] = useState(true)
  const mql = window.matchMedia("(orientation: portrait)")
  const result = useRef(fn())

  useEffect(() => {
    function onMatchMediaChange(m) {
      if (m.matches) {
        result.current = fn()
        setIsPortrait(true)
      } else {
        // 横屏
        result.current = fn()
        setIsPortrait(false)
      }
    }
    onMatchMediaChange(mql)
    mql.addListener(onMatchMediaChange)
    return () => mql.removeListener(onMatchMediaChange)
  }, [fn, mql])
  return result.current
}

export const useLocalStorage = key => {
  const initialRef = useRef(false)
  const [lastValue, setLastValue] = useState(() => {
    let suggests
    if (key && typeof window !== "undefined") {
      suggests = localStorage.getItem(key)
      if (suggests) {
        initialRef.current = true
        return JSON.parse(suggests)
      }
    }
    if (!suggests) return []
  })

  useIsomorphicEffect(() => {
    if (key && !initialRef.current) {
      const suggests = localStorage.getItem(key)

      if (suggests) setLastValue(JSON.parse(suggests))
    }
  }, [key])

  const setValue = useCallback(
    value => {
      if (value && !lastValue.includes(value)) {
        lastValue.push(value)
        setLastValue(lastValue)
        localStorage.setItem(key, JSON.stringify(lastValue))
      }
    },
    [key, lastValue],
  )

  const replaceValue = useCallback(
    value => {
      if (value) {
        localStorage.removeItem(key)
        setLastValue([value])
        localStorage.setItem(key, JSON.stringify([value]))
      }
    },
    [key],
  )

  const clearValue = useCallback(() => {
    setLastValue([])
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
    }
  }, [key])

  return {
    lastValue,
    setValue,
    clearValue,
    replaceValue,
  }
}

export const useEffectShowModal = () => {
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowContent, setIsShowContent] = useState(false)
  const onModalCloseTimeoutId = useRef(null)

  const onModalClose = useCallback(() => {
    setIsShowContent(false)

    const id = setTimeout(() => {
      setIsShowModal(false)
    }, 100)
    onModalCloseTimeoutId.current = id
  }, [])

  useEffect(() => {
    return () => clearTimeout(onModalCloseTimeoutId.current)
  }, [])

  const onModalOpen = useCallback(() => {
    setIsShowModal(true)
  }, [])

  useEffect(() => {
    let id
    if (isShowModal) {
      id = setTimeout(() => setIsShowContent(true), 0)
    }
    return () => clearTimeout(id)
  }, [isShowModal])

  return { isShowModal, isShowContent, onModalOpen, onModalClose }
}

export const useEleScrollValue = (ele, formatter) => {
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const isScrolled = useRef({
    tag: false,
    value: 0,
  })

  useEffect(() => {
    const pageRef = document.getElementById("root")
    const onWindowScroll = () => {
      const { top } = ele().getBoundingClientRect()
      if (!isScrolled.current.tag) {
        const scrolledValue = pageRef.scrollTop
        isScrolled.current.value = scrolledValue + top
        isScrolled.current.tag = true
      }
      const opacityV =
        (top - isScrolled.current.value) / -isScrolled.current.value
      setHeaderOpacity(opacityV)
    }

    pageRef.addEventListener("scroll", onWindowScroll)
    return () => pageRef.removeEventListener("scroll", onWindowScroll)
  }, [ele, formatter])

  return formatter(headerOpacity)
}
