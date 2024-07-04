'use client'
import React from 'react'
import Button from '../button/popup'
import { FaExclamationCircle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import { FaCircleXmark } from 'react-icons/fa6'
import { RxAccessibility, RxCheckCircled, RxCrossCircled, RxEyeClosed } from 'react-icons/rx'
import { useTranslations } from 'next-intl'

type PopupOption = {
  name: string
  message: string
  type: 'error' | 'warning' | 'success' | 'info'
  onClose: () => void
}

const iconTypes = {
  error: { component: FaCircleXmark, color: 'text-[#FC4F54]' },
  warning: { component: FaExclamationCircle, color: 'text-[#F8AC30]' },
  success: { component: FaCheckCircle, color: 'text-[#57C22D]' },
  info: { component: FaInfoCircle, color: 'text-[#0080FF]' }
}

const popupClasses = {
  popupBox: 'w-[390px] h-[386px] bg-white rounded-[26px] shadow',
  iconSize: 'text-6xl'
}

const Popup: React.FC<PopupOption> = ({ name, type, message, onClose }) => {
  const t = useTranslations('sales')

  const IconComponent = iconTypes[type]?.component
  const iconColorClass = iconTypes[type]?.color

  return (
    <div
      className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50'
      onClick={onClose}>
      <div className={`${popupClasses.popupBox} flex flex-col items-center justify-center`}>
        <div className={`mb-4 ${iconColorClass}`}>
          {IconComponent && <IconComponent className={popupClasses.iconSize} />}
        </div>
        <div className='mb-4 text-center'>
          <h2 className='mb-4 text-2xl font-bold'>{name}</h2>
        </div>
        <div className='mb-4 px-6 text-center'>
          <h2 className='mb-4 text-sm'>{message}</h2>
        </div>
        <div className='flex items-center justify-center'>
          <Button color='white' textColor='textBlue' className='mr-2'>
            <RxCrossCircled className='mr-0.5' />
            <span>{t('cancel')}</span>
          </Button>
          <Button>
            <RxCheckCircled className='mr-0.5' />
            {t('save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
export default Popup
