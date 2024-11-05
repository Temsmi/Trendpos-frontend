import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Modal from '../popup/modal-form'
import Button from '@/components/button/index'
import Input from '@/components/input/input'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import useCustomToast from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { RootState } from '@/lib/store'
import { closeModal, setIsClickOutsideEnabled } from '@/store/modalSlice'
import fetchClient from '@/lib/fetch-client'


interface ProductReturnFormData {
  barcode: string
  quantity: number
  transactionId: number
}

const ProductReturnModal: React.FC = () => {
  const { register, handleSubmit, control } = useForm<ProductReturnFormData>()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('product') // Default to 'product' tab
  const toast = useCustomToast()
  const t = useTranslations('return-product')

  // Redux integration
  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'productReturn' && modal.isOpen)
  )
  const dispatch = useDispatch()

  const handleCloseModal = () => {
    dispatch(closeModal('productReturn'))
  }
  useEffect(() => {
    if (isModalOpen) {
      dispatch(setIsClickOutsideEnabled(false))
    }

    return () => {dispatch(setIsClickOutsideEnabled(true))}
  }, [isModalOpen])
  const onSubmit: SubmitHandler<ProductReturnFormData> = async data => {
    setLoading(true)
    try {

      const url = activeTab === 'product' ? '/return/product' : '/return/invoice'
      const response = await fetchClient(url, {
        method: 'POST',
        data: data
      })
      const responseBody = await response.json()
      toast({
        type: 'success',
        message: responseBody.message
      })
    } catch (error: any) {
      if (error instanceof Response) {
        error = await error.json()
      }
      toast({
        type: 'error',
        message: error.message
      })
    }
  }

  return (
    <>
      {isModalOpen && (
        <Modal
          id='productReturn'
          name={t('product_return')}
          onClose={handleCloseModal}
          onSave={handleSubmit(onSubmit)}
          firstButtonName={t('cancel')}
          secondButtonName={t('confirm')}>
          <div className='flex col-span-2 gap-3.5'>
            <Button
              variant={activeTab === 'product' ? 'outlineOrange' : 'outlineOpacity'}
              size='small'
              className={activeTab === 'product' ? 'active' : ''}
              onClick={() => setActiveTab('product')}>
              {t('product_returns')}
            </Button>
            <Button
              variant={activeTab === 'transaction' ? 'outlineOrange' : 'outlineOpacity'}
              className={activeTab === 'transaction' ? 'active' : ''}
              onClick={() => setActiveTab('transaction')}>
              {t('invoice_returns')}
            </Button>
          </div>
          {activeTab === 'product' && (
            <>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1 px-1 mt-3 text-left'>
                  <p>{t('barcode')}</p>
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1'>
                  <Controller
                    name='barcode'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('barcode')}
                        placeholder={t('barcode')}
                        name={name}
                        type='text'
                        value={value}
                        onChange={e => onChange(e.target.value === '' ? '' : e.target.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1 px-1 mt-3 text-left'>
                  <p>{t('quantity')}</p>
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1'>
                  <Controller
                    name='quantity'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('quantity')}
                        placeholder={t('quantity')}
                        name={name}
                        type='number'
                        value={value}
                        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {activeTab === 'transaction' && (
            <>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1 px-1 mt-5 text-left'>
                  <p>{t('transaction_id')}</p>
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1'>
                  <Controller
                    name='transactionId'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('transaction_id')}
                        placeholder={t('transaction_id')}
                        name={name}
                        type='number'
                        value={value}
                        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    )}
        
                  />
                </div>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  )
}

export default ProductReturnModal
