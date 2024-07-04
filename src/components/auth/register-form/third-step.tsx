import { Icon } from '@/components/icons'
import React from 'react'

const ThirdStep = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-6 mt-8'>
      <Icon name='checklist' />
      <div className='text-2xl font-bold mt-2'>Başvurunuz Alındı</div>
      <div className='text-center text-sm max-w-sm'>
        Başvurunuz inceleniyor. 1 saat içerisinde size geri dönüş yapacağız.
      </div>
    </div>
  )
}

export default ThirdStep
