/* eslint-disable no-console */
import { PureComponent } from "react"
import LogRocket from "logrocket"
import ReactDOM from "react-dom"
import styled from "styled-components"

export const ModalMask = styled.div`
  z-index: 9999999;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
`

class InnerModal extends PureComponent {
  constructor(props) {
    super(props)
    this.modalRoot = document.getElementById("modal_root")
    // eslint-disable-next-line react/prop-types
    if (!this.modalRoot || props.isDynamic) {
      this.modalRoot = document.createElement("div")
      document.body.appendChild(this.modalRoot)
    }
    this.el = document.createElement("div")
  }

  componentDidMount() {
    document.querySelector("html, body").classList.add("no_scroll")
    this.modalRoot.appendChild(this.el)
    window.addEventListener("beforeunload", this.modalCleanup)
  }

  componentWillUnmount() {
    document.querySelector("html, body").classList.remove("no_scroll")
    try {
      this.modalRoot.removeChild(this.el)
    } catch (e) {
      LogRocket.captureException(e)
      console.error(e)
    }
    window.removeEventListener("beforeunload", this.modalCleanup)
  }

  modalCleanup = () => {
    document.querySelector("html, body").classList.remove("no_scroll")
    try {
      this.modalRoot.removeChild(this.el)
    } catch (e) {
      LogRocket.captureException(e)
      console.error(e)
    }
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props

    return ReactDOM.createPortal(children, this.el)
  }
}
export default InnerModal
