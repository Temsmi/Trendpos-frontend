import RegisterForm from '@/components/auth/register-form'
import React from 'react'
import { useTranslations } from 'next-intl'

const RegisterPage = () => {
  const t = useTranslations('auth')
  return (
    <div className='flex flex-col gap-7'>
      <div className='text-center text-2xl font-bold text-black'>{t('register')}</div>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
