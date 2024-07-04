'use client'
import Image from 'next/image'
import LanguageSelect from '@/components/language-select'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Button from '../button'
import { signOut } from 'next-auth/react'
import { Icon } from '@/components/icons'
import { UserInfoType } from '@/lib/types'

type HeaderProps = {
  locale: string
  type?: 'public' | 'auth'
  userInfo?: UserInfoType | null
}

const Header: React.FC<HeaderProps> = ({ locale, type, userInfo }) => {
  const t = useTranslations('auth') // change to auth

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customers')
      localStorage.removeItem('branchId')
    }

    await signOut({ redirect: false })
    window.location.href = '/login'
  }

  return (
    <>
      <header className='relative z-10 h-24 w-full bg-white py-6 shadow-md'>
        <div className='flex h-full items-center justify-between gap-2 px-10'>
          <div className='flex items-center gap-4 md:gap-16'>
            {type == 'public' && <div className='w-6'></div>}
            <Link href='/'>
              <Image
                src='/images/trendpos-logo-orange.svg'
                alt='trendpos-logo-orange'
                width={185}
                height={38}
                className='select-none object-contain'
              />
              <Image src='/images/prevered-by-trendbox.svg' alt='Trendbox Logo' width={85} height={38} />
            </Link>
          </div>
          {userInfo ? <h2 className='text-sm text-[#A2A2A2]'>{`${userInfo?.name} ${userInfo?.surname}`}</h2> : null}
          <div className='flex h-full gap-4 '>
            {/* {type == 'auth' ? null : (
              <div className="flex h-full items-center justify-center rounded-xl border border-[#D9D9D9] px-3 transition-all hover:bg-orange-400 hover:text-white">
                <TbSettings className="shrink-0 cursor-pointer text-2xl" />
              </div>
            )} */}
            <LanguageSelect locale={locale} />
            {type == 'auth' ? (
              <Button href='/login'>{t('login')}</Button>
            ) : (
              <Button
                onClick={handleLogout}
                variant='outlineOpacity'
                className='gap-[6px] border-none bg-[#F2F2F2]'
                size='small'>
                <Icon name='logout' className='text-2xl' color='black' />
                {t('logout')}
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
