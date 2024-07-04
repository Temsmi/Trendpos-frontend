import React, { useEffect } from 'react'
import Button from '@/components/button/popup'
import { RxCheckCircled, RxCrossCircled } from 'react-icons/rx'
import { ModalProps } from '@/lib/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { closeModal } from '@/store/modalSlice'

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      name,
      message,
      children,
      onClose,
      onSave,
      firstButtonName,
      secondButtonName,
      handleSubmit,
      id,
      ...props
    },
    ref
  ) => {
    const modalRef = React.useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()
    const isModalOpen = useSelector((state: RootState) =>
      state.modal.modals.some(modal => modal.id === id && modal.isOpen)
    )

    useEffect(() => {
      function keyListener(e: any) {
        if (e.keyCode === 27) {
          onClose()
        }
      }
      document.addEventListener('keydown', keyListener)
      return () => document.removeEventListener('keydown', keyListener)
    }, [onClose])

    // const onBackgroundClick = (e: React.MouseEvent) => {
    //   if (modalRef.current && e.target === modalRef.current) {
    //     onClose()
    //   }
    // }

    if (!isModalOpen) return null

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (handleSubmit) {
        handleSubmit(() => onSubmit(e))
      }
    }

    return (
      <div aria-hidden='true' {...props}>
        <form onSubmit={onSubmit} {...props}>
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div
              ref={ref || modalRef} // Use the passed ref or the local ref
              className={`w-auto h-auto bg-white rounded-[26px] shadow flex flex-col items-center justify-center py-10 px-8 ${className}`}>
              {name && (
                <div className='mb-4 text-center text-2xl font-bold'>
                  <h2>{name}</h2>
                </div>
              )}
              {message && (
                <div className='mb-4 px-6 text-center text-sm'>
                  <p>{message}</p> {/* Changed to <p> to avoid nested <h2> */}
                </div>
              )}
              <div>{children}</div>
              <div className='flex items-center justify-center mt-8'>
                {firstButtonName && (
                  <Button
                    color='white'
                    textColor='textBlue'
                    className='mr-2'
                    onClick={e => {
                      e.stopPropagation() // Prevent click event from propagating to form
                      onClose()
                    }}
                    type='button' // Ensure it's marked as type="button"
                  >
                    <RxCrossCircled className='mr-0.5' />
                    {firstButtonName}
                  </Button>
                )}

                {secondButtonName && (
                  <Button onClick={onSave} type='submit'>
                    <RxCheckCircled className='mr-0.5' />
                    {secondButtonName}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
)
Modal.displayName = 'Modal'
export default Modal
