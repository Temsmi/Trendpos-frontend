'use client'
import classNames from 'classnames'
import { Menu } from '@headlessui/react'
import { TbChevronDown, TbChevronRight } from 'react-icons/tb'
import Link from 'next/link'
import Select from 'react-select'

type Option = {
  id: string
  name: string
  href?: string
  submenu?: { id: string; name: string; href: string }[]
}

type DataItem = {
  name: string
  options: Option[]
}

type DropdownProps = {
  data: DataItem
  children?: React.ReactNode
  className?: string
  size?: 'default' | 'lg'
  theme?: 'light' | 'dark'
  isAbsolute?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({
  data,
  children,
  className,
  size = 'default',
  theme = 'light',
  isAbsolute = false,
  ...props
}) => {
  const menuButtonClass = (open: boolean) =>
    classNames(
      'flex items-center gap-1.5 rounded-[10px] pl-4 group p-3 text-sm w-full font-medium leading-none outline-0 hover:bg-[linear-gradient(96deg,_#ff761e_30%,#ff8e1f_135%)] hover:text-white overflow-hidden text-ellipsis',
      {
        'py-4 gap-7': size === 'lg',
        'bg-[linear-gradient(96deg,_#ff761e_30%,#ff8e1f_135%)] text-white': open
      }
    )

  const chevronClass = (open: boolean) =>
    classNames('group-hover:text-white text-[#72748C] h-6 w-6 shrink-0', {
      'rotate-180 text-white': open
    })

  const linkClass = () =>
    classNames(
      'cursor-pointer py-2.5 transition-all flex items-center justify-between pl-5 pr-3 hover:bg-[#ff741e31] rounded-[10px]'
    )

  const submenuButonClass = (open: boolean) =>
    classNames(
      'flex items-center group gap-1.5 rounded-[10px] py-2.5 pl-5 pr-3 text-sm w-full font-medium leading-none outline-0 hover:bg-[linear-gradient(96deg,_#ff761e_30%,#ff8e1f_135%)] hover:text-white',
      {
        'bg-[linear-gradient(96deg,_#ff761e_30%,#ff8e1f_135%)] text-white': open
      }
    )

  return (
    <div className={classNames('relative', className)}>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className={menuButtonClass(open)} {...props}>
              <span className='shrink-0'>{children}</span>
              <span className='w-full text-left text-sm'>{data.name}</span>
              <TbChevronDown className={chevronClass(open)} />
            </Menu.Button>
            <Menu.Items
              className={classNames(
                'mt-1 w-full overflow-hidden whitespace-nowrap rounded-[10px] bg-white text-left text-sm font-medium leading-none outline-0',
                {
                  'absolute shadow-sm': isAbsolute
                }
              )}>
              {data.options.map(option =>
                option.submenu ? (
                  <Menu key={option.id ?? option.name}>
                    {({ open }) => (
                      <>
                        <Menu.Button className={submenuButonClass(open)} {...props}>
                          <span className='w-full text-left text-sm'>{option.name}</span>
                          <TbChevronDown className={chevronClass(open)} />
                        </Menu.Button>

                        <Menu.Items
                          className={classNames(
                            'mt-1 w-full overflow-hidden bg-white text-left text-sm font-medium leading-none outline-0'
                          )}>
                          {option.submenu!.map(subOption => (
                            <Menu.Item key={subOption.id ?? subOption.name} disabled>
                              <Link href={subOption.href} className={`pl-7 ,${linkClass()}`}>
                                {subOption.name}
                                <TbChevronRight className={chevronClass(false)} />
                              </Link>
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </>
                    )}
                  </Menu>
                ) : (
                  <Menu.Item key={option.id ?? option.name} disabled>
                    <Link href={option.href!} className={linkClass()}>
                      {option.name}
                      <TbChevronRight className={chevronClass(false)} />
                    </Link>
                  </Menu.Item>
                )
              )}
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  )
}

export default Dropdown
