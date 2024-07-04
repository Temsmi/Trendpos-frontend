'use client'
import Button from '../../button'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCustomer } from '@/store/customersStore'
import { RootState } from '@/lib/store'
import { cn } from '@/lib/utils'
import { TbTrash } from 'react-icons/tb'
import { useTranslations } from 'next-intl'

const ResetCustomer = () => {
  const state = useSelector((state: RootState) => state.customers)
  const customers = state.customers
  const activeCustomerId = state.activeCustomerId
  const dispatch = useDispatch()
  const t = useTranslations('sales')
  return (
    <div
      className={cn(
        'flex py-4 bottom-0 right-4 justify-end gap-6 items-center',
        customers.find(customer => customer.id == activeCustomerId)?.cart.length == 0 ? 'hidden' : ''
      )}>
      <Button
        onClick={() => dispatch(deleteCustomer())}
        variant='outlineOpacity'
        className='flex justify-between gap-2 rounded-lg px-3 py-4'>
        <TbTrash className='shrink-0 text-base text-[#FF3F3F]' />
        <p>{t('clear_cart')} </p>
      </Button>
    </div>
  )
}

export default ResetCustomer
