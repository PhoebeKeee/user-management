import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { styled, useTheme } from '../styles/theme'

type ModalProps = {
  title?: string
  showModal: boolean
  children: JSX.Element
}

function Modal({ title, showModal = false, children }: ModalProps): JSX.Element {
  const { mq, colors } = useTheme()
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const StyledModalBody = styled.div`
    padding: 20px;
    height: 300px;
  `
  const StyledModalTitle = styled.div`
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.primary};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: white;
    font-size: 18px;
  `

  const StyledModal = styled.div`
    background: white;
    width: calc(90%);
    min-height: 400px;
    border-radius: 10px;
    ${mq[0]} {
      width: calc(53%);
    }
  `
  const StyledModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  `

  const modalContent = showModal ? (
    <StyledModalOverlay>
      <StyledModal>
        {title && <StyledModalTitle>{title}</StyledModalTitle>}
        <StyledModalBody>{children}</StyledModalBody>
      </StyledModal>
    </StyledModalOverlay>
  ) : null

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'))
  } else {
    return null
  }
}

export default Modal
