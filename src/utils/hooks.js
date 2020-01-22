/* eslint-disable import/prefer-default-export */
import { useEffect, useState, useRef, useCallback } from "react"

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
  const [lastValue, setLastValue] = useState(() => {
    let suggests
    if (key) {
      suggests = localStorage.getItem(key)
    }
    return suggests ? JSON.parse(suggests) : []
  })

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

  const clearValue = useCallback(() => {
    setLastValue([])
    if (localStorage.getItem(key)) {
      localStorage.clear(key)
    }
  }, [key])

  return {
    lastValue,
    setValue,
    clearValue,
  }
}
