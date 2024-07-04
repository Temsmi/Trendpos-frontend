'use client'

import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { TbChevronDown, TbChevronUp } from 'react-icons/tb'

type SelectData = {
  id: number
  name: string
  unavailable: boolean
}

type SelectProps = {
  label?: string
  name?: string
  srOnly?: boolean
  className?: string
  disabled?: boolean
  value?: string
  options?: any[]
  data: SelectData[]
}

const Select: React.FC<SelectProps> = ({ label, data, ...props }) => {
  const [selected, setSelected] = useState<SelectData>(data[0] || undefined)
  const [open, setOpen] = useState(false)

  return (
    <div className='flex w-full flex-col gap-2'>
      <label htmlFor='' className='text-sm font-medium text-black'>
        {label}
      </label>
      <Listbox value={selected} onChange={(e: SelectData) => setSelected(e)} {...props}>
        <div className='relative w-full'>
          <Listbox.Button className='relative w-full cursor-default rounded-lg border border-gray-100 bg-[#FDFDFD] px-4 py-3 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            <span className={`block truncate text-sm font-medium ${props.disabled ? 'text-black/50' : 'text-black'}`}>{selected.name}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <TbChevronDown className='h-5 w-5 text-[#72748C]' aria-hidden='true' />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-[#FDFDFD] p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {data?.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  disabled={item.unavailable}
                  className={({ active }) =>
                    `relative cursor-pointer select-none rounded-md px-4 py-2 transition-colors ${
                      active ? ' bg-[#72748C]/10' : 'text-gray-900'
                    }`
                  }
                  value={item}>
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'} ${
                          item.unavailable ? 'sr-only' : ''
                        }`}>
                        {item.name}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default Select
