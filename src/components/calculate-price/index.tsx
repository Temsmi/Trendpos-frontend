'use client'
import { Icon as IconComponent } from '@/components/icons'
import Input from '@/components/input/input'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { changePaidAmount } from '@/store/customersStore'
import { useTranslations } from 'next-intl'

type IconProps = {
  name: string
}
const Icon: React.FC<IconProps> = ({ name }) => {
  return <IconComponent name={name} color='#000' />
}
type TitleProps = {
  children: React.ReactNode
}
const Title: React.FC<TitleProps> = ({ children }) => {
  return <span className='flex w-full items-center gap-2 text-start text-sm font-semibold text-black'>{children}</span>
}
const Root = ({ children, size }: { children: React.ReactNode; size?: 'small' | 'large' }) => {
  return (
    <div
      className={classNames(
        'flex w-full flex-col items-center justify-center gap-2.5',

        size === 'large' ? 'max-w-[200px]' : ' max-w-[125px]'
      )}>
      {children}
    </div>
  )
}

const CalculatePrice = () => {
  const state = useSelector((state: RootState) => state.customers)
  const activeCustomer = state.customers.find(customer => customer.id === state.activeCustomerId)
  const dispatch = useDispatch()
  const t = useTranslations('sales')
  let cashback: string | number = 0

  if (activeCustomer) {
    const amountAfterDiscount = +(activeCustomer.totalAmount - activeCustomer.discountTotalAmount).toFixed(2)

    if (amountAfterDiscount < 0) {
      cashback = 0
    } else {
      cashback =
        activeCustomer.paidAmount - amountAfterDiscount > 0
          ? (activeCustomer.paidAmount - amountAfterDiscount).toFixed(2)
          : 0
    }
  }
  return (
    <div className='mt-6 flex items-center gap-2'>
      <Root size='large'>
        <Title>
          <Icon name='paid' /> {t('paid')}
        </Title>
        <Input
          name='paid'
          srOnly
          label='Ödenen'
          type='number'
          placeholder='0.00'
          value={Number(activeCustomer?.paidAmount).toString()}
          onChange={e => dispatch(changePaidAmount(Number((+e.target.value).toFixed(2))))}
          className=' border-[#D2D2D2] text-right font-semibold'
        />
      </Root>
      <Root size='large'>
        <Title>
          <Icon name='amount' /> {t('amount')}
        </Title>
        <Input
          name='amount'
          srOnly
          label='Tutar'
          type='number'
          disabled
          value={
            activeCustomer?.totalAmount
              ? +(activeCustomer.totalAmount - activeCustomer.discountTotalAmount).toFixed(2) > 0
                ? (activeCustomer.totalAmount - activeCustomer.discountTotalAmount).toFixed(2)
                : 0
              : 0
          }
          className=' border-[#D2D2D2] text-right font-semibold '
        />
      </Root>
      <Root size='large'>
        <Title>
          <Icon name='cashback' /> {t('change')}
        </Title>
        <Input
          name='cashback'
          srOnly
          label='Para üstü'
          type='number'
          disabled
          value={cashback}
          className=' border-[#D2D2D2] text-right font-semibold '
        />
      </Root>
    </div>
  )
}

export default CalculatePrice
