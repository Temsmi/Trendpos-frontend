'use client'
import classNames from 'classnames'
import { Menu } from '@headlessui/react'
import { TbChevronDown } from 'react-icons/tb'

type Option = {
  id: string
  name: string
}

export type Data = {
  name: string
  options: Option[]
}

type BranchSelectProps = {
  className?: string
  data: Data
}

const BranchSelect: React.FC<BranchSelectProps> = ({ className, data, ...props }) => {
  const menuButtonClass = (open: boolean) =>
    classNames(
      'flex items-center border border-black/10 justify-between w-full rounded-[10px] p-3 text-sm font-medium leading-none outline-0 group hover:bg-[linear-gradient(96deg,_#ff761e_30%,#ff8e1f_135%)] hover:!text-white',
      {
        'bg-[linear-gradient(96deg,_#ff761e_30%,#ff8e1f_135%)] text-white': open
      }
    )

  const chevronClass = (open: boolean) =>
    classNames('group-hover:text-white h-4 w-4 text-[#BBBBBB]', {
      'rotate-180 text-white': open
    })

  return (
    <div className={classNames(className)}>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className={menuButtonClass(open)} {...props}>
              <span className='text-sm'>{data.name}</span>
              <TbChevronDown className={chevronClass(open)} />
            </Menu.Button>
            <Menu.Items className='absolute mt-1 w-full overflow-hidden rounded-[10px] border border-black/10 bg-white text-left text-sm font-medium leading-none shadow-sm outline-0'>
              {data.options.map(option => (
                <Menu.Item key={option.id ?? option.name}>{option.name}</Menu.Item>
              ))}
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  )
}

export default BranchSelect
