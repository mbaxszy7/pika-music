import React, { memo, useState, useCallback, useEffect, useRef } from "react"
import LogRocket from "logrocket"
import Dialog from "./Dialog"
import { useLocalStorage } from "../utils/hooks"

const PWAService = memo(() => {
  const [isShowPWAInstall, setShowPWAInstall] = useState(false)
  const savePromptRef = useRef(null)
  const { lastValue, clearValue, replaceValue } = useLocalStorage("pwa-install")

  const onConfirm = useCallback(() => {
    setShowPWAInstall(false)
    if (savePromptRef.current) {
      savePromptRef.current.prompt()
      savePromptRef.current.userChoice.then(result => {
        if (result.outcome === "dismissed") {
          replaceValue(Date.now())
          console.log("user dismissed")
        } else {
          clearValue()
          console.log("user added")
        }
      })
    }
  }, [clearValue, replaceValue])

  const onCancel = useCallback(() => {
    replaceValue(Date.now())
    setShowPWAInstall(false)
  }, [replaceValue])

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/public/service-worker.js", { scope: "/" })
          .then(registration => {
            console.log("SW registered: ", registration)
          })
          .catch(registrationError => {
            LogRocket.captureException(registrationError)
            console.log("SW registration failed: ", registrationError)
          })
      })

      window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault()
        console.log(
          lastValue.length,
          Date.now() - lastValue?.[0],
          !savePromptRef.current,
        )
        if (
          lastValue.length &&
          Date.now() - lastValue?.[0] < 1000 * 60 * 60 * 24 * 2
          // eslint-disable-next-line no-empty
        ) {
        } else if (!savePromptRef.current) {
          setShowPWAInstall(true)
          savePromptRef.current = e
        }
        return false
      })
    }
  }, [lastValue])

  return isShowPWAInstall ? (
    <Dialog
      title="安装提示"
      dialogText="是否安装此网站的PWA版本？"
      isShowCancel
      isShowConfirm
      onCancelClick={onCancel}
      onConfirmClick={onConfirm}
    />
  ) : (
    ""
  )
})

export default PWAService
