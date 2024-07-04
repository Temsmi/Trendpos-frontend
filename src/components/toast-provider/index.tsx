'use client'

import { ToastContainer } from 'react-toastify'

type Props = {
  children: React.ReactNode
}

const styles: { [key: string]: string } = {
  success: 'bg-[#F6FFEE] text-[#117B00] border-[#B8EA93]',
  error: 'bg-[#FFF2F0] text-[#B15648] border-[#E0BAB4]',
  warning: 'bg-[#FFFBE7] text-[#897C3D] border-[#FEE494]',
  info: 'bg-[#E6F7FF] text-[#0B5AA6] border-[#BCD8E5]'
}

export default function ToastProvider({ children }: Props) {
  return (
    <>
      {children}
      <ToastContainer
        toastClassName={({ type }: any) =>
          `relative flex p-1 min-h-10 rounded-md justify-between border overflow-hidden cursor-pointer text-sm font-semibold ${styles[type]}`
        }
      />
    </>
  )
}
