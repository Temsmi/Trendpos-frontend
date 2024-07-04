'use client'
import { Icon } from '@/components/icons'
import Image from 'next/image'
import { KeyboardEventHandler, useEffect, useState } from 'react'
import { UserInfo } from '@/lib/types'
import { useTranslations } from 'next-intl'

type InfoSearchProps = {
  userInfo: UserInfo['data']
}

const InfoSearch: React.FC<InfoSearchProps> = ({ userInfo }) => {
  const [query, setQuery] = useState('')
  const t = useTranslations('dashboard')

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && query.trim() !== '') {
      handleSearch()
    }
  }
  const handleSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
    setQuery('')
  }
  return (
    <div className='flex h-16 w-full flex-1 items-center justify-center gap-4 xl:gap-8'>
      <div className='flex flex-col items-start whitespace-nowrap'>
        <p className='text-base text-[#A2A2A2]'>{t('welcome')}</p>
        <h1 className='truncate text-xl font-semibold'>{userInfo.storeName || 'Market'}</h1>
        <h2 className='text-sm text-[#A2A2A2]'>{`${userInfo?.name} ${userInfo?.surname}`}</h2>
      </div>
      <div className='relative w-full max-w-3xl'>
        <i className='absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform'>
          <Icon name='search' color='#7A7A7A' />
        </i>
        <input
          type='text'
          placeholder={t('search_box_placeholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className='w-full rounded-full bg-[#F1F1F1] p-4 px-12 focus:outline-none'
        />
        <Image
          src='images/google.svg'
          alt='Google Logo'
          className='absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 transform cursor-pointer'
          onClick={handleSearch}
          width={24}
          height={24}
        />
      </div>
    </div>
  )
}

export default InfoSearch
