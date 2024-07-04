import React, { forwardRef } from 'react'
import Button from '../button'
import { Icon } from '../icons'
import { ProductType } from '@/lib/types'
import { useTranslations } from 'next-intl'

type IncrementDecrementProps = {
  name: string
  minValue?: number
  setValue: (value: number) => void
  value: number
  product: ProductType
}

const IncrementDecrement = forwardRef<HTMLInputElement, IncrementDecrementProps>(
  ({ name, setValue, value, minValue = 0, product, ...props }, ref) => {
    const t = useTranslations('sales')
    const step = product.weightType === 'TERAZİ' ? 0.001 : 1
    const unitText = product.weightType === 'TERAZİ' ? 'kg' : t('piece')

    const increment = (): void => {
      setValue(Math.max(minValue, Number(value) + step))
    }

    const decrement = (): void => {
      setValue(Math.max(minValue, Number(value) - step))
    }

    return (
      <div className='flex h-6 w-28 items-center justify-center rounded-md bg-gradient-to-b from-[#FF761E] to-[#FF8E1F]'>
        <Button
          type='button'
          variant='outlineOpacity'
          className='h-4 w-4 rounded-sm border-none px-0 py-0'
          size='square'
          onClick={decrement}>
          <Icon name='minus' color='#FF761E'></Icon>
        </Button>
        <div className='flex items-center justify-between'>
          <input
            ref={ref}
            id={'quantity'}
            name='quantity'
            value={Number(value).toFixed(product.weightType === 'TERAZİ' ? 3 : 0)}
            onChange={e => setValue(+e.target.value)}
            {...props}
            className={
              product.weightType === 'TERAZİ'
                ? 'focus-none ml-1 mr-2 w-8 bg-gradient-to-b from-[#FF761E] to-[#FF8E1F] text-right text-xs text-white'
                : 'focus-none ml-2 mr-2 w-4 bg-gradient-to-b from-[#FF761E] to-[#FF8E1F] text-center text-xs text-white'
            }
            type='text'
            readOnly={product.weightType === 'TERAZİ'}
          />
          <span className='mr-2 text-xs text-white'>{product.weightType === 'TERAZİ' ? 'Kg' : t('piece')}</span>
        </div>
        <Button
          type='button'
          variant='outlineOpacity'
          className='m h-4 w-4 rounded-sm border-none px-0 py-0'
          size='square'
          onClick={increment}>
          <Icon name='plus' color='#FF761E'></Icon>
        </Button>
      </div>
    )
  }
)

IncrementDecrement.displayName = 'IncrementDecrement'

export default IncrementDecrement
