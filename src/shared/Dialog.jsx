/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import InnerModal, { ModalMask } from "./InnerModal"

const DialogContainer = styled.div`
  margin: 0 auto;
  margin-top: 40%;
  width: 80%;
  margin-left: 10%;
  border-radius: 10px;
  background: ${props => props.theme.mg};
  padding: 28px 15px 18px 15px;
  p {
    line-height: 1.5;
    font-size: 16px;
    margin-bottom: 18px;
    text-align: center;
    color: ${props => props.theme.fg};
  }
  .btn_group {
    margin-top: 28px;
    display: flex;

    span {
      font-size: 14px;
      text-align: center;
      display: inline-block;
      flex: 1;
      color: ${props => props.theme.fg};
    }
    span:last-of-type {
      color: ${props => props.theme.secondary};
    }
  }
`

const Dialog = ({
  title,
  dialogText,
  isShowCancel,
  isShowConfirm,
  onCancelClick,
  onConfirmClick,
}) => {
  return (
    <InnerModal>
      <ModalMask>
        <DialogContainer>
          {title && <p className="title">{title}</p>}
          {dialogText && <p className="alert_text">{dialogText}</p>}
          <div className="btn_group">
            {isShowCancel && (
              <span className="cancel" onClick={onCancelClick}>
                取消
              </span>
            )}
            {isShowConfirm && (
              <span className="confirm" onClick={onConfirmClick}>
                确定
              </span>
            )}
          </div>
        </DialogContainer>
      </ModalMask>
    </InnerModal>
  )
}

Dialog.propTypes = {
  title: PropTypes.string,
  dialogText: PropTypes.string,
  isShowCancel: PropTypes.bool,
  isShowConfirm: PropTypes.bool,
  onCancelClick: PropTypes.func,
  onConfirmClick: PropTypes.func,
}

Dialog.defaultProps = {
  isShowCancel: true,
  isShowConfirm: true,
}

export default Dialog
