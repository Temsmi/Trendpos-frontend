'use client'

import Input from '@/components/input/input'
import { Listbox, Switch } from '@headlessui/react'
import { TbChevronDown } from 'react-icons/tb'
import { useState } from 'react'
import classNames from 'classnames'
import Button from '../button'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { changeCurrency, changeDiscountTotalAmount, changePaidAmount } from '@/store/customersStore'
import { log } from 'node:util'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

type OptionType = { id: number; name: string; default?: boolean; unavailable?: boolean }

const options = [
  { id: 1, name: 'TRY', default: true },
  { id: 2, name: 'USD', unavailable: false },
  { id: 3, name: 'EUR', unavailable: false }
]

type Currency = {
  label: string
  value: string
}

const Cashback = ({ currencies }: { currencies: Currency[] }) => {
  const [selectedValue, setSelectedValue] = useState<Currency | undefined>(
    currencies.find(item => item.value === 'TRY')
  )
  const [enabled, setEnabled] = useState(false)
  const state = useSelector((state: RootState) => state.customers)
  const activeCustomer = state.customers.find(customer => customer.id === state.activeCustomerId)
  const dispatch = useDispatch()
  const t = useTranslations('sales')
  const button = [
    { id: 1, label: '10', value: 10, imageSrc: '/images/10TL.jpg', width: 40, height: 24 },
    { id: 2, label: '20', value: 20, imageSrc: '/images/20TL.jpg', width: 40, height: 24 },
    { id: 3, label: '50', value: 50, imageSrc: '/images/50TL.jpg', width: 40, height: 24 },
    { id: 4, label: '100', value: 100, imageSrc: '/images/100TL.jpg', width: 40, height: 24 },
    { id: 5, label: '200', value: 200, imageSrc: '/images/200TL.jpg', width: 40, height: 24 },
    { id: 6, label: '+5', value: activeCustomer?.paidAmount ? activeCustomer.paidAmount + 5 : +5, imageSrc: '/images/5TL.jpg', width: 40, height: 24 },
    { id: 7, label: '+10', value: activeCustomer?.paidAmount ? activeCustomer.paidAmount + 10 : +10, imageSrc: '/images/10TL.jpg', width: 40, height: 24 }
  ]

  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <h2 className='whitespace-nowrap text-sm font-medium text-black'>{t('fast_money')}</h2>
        <div className='flex justify-between gap-2 overflow-auto'>
          {button.map(item => (
            <Button
              key={item.id}
              onClick={() => dispatch(changePaidAmount(item.value))}
              variant='outlineOpacity'
              size='square'
              className='h-auto border-none !bg-[#F1F1F1] flex flex-col items-center justify-center'>
              {item.label}
              <Image src={item.imageSrc} alt={item.label} width={item.width} height={item.height} />
            </Button>
          ))}
        </div>
      </div>
      <div className='flex w-full items-center gap-4'>
        <div className='flex w-full flex-col gap-2'>
          <h2 className='whitespace-nowrap text-sm font-medium text-black'>{t('discount')}</h2>
          <div className='relative w-full'>
            <Input
              name='count'
              type='number'
              step='0.01'
              value={
                Number(activeCustomer?.discountTotalAmount).toString() >= '0'
                  ? Number(activeCustomer?.discountTotalAmount).toString()
                  : ''
              }
              onChange={e => dispatch(changeDiscountTotalAmount(Number((+e.target.value).toFixed(2))))}
              size='large'
              label='İsk. Değeri'
              className='!rounded-xl !border-[#DEDEDE] !bg-[#F1F1F1] placeholder:!text-[#A3A3A3]'
            />
            <Listbox
              value={activeCustomer?.currencyId}
              onChange={e => dispatch(changeCurrency(e))}
              as='div'
              className='absolute right-0 top-0 z-10 flex h-full cursor-pointer flex-col items-center border-l border-[#DEDEDE] '>
              {({ open }) => (
                <>
                  <Listbox.Button
                    className={classNames(
                      'flex items-center gap-1 rounded-tr-xl px-6 py-4 text-sm font-semibold text-[#72748C]',
                      {
                        'bg-[#DEDEDE]': open
                      }
                    )}>
                    {currencies.find(item => item.value === activeCustomer?.currencyId)?.label}
                    <TbChevronDown
                      className={classNames('h-6 w-6 stroke-[3px] transition', {
                        'rotate-180': open
                      })}
                    />
                  </Listbox.Button>
                  <Listbox.Options className='-mt-0.5 w-full rounded-b-xl bg-[#FDFDFD] text-sm text-[#72748C]'>
                    {currencies.map(item => (
                      <Listbox.Option
                        key={item.value}
                        value={item.value}
                        className='px-3 py-1 last:rounded-b-xl hover:bg-[#99999910]'>
                        {item.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </>
              )}
            </Listbox>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cashback
