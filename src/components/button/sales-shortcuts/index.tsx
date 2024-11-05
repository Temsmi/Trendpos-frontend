'use client'

import { TiPlus } from 'react-icons/ti'
import { Icon } from '../../icons'
import Button from '../../button'
import { useDispatch } from 'react-redux'
import { openModal } from '@/store/modalSlice'
import CreateProductModal from '@/components/create-product-modal'
import CreateLabelModal from '@/components/create-label-modal'
import ProductReturnModal from '@/components/product-return-modal'

import { useTranslations } from 'next-intl'

const ShortcutsButton = () => {
  const dispatch = useDispatch()

  const handleCreateProductClick = () => {
    dispatch(openModal({ id: 'createProduct' }))
  }
   
  const handleCreateLabelClick = () => {
    dispatch(openModal({ id: 'itemLabel' }))
  }

  const handleProductReturnClick = () => {
    dispatch(openModal({ id: 'productReturn' }))
  }

  const t = useTranslations('sales')

  return (
    <div className='flex flex-col gap-3.5'>
      <div className='flex flex-row space-x-3'>
        <Button
          variant='outlineOpacity'
          className='flex grow justify-around gap-2 rounded-lg px-3 py-4'
          onClick={handleCreateProductClick}>
          <CreateProductModal />
          <TiPlus className='shrink-0 text-sm text-[#72748C]' />
          <p>{t('define_new_product')}</p>
        </Button>
        <Button
          disabled={false}
          variant='outlineOpacity'
          className='flex grow justify-around gap-2 rounded-lg px-3 py-4'
          onClick={handleCreateLabelClick}>
            <CreateLabelModal />
          <Icon name='invoice' className='shrink-0 text-[#72748C]' />
          <p>{t('ask_for_price')}</p>
        </Button>
      </div>
      <div className='flex flex-row space-x-3'>
        <Button
          disabled={true}
          variant='outlineOpacity'
          className='flex grow cursor-not-allowed justify-around gap-2 rounded-lg bg-[#F2F2F2] px-3 py-4'>
          <Icon name='invoice' className='shrink-0 text-[#72748C]' />
          <p>{t('print_invoice')}</p>
        </Button>
        <Button
          disabled={false}
          variant='outlineOpacity'
          className='flex grow justify-around gap-2 rounded-lg px-3 py-4'
          onClick={handleProductReturnClick}>
          <ProductReturnModal />
          <Icon name='tag' className='shrink-0 text-[#72748C]' />
          <p>{t('product_return')}</p>
        </Button>
      </div>
    </div>
  )
}

export default ShortcutsButton
