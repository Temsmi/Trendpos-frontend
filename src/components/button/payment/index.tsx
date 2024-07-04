// PaymentOptions.tsx
'use client'
import React, { useState } from 'react'
import { Icon } from '@/components/icons'
import { useDispatch, useSelector } from 'react-redux'
import { checkoutCart } from '@/store/customersStore'
import { AppDispatch, RootState } from '@/lib/store'
import Modal from '../../popup/modal-form/index'
import { closeModal, openModal } from '@/store/modalSlice'
import { useTranslations } from 'next-intl'
import classnames from 'classnames'
import CurrentAccountCreateModal from '@/components/current-account/current-account-create-modal'
import { setPaymentId } from '@/store/current-account-slice'
import { resetProductName } from '@/store/productDetail'
import PartialPaymentModal from '@/components/partial-payment-modal'

type PaymentOption = {
  id: number | null
  name: string
  icon: string
  color?: string
  label?: string
  disabled?: boolean
}
type PaymentType = {
  label: string
  value: number
}

type PaymentOptionsProps = {
  paymentTypes: PaymentType[]
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ paymentTypes }) => {
  const t = useTranslations('sales')
  const options: PaymentOption[] = [
    { id: null, name: 'cash', label: t('cash'), icon: 'cash', color: '#6AA87B' },
    { id: null, name: 'pos', label: t('pos'), icon: 'pos', color: '#5D88B3' },
    { id: null, name: 'oncredit', label: t('on_credit'), icon: 'debt', color: '#787878' },
    { id: null, name: 'multipayment', label: t('multipayment'), icon: 'split', color: '#A49725', disabled: true},
    { id: null, name: 'foodcard', label: t('food_card'), icon: 'mealCard', color: '#EF7F7F', disabled: true}
  ]
  const dispatch = useDispatch<AppDispatch>()

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some((modal: { id: string; isOpen: any }) => modal.id === 'completeSale' && modal.isOpen)
  )
  const productDetailb = useSelector((state: RootState) => state.productDetail.name);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null)

  const dispatchHandler = (id: number | null, modalType: string) => {
    if (!id) return
    setSelectedPaymentId(id)
    dispatch(setPaymentId(id))

    if (modalType === 'oncredit') dispatch(openModal({ id: 'createCurrentAccount' }))
    if (modalType === 'multipayment') dispatch(openModal({id: 'partialPayment'}))
    else dispatch(openModal({ id: 'completeSale' }))
  }

  const confirmPayment = () => {
    if (selectedPaymentId) {
      dispatch(checkoutCart({ paymentMethodId: selectedPaymentId }))
    }
    dispatch(closeModal('completeSale'))
    dispatch(resetProductName()) // This will reset the product name to an empty string
  }

  const cancelPayment = () => {
    dispatch(closeModal('completeSale'))
  }

  options.forEach(option => {
    paymentTypes?.forEach(paymentType => {
      if (option.name === paymentType.label) {
        option.id = paymentType.value
      }
    })
  })

  return (
    <div className='flex items-center justify-between gap-2.5 max-xl:flex-col'>
      {options.map(
        option =>
          option.id && (
            <button
              key={option.id}
              onClick={() => dispatchHandler(option.id, option.name)}
              className={classnames(
                `flex flex-row items-center rounded-lg bg-[#F1F1F1] p-4 shadow-md hover:${option.disabled ? 'text-black' : 'text-white'} max-xl:w-full max-xl:gap-x-4 xl:h-36 xl:max-w-[84px] xl:flex-col xl:justify-between`,
                option.name === 'cash' && 'hover:bg-[#6AA87B]',
                option.name === 'pos' && 'hover:bg-[#5D88B3]',
                option.name === 'oncredit' && 'hover:bg-[#787878]',
                option.name === 'multipayment' && 'hover:bg-[#A49725]',
                option.name === 'foodcard' && 'hover:bg-[#EF7F7F]',
                option.disabled && 'group hover:bg-[#F1F1F1] cursor-not-allowed',
              )}>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F8F8]'>
                <Icon name={option.icon} color={option.color} />
              </div>
              <p className={`mt-2 flex h-9 items-center text-center text-sm hover:${option.disabled ? 'text-black' : 'text-white'}`}>{option.label}</p>
              {option.disabled && (
                <span className='absolute z-10 rounded bg-gray-800 px-2 py-1 text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100'>
                  {t('very_soon')}
                </span>
              )}
            </button>
          )
      )}
      {isModalOpen && (
        <Modal
          name={t('complete_sale_title')}
          message={t('complete_sale_message')}
          onClose={cancelPayment}
          onSave={confirmPayment}
          firstButtonName={t('cancel')}
          secondButtonName={t('confirm')}
          id={'completeSale'}
        />
      )}
      <CurrentAccountCreateModal />
      <PartialPaymentModal />
    </div>
  )
}

export default PaymentOptions
