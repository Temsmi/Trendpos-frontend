'use client'
import Image from 'next/image'
import { TbSun, TbCalendar, TbClock } from 'react-icons/tb'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import cx from 'classnames' // Import classnames library
import InfoSearch from '../dashboard/info-search'
import { signOut } from 'next-auth/react'
import Button from '@/components/button'
import { UserInfo, UserInfoType } from '@/lib/types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setBranchId } from '@/store/current-account-slice'

const getDate = (locale: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Istanbul',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  const istanbulDateTime = new Date().toLocaleString(locale, options)
  return istanbulDateTime
}
const getTime = (locale: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Istanbul',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }
  const istanbulDateTime = new Date().toLocaleString(locale, options)
  return istanbulDateTime
}

type HeaderProps = {
  weather: string
  degrees: number
  userInfo: UserInfoType | null
}

const DashboardNavbar = ({ userInfo, weather, degrees }: HeaderProps) => {
  const t = useTranslations('sales')
  const dispatch = useDispatch()


  const iconTextClass = cx('text-[#ff8f1e]', 'text-2xl', 'font-semibold')
  const textClass = cx('text-black', 'text-sm', 'font-semibold', 'font-Barlow')
  const locale = typeof window !== 'undefined' ? localStorage.getItem('locale') : 'tr'
  const date = getDate(locale || 'tr')

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' ) {
      dispatch(setBranchId(userInfo?.branchId))
    }    
  }, [userInfo?.branchId])

  return (
    <header className='w-full bg-white py-6 shadow-md'>
      <div className='flex h-full items-center justify-between gap-16 px-16'>
        <div className='flex items-center gap-4 md:gap-16'>
          <Link href='/'>
            <Image
              src='/images/trendpos-logo-orange.svg'
              alt='trendpos-logo-orange'
              width={185}
              height={34}
              className='shrink-0 object-contain'
            />
            <Image src='/images/prevered-by-trendbox.svg' alt='Trendbox Logo' width={85} height={38} />
          </Link>
        </div>

        {userInfo ? <InfoSearch userInfo={userInfo} /> : <p>No user data available</p>}

        <div className='flex h-full shrink-0 flex-col items-start gap-2 2xl:flex-row-reverse 2xl:items-center'>
          <Button
            className='ml-2.5 rounded bg-orange-400 px-4 py-2 font-bold text-white hover:bg-orange-500'
            onClick={() => signOut()}>
            {t('logout')}
          </Button>
          <div className='flex items-center gap-2'>
            <TbSun className={iconTextClass} />
            <span className={textClass}>
              {degrees}° {weather}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <TbCalendar className={iconTextClass} />
            <span className={textClass}>{date}</span>
          </div>
          <div className='flex items-center gap-2'>
            <TbClock className={iconTextClass} />
            <span className='font-Barlow text-sm font-semibold text-black'>
              {currentTime.toTimeString().slice(0, 5)}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardNavbar
