/* eslint-disable no-console */
import React, { PureComponent } from "react"
import ReactDOM from "react-dom"

class InnerModal extends PureComponent {
  constructor(props) {
    super(props)
    this.modalRoot = document.getElementById("modal_root")
    if (!this.modalRoot) {
      this.modalRoot = document.createElement("div")
      document.body.appendChild(this.modalRoot)
    }
    this.el = document.createElement("div")
  }

  componentDidMount() {
    this.modalRoot.appendChild(this.el)
    window.addEventListener("beforeunload", this.modalCleanup)
  }

  componentWillUnmount() {
    try {
      this.modalRoot.removeChild(this.el)
    } catch (e) {
      console.error(e)
    }
    window.removeEventListener("beforeunload", this.modalCleanup)
  }

  modalCleanup = () => {
    try {
      this.modalRoot.removeChild(this.el)
    } catch (e) {
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
