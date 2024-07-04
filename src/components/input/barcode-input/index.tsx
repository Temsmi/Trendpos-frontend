'use client'
import { Icon } from '@/components/icons'
import classNames from 'classnames'
import type { RootState } from '@/lib/store'
import { useSelector, useDispatch } from 'react-redux'
import { addProduct, deleteCustomer } from '@/store/customersStore'
import { set, useForm } from 'react-hook-form'
import Input from '@/components/input/input'
import fetchClient from '@/lib/fetch-client'
import React, { useState, useEffect, useRef } from 'react'
import { ProductType } from '@/lib/types'
import { toast } from 'react-toastify'
import Modal from '@/components/popup/modal-form'
import { useTranslations } from 'next-intl'
import { closeModal, openModal, setIsClickOutsideEnabled } from '@/store/modalSlice'
import { setProductName } from '@/store/productDetail'

type BarcodeInputProps = {
  className?: string
  name: string
  label: string
  placeholder?: string
  type?: 'string'|'text' | 'number'
  srOnly?: boolean
  required?: boolean
  ref?: React.ForwardedRef<HTMLInputElement>
}

const BarcodeInput: React.FC<BarcodeInputProps> = ({
  className,
  name,
  label,
  placeholder,
  type = 'text',
  srOnly = true,
  required = true,
  ...props
}) => {
  const customers = useSelector((state: RootState) => state.customers.customers)
  const dispatch = useDispatch()
  const { register, handleSubmit, setValue } = useForm()
  const [productDetail, setProductDetail] = useState<ProductType>()
  const [weightID, setWeightID] = useState(0)
  const inputRef = useRef<any>(null)
  const isClickOutsideEnabled = useSelector((state: RootState) => state.modal.isClickOutsideEnabled)
  const [barcode, setBarcode] = useState<string>()

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'terazi' && modal.isOpen)
  )
  const isCreateProductModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'createProduct' && modal.isOpen)
  )
  const showPopup = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'saveBarcode' && modal.isOpen)
  )
  const productDetailName = useSelector((state: RootState) => state.productDetail.name);


  const onSubmit = async (data: any) => {
    try {
      const response = await fetchClient('/branch-catalog/' + data.barcode)
      const product = await response.json()
      setProductDetail(product.data)

      if (product.data.weightType === 'TERAZİ') {
        dispatch(
          openModal({
            id: 'terazi'
          })
        )
      } else {
        dispatch(addProduct({ ...product.data, quantity: 1 }))
      }
      dispatch(setProductName(product.data.name))

    } catch (error) {
      if (error instanceof Response) dispatch(openModal({id:'saveBarcode', barcode:data.barcode}))
    }

    setValue('barcode', '')
    setBarcode(data.barcode)
  }

  const handleClosePopup = () => {
    dispatch(closeModal('saveBarcode'))
  }
  const handleLink = () => {
    dispatch(closeModal('saveBarcode'))
    dispatch(openModal({id:'createProduct', barcode:barcode}))
  }

  useEffect(() => {
    // Add event listener to the document for clicks
    if (isClickOutsideEnabled && !isCreateProductModalOpen) {
      // Dış tıklama işlevselliğini yalnızca modal açık değilken etkinleştir
      document.addEventListener('click', handleClickOutside) /* outSide-1 */
    }

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside) /* outSide-1 */
    }
  }, [isClickOutsideEnabled, isCreateProductModalOpen])

  const handleClickOutside = (e: any) => { /* outSide-1 */
    if (inputRef.current && !['paid', 'count', 'gram', 'quantity', 'barcodeN', 'name','title','customerPhone','customerFullName','mail','city','district','balanceLimit','customerTypeId'].includes(e.target.id)) {
      // Let React Hook Form handle the click event first
      setTimeout(() => {
        // Focus the input element
        inputRef?.current?.focus()
      }, 0)
    }
  }

  //setIsClickOutsideEnabled(false); // disable click outside when modal is opened
  const handleCloseModal = () => {
    dispatch(closeModal('terazi'))
    dispatch(setIsClickOutsideEnabled(false))
  }

  const handleSave = () => {
    if (productDetail) {
      const quantity = weightID / 1000
      dispatch(addProduct({ ...productDetail, quantity }))
    }
    handleCloseModal()
  }
  const t = useTranslations('sales')

  const { ref, ...rest } = register('barcode')

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full items-center gap-x-4'>
        <label htmlFor={name} className={classNames('whitespace-nowrap text-sm font-medium text-black', className)}>
          {label}
        </label>
        <form onSubmit={handleSubmit(onSubmit)} className='relative w-full'>
          <input
            {...rest}
            name={name}
            placeholder={placeholder ?? label}
            aria-label={label}
            required={required}
            type={type}
            {...props}
            autoFocus
            ref={(e: any) => {
              ref(e)
              inputRef.current = e
            }}
            className='w-full rounded-lg border-2 border-transparent bg-[#F1F1F1] px-3.5 py-[15px] pr-12 text-sm font-medium outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7D1F] focus:bg-white'
          />
          <button type='submit'>
            <Icon
              name='barcode'
              color='#72748C'
              className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl'
            />
          </button>
        </form>
      </div>
      <hr className='mb-6 mt-4 h-px w-full bg-[#F1F1F1]' />
      <Input
        name='product_detail'
        srOnly={false}
        label={t('product_detail')}
        value={productDetailName || ''}
        disabled
        onChange={() => {}}
      />
      {showPopup && <Modal id='saveBarcode' message={t('sales_not_found_message')} onClose={handleClosePopup} onSave={handleLink} firstButtonName={t('cancel')} secondButtonName={t('yes')}  name={t('product_not_found')} />}
      {isModalOpen && (
        <Modal
          id='terazi'
          name='Ürün Gramajı'
          message='Lütfen ürün gramajını giriniz.'
          onClose={handleCloseModal}
          onSave={handleSave}
          firstButtonName={t('cancel')}
          secondButtonName={t('save')}>
          <Input
            className='mb-4 w-80'
            type='number'
            name='gram'
            onChange={e => setWeightID(Number(e.target.value))}
            label={''}
          />
        </Modal>
      )}
    </div>
  )
}

export default BarcodeInput
