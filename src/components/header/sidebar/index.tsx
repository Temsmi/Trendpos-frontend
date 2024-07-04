'use client'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import GetHeaderData from '@/components/header/header-data'
import Dropdown from '@/components/dropdown'
import Button from '@/components/button'
import { TbChevronLeft, TbMenu2 } from 'react-icons/tb'
import { useTranslations } from 'next-intl'

const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const t = useTranslations('menu')
  const HeaderData = GetHeaderData(t)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        hamburgerRef.current &&
        closeButton.current &&
        (closeButton.current.contains(event.target as Node) || hamburgerRef.current.contains(event.target as Node))
      ) {
        return
      } else if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false)
      } else if (sidebarRef.current && sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div
      className={classNames(
        'min-h-[calc(100vh-96px)] border-r border-gray-200 bg-white px-5 py-4 text-black shadow-[0px_4px_11.8px_0px_rgba(0,0,0,0.14)] transition-all duration-300',
        {
          ' w-[340px]': isSidebarOpen,
          ' w-[102px]': !isSidebarOpen
        }
      )}>
      <div ref={hamburgerRef} className='absolute left-10 top-9 z-50' onClick={() => toggleSidebar()}>
        <TbMenu2 className='block shrink-0 cursor-pointer text-2xl text-[#72748C]' />
      </div>
      <div ref={sidebarRef} className='flex h-full flex-col gap-2.5 py-4'>
        {HeaderData.map((item, index) => {
          const IconComponent = item.icon
          return (
            <Dropdown
              key={index}
              data={item}
              theme='light'
              size='lg'
              className={classNames('rounded-xl', {
                'w-[62px] bg-[#FAFAFA] transition-all': !isSidebarOpen
              })}>
              <IconComponent className='stroke-[1.5px] text-3xl' />
            </Dropdown>
          )
        })}

        <div
          ref={closeButton}
          onClick={() => toggleSidebar()}
          className='mt-auto flex w-full items-center justify-center'>
          <Button
            size='square'
            variant='outline'
            className={classNames('rounded-full', {
              '!bg-[#E9E9E9]': isSidebarOpen,
              'bbbb bg-gradient-to-b from-orange-500 to-amber-500': !isSidebarOpen
            })}>
            <TbChevronLeft
              className={classNames('stroke-[2.5px] text-2xl', {
                'text-[#72748C]': isSidebarOpen,
                ' rotate-180 text-white': !isSidebarOpen
              })}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
