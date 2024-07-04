'use client'
import React, { useEffect } from 'react'
import Input from '@/components/input/input'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { CurrentAccountType } from '@/lib/types'
import { useTranslations } from 'next-intl'
import useCustomToast from '@/hooks/use-toast'
import Modal from '../popup/modal-form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { closeModal } from '@/store/modalSlice'
import NewProductDropdown from '../dropdown/new-product-dropdown'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import currentAccountService from '@/services/current-account-service'
import PhoneInput from '../input/phone-input'

const CurrentAccountInnerCreateModal = ({ formType = 'create' }: { formType: 'edit' | 'create' }) => {
  const { register, handleSubmit, getValues, setValue, reset, control } = useForm<CurrentAccountType>()
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const t = useTranslations('current-account')
  const toast = useCustomToast()
  const { customerId, branchId } = useSelector((state: RootState) => state.currentAccount)

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'createNewCurrentAccount' && modal.isOpen)
  )

  const isTrigger = isModalOpen && formType === 'edit'

  const { data: customerSingleData } = useQuery({
    queryKey: ['getCustomerSingleData', isTrigger],
    queryFn: async () => await currentAccountService.getCustomerById(customerId),
    enabled: isTrigger
  })

  // filter options
  const { data: filterOptionCityData, isFetched } = useQuery({
    queryKey: ['getFilterOptionByCity', isModalOpen],
    queryFn: async () => await currentAccountService.getFilterOptionByCity(),
    enabled: isModalOpen
  })
  const {
    data: filterOptionDistrictData,
    isFetching: IsFetchingDistrictData,
    refetch
  } = useQuery({
    queryKey: ['getFilterOptionByDistrict'],
    queryFn: async () => await currentAccountService.getFilterOptionByDistrict(getValues('cityId')),
    enabled: isFetched
  })
  const { data: filterOptionCustomerType } = useQuery({
    queryKey: ['getFilterOptionByCustomerType', isModalOpen],
    queryFn: () => currentAccountService.getFilterOptionByCustomerType(),
    enabled: isModalOpen
  })

  useEffect(() => {
    if (formType === 'edit') {
      setValue('title', customerSingleData?.data?.data?.title!)
      setValue('customerFullName', customerSingleData?.data?.data?.customerFullName!)
      setValue('customerPhone', customerSingleData?.data?.data?.customerPhone!)
      setValue('mail', customerSingleData?.data?.data?.mail!)
      setValue('balanceLimit', customerSingleData?.data?.data?.balanceLimit!)
      setValue('customerTypeId', customerSingleData?.data?.data?.customerTypeId!)
      setValue('cityId', customerSingleData?.data?.data?.cityId!)
      setValue('districtId', customerSingleData?.data?.data?.districtId!)
    }
  }, [customerSingleData, formType])

  const { mutate: postCurrentAccount } = useMutation({
    mutationFn: (data: CurrentAccountType) => currentAccountService.postCurrentAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getSearchQueryByInputs'] })
      toast({
        type: 'success',
        message: t('operation_successful')
      })
      dispatch(closeModal('createNewCurrentAccount'))
    },
    onError: () => {
      toast({
        type: 'error',
        message: t('operation_failed')
      })
    }
  })

  const { mutate: putCurrentAccount } = useMutation({
    mutationFn: (data: CurrentAccountType) => currentAccountService.putCurrentAccount(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getSearchQueryByInputs'] })
      toast({
        type: 'success',
        message: t('operation_successful')
      })
      dispatch(closeModal('createNewCurrentAccount'))
    },
    onError: () => {
      toast({
        type: 'error',
        message: t('operation_failed')
      })
    }
  })

  const onSubmit: SubmitHandler<CurrentAccountType> = data => {
    if (formType === 'edit') putCurrentAccount(data)
    else postCurrentAccount(data)
  }

  const onSave = () => {
    handleSubmit(async data => {
      onSubmit({ ...data, branchId })
      reset()
    })()
  }

  const handleCloseModal = () => {
    reset()
    dispatch(closeModal('createNewCurrentAccount'))
  }

  return (
    <>
      {isModalOpen && (
        <Modal
          id='createNewCurrentAccount'
          name={t('new_account_modal_title')}
          onClose={handleCloseModal}
          onSave={onSave}
          firstButtonName={t('btn_cancel')}
          secondButtonName={t('btn_save')}>
          <div className='grid grid-cols-2 gap-2 p-1'>
            <Input label={t('title')} {...register('title')} className='!gap-0 disabled:opacity-75' srOnly={false} />
            <Input
              label={t('customerFullName')}
              {...register('customerFullName')}
              className='!gap-0 disabled:opacity-75'
              srOnly={false}
            />
            <PhoneInput
              {...register('customerPhone')}
              register={register}
              name='customerPhone'
              label={t('customerPhone')}
              srOnly={false}
              className='!gap-0 disabled:opacity-75'
            />
            <Input label={t('mail')} {...register('mail')} className='!gap-0 disabled:opacity-75' srOnly={false} />
            <Input
              label={t('balanceLimit')}
              type='number'
              {...register('balanceLimit', { valueAsNumber: true })}
              className='!gap-0 disabled:opacity-75'
              srOnly={false}
            />
            <Controller
              name='customerTypeId'
              control={control}
              render={({ field }) => (
                <NewProductDropdown
                  label={t('customerType')}
                  submenu={filterOptionCustomerType?.data?.data}
                  onChange={selectedValue => field.onChange(selectedValue)}
                  selectedValue={field.value}
                  srOnly={false}
                />
              )}
            />
            <Controller
              name='cityId'
              control={control}
              render={({ field }) => (
                <NewProductDropdown
                  label={t('city')}
                  submenu={filterOptionCityData?.data?.data}
                  onChange={selectedValue => {
                    field.onChange(selectedValue)
                    refetch()
                  }}
                  selectedValue={field.value}
                  srOnly={false}
                />
              )}
            />
            <Controller
              name='districtId'
              control={control}
              render={({ field }) => (
                <NewProductDropdown
                  label={t('district')}
                  submenu={filterOptionDistrictData?.data?.data}
                  onChange={selectedValue => field.onChange(selectedValue)}
                  selectedValue={field.value}
                  isDisabled={IsFetchingDistrictData || !getValues('cityId')}
                  srOnly={false}
                />
              )}
            />
          </div>
        </Modal>
      )}
    </>
  )
}

export default CurrentAccountInnerCreateModal
