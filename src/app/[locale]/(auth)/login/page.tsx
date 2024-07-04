import LoginForm from '@/components/auth/login-form'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

const LoginPage = () => {
  const t = useTranslations('auth')
  return (
    <div className='flex flex-col gap-8'>
      <div className='text-center text-2xl font-bold text-black'>{t('login')}</div>
      <LoginForm />
      <div className='text-center'>
        <Link href='/forgot-password' className='text-sm font-bold text-[#0080FF] underline'>
          {t('forget_password')}
        </Link>
      </div>
      <div className='text-center text-sm font-medium text-black '>
        {t('new_register')}{' '}
        <Link href='/register' className='text-sm font-bold text-[#0080FF] underline'>
          {t('register')}
        </Link>
      </div>
      <div className='flex w-full items-center'>
        <hr className='h-[1px] w-full' />
        <span className='mx-10 text-sm font-medium'>{t('or')}</span>
        <hr className='h-[1px] w-full' />
      </div>
      <div className='flex flex-col gap-5 text-sm font-medium'>
        <div className='flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] border bg-[#FDFDFD] p-2'>
          <Image src='/images/google.svg' width={28} height={28} alt='google-icon' />
          {t('sign_in_with_google')}
        </div>
        <div className='flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] border bg-[#FDFDFD] p-2'>
          <Image src='/images/apple.svg' width={28} height={28} alt='google-icon' />
          {t('sign_in_with_apple')}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
