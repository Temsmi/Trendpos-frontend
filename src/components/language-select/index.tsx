'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Menu } from '@headlessui/react'
import { TbChevronDown } from 'react-icons/tb'
import { Link } from '@/navigation'
import { TbWorld } from 'react-icons/tb'

type Option = {
  id: string
  name: string
  locale: 'tr' | 'en'
  href: string
}

type Data = {
  name: string
  options: Option[]
}

const data: Data = {
  name: 'Dil Seçimi',
  options: [
    { id: 'tr', name: 'TR', locale: 'tr', href: '/tr' },
    { id: 'en', name: 'EN', locale: 'en', href: '/en' }
  ]
}

type LanguageSelectProps = {
  className?: string
  locale: string
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ className, locale, ...props }) => {
  useEffect(() => {
    localStorage.setItem('locale', locale ?? 'tr')
  }, [])

  const pathname = usePathname()
  const [selectedData, setSelectedData] = useState<Option>(
    data.options.find(option => option.locale === locale) || data.options[0]
  )

  const menuButtonClass = (open: boolean) =>
    classNames(
      'flex items-center border border-black/10 gap-1.5 rounded-[10px] p-3 text-sm font-medium leading-none outline-0 group hover:bg-[linear-gradient(96deg,_#ff761e_30%,#ff8e1f_135%)] hover:!text-white',
      {
        'bg-[linear-gradient(96deg,_#ff761e_30%,#ff8e1f_135%)] text-white': open
      }
    )

  const chevronClass = (open: boolean) =>
    classNames('group-hover:text-white h-4 w-4 text-[#BBBBBB]', {
      'rotate-180 text-white': open
    })

  const linkClass = (active: boolean) =>
    classNames('cursor-pointer py-2.5 transition-all flex items-center justify-center', {
      'bg-[#ff741e31]': active
    })

  return (
    <div className={classNames('relative z-50 w-fit', className)}>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className={menuButtonClass(open)} {...props}>
              <TbWorld className='stroke-[1.5px] text-2xl' />
              <span className='text-sm'>{selectedData.name}</span>
              <TbChevronDown className={chevronClass(open)} />
            </Menu.Button>
            <Menu.Items className='absolute mt-1 w-full overflow-hidden rounded-[10px] border border-black/10 bg-white text-left text-sm font-medium leading-none shadow-sm outline-0'>
              {data.options.map(option => (
                <Menu.Item key={option.id ?? option.name}>
                  {({ active }) => (
                    <Link
                      locale={option.locale}
                      href={pathname}
                      onClick={() => setSelectedData(option)}
                      className={linkClass(active)}>
                      {option.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  )
}

export default LanguageSelect
