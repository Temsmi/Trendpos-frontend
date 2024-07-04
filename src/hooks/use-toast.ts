import { toast, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ToastProps = {
  message: string | JSX.Element
  type: 'success' | 'error' | 'warning' | 'info'
  toastId?: string
  autoClose?: number
}

const useCustomToast = () => {
  const showToast = (options: ToastProps) => {
    const { message, type, toastId, autoClose = 5000 } = options

    const toastOptions: ToastOptions = {
      position: 'top-right',
      toastId,
      autoClose,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    }

    switch (type) {
      case 'success':
        toast.success(message, toastOptions)
        break
      case 'error':
        toast.error(message, toastOptions)
        break
      case 'warning':
        toast.warning(message, toastOptions)
        break
      case 'info':
        toast.info(message, toastOptions)
        break
    }
  }

  return showToast
}

export default useCustomToast
