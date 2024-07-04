'use client'
import React, { useEffect } from 'react'
import Input from '@/components/input/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import {  CustomerTransactionHistoryType } from '@/lib/types'
import { useTranslations } from 'next-intl'
import useCustomToast from '@/hooks/use-toast'
import Modal from '../popup/modal-form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { closeModal } from '@/store/modalSlice'
import NewProductDropdown from '../dropdown/new-product-dropdown'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import currentAccountService from '@/services/current-account-service'
import dayjs from 'dayjs'

const SalesActivityAddModal = ({ formType = 'create' }: { formType: 'edit' | 'create' }) => {
  const { register, handleSubmit, setValue, getValues, reset, watch, control } = useForm<CustomerTransactionHistoryType>()
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const t = useTranslations('current-account')
  const toast = useCustomToast()
  const {customerId, transactId, branchId} = useSelector((state: RootState) => state.currentAccount)

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'salesActivityAddModal' && modal.isOpen)
  )

  const isTrigger = isModalOpen && formType === 'edit'

  const { data: transactSingleData } = useQuery({
    queryKey: ['getCustomerSingleData', isTrigger],
    queryFn: async () => await currentAccountService.getCustomerTransactionHistoryByTransactionId(transactId),
    enabled: isTrigger
  })

  useEffect(() => {
    if (formType === 'edit') {
      setValue('date', dayjs(transactSingleData?.data?.data?.date!).format('YYYY-MM-DD'))
      setValue('amount', transactSingleData?.data?.data?.amount!)
      setValue('description', transactSingleData?.data?.data?.description!)
      setValue('paymentTypeId', transactSingleData?.data?.data?.paymentTypeId!)
      setValue('transactionTypeId', transactSingleData?.data?.data?.transactionTypeId!)
    }
  }, [transactSingleData, formType])

  const { data: filterOptionPaymentType } = useQuery({
    queryKey: ['getFilterOptionPaymentType', isModalOpen],
    queryFn: async () => await currentAccountService.getFilterOptionPaymentType(),
    enabled: isModalOpen
  })

  const { data: filterOptionTransactionType } = useQuery({
    queryKey: ['getFilterOptionTransactionType', isModalOpen],
    queryFn: async () => await currentAccountService.getFilterOptionTransactionType(),
    enabled: isModalOpen
  })

  const { mutate: postTransactionHistory } = useMutation({
    mutationFn: (data: CustomerTransactionHistoryType) => currentAccountService.postCustomerTransactionHistory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getCustomerTransactionHistoryByCustomerId'] })
      toast({
        type: 'success',
        message: t('operation_successful')
      })
    },
    onError: () => {
      toast({
        type: 'error',
        message: t('operation_failed')
      })
    }
  })

  const { mutate: putTransactionHistory } = useMutation({
    mutationFn: (data: CustomerTransactionHistoryType) => currentAccountService.putCustomerTransactionHistoryByTransactionId(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getCustomerTransactionHistoryByCustomerId'] })
      toast({
        type: 'success',
        message: t('operation_successful')
      })
    },
    onError: () => {
      toast({
        type: 'error',
        message: t('operation_failed')
      })
    }
  })

  const onSubmit: SubmitHandler<CustomerTransactionHistoryType> = data => {
    if (formType === 'edit') putTransactionHistory(data)
    else postTransactionHistory({...data, salesTransactionId:-1})
  }

  const onSave = () => {
    handleSubmit(async data => {
      onSubmit({ ...data, branchId, customerId })
      dispatch(closeModal('salesActivityAddModal'))
      reset()
    })()
  }

  const handleCloseModal = () => {
    reset()
    dispatch(closeModal('salesActivityAddModal'))
  }

  return (
    <>
      {isModalOpen && (
        <Modal
          id='salesActivityAddModal'
          onClose={handleCloseModal}
          onSave={onSave}
          firstButtonName={t('btn_cancel')}
          secondButtonName={t('btn_save')}>
          <div className='grid grid-cols-2 gap-2 p-1'>
            <Input
              label={t('createdDate')}
              {...register('date')}
              type='date'
              className='!gap-0 disabled:opacity-75'
              srOnly={false}
              onClick={(e) => e.currentTarget.showPicker()}
            />
            <Input
              label={t('transaction_description')}
              {...register('description')}
              className='!gap-0 disabled:opacity-75'
              srOnly={false}
            />
            <Input
              label={t('transaction_amount')}
              type='number'
              {...register('amount', { valueAsNumber: true })}
              className='!gap-0 disabled:opacity-75'
              srOnly={false}
            />
            <Controller
              name='transactionTypeId'
              control={control}
              render={({ field }) => (
                <NewProductDropdown
                  label={t('sale_transaction_type')}
                  submenu={filterOptionTransactionType?.data?.data}
                  onChange={selectedValue => field.onChange(selectedValue)}
                  selectedValue={field.value}
                  srOnly={false}
                />
              )}
            />
            {watch('transactionTypeId') === 2 && (
              <Controller
                name='paymentTypeId'
                control={control}
                render={({ field }) => (
                  <NewProductDropdown
                    label={t('sale_payment_type')}
                    submenu={filterOptionPaymentType?.data?.data}
                    onChange={selectedValue => field.onChange(selectedValue)}
                    selectedValue={field.value}
                    srOnly={false}
                  />
                )}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  )
}

export default SalesActivityAddModal
