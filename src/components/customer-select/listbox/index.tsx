'use client'

import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { TbChevronUp, TbChecklist } from 'react-icons/tb'
import { useTranslations } from 'next-intl'

type CustomerSelectListBoxProps = {}

const CustomerSelectListBox: React.FC<CustomerSelectListBoxProps> = ({}) => {
  const t = useTranslations('sales')

  const customer = [
    { id: 1, name: t('select_customer'), unavailable: true },
    { id: 2, name: t('customer') + ' 1', unavailable: false },
    { id: 3, name: t('customer') + ' 2', unavailable: false },
    { id: 4, name: t('customer') + ' 3', unavailable: false },
    { id: 5, name: t('customer') + ' 4', unavailable: false },
    { id: 6, name: t('customer') + ' 5', unavailable: false }
  ]

 

  const [selected, setSelected] = useState(customer[0])

  return (
    <div className='flex w-full flex-col gap-2'>
      <label htmlFor='' className='text-sm font-medium text-black'>
        {t('select_customer')}
      </label>
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative w-full'>
          <Listbox.Button className='relative w-full cursor-default rounded-lg border border-[#D2D2D2] bg-[#F1F1F1] py-4 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            <span className='block truncate text-sm font-medium text-[#A3A3A3]'>{selected.name}</span>
          </Listbox.Button>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#D2D2D2] bg-[#F1F1F1] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {customer.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  disabled={person.unavailable}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 transition-colors first:py-0 ${
                      active ? 'bg-[#D2D2D2]/70' : 'text-gray-900'
                    }`
                  }
                  value={person}>
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'} ${
                          person.unavailable ? 'sr-only' : ''
                        }`}>
                        {person.name}
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

export default CustomerSelectListBox
