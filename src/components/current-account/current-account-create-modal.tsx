'use client'
import React, { useEffect, useState } from 'react'
import Input from '@/components/input/input'
import { FaCoins, FaEdit, FaSearch, FaTrash } from 'react-icons/fa'
import Button from '@/components/button/index'
import { useForm } from 'react-hook-form'
import { CurrentAccountBySalesType, CurrentAccountTableType } from '@/lib/types'
import { useTranslations } from 'next-intl'
import useCustomToast from '@/hooks/use-toast'
import Modal from '../popup/modal-form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { closeModal, openModal, setIsClickOutsideEnabled } from '@/store/modalSlice'
import { createColumnHelper } from '@tanstack/react-table'
import { ReportTable } from '../report-table'
import CurrentAccounInnerCreatetModal from './current-account-inner-create-modal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CurrentAccountService from '@/services/current-account-service'
import {setCustomerId} from '@/store/current-account-slice'
import currentAccountService from '@/services/current-account-service'
import { CustomerState, deleteCustomer } from '@/store/customersStore'

const columnHelper = createColumnHelper<CurrentAccountTableType>()

const columnTypes = [
  'string', // title
  'string', // phone
  'string', // name
  'string', // mail
  'string', // type
  'numeric', // balanceLimit
  'string', // city
  'string', // district
  'string' // date
]

const CurrentAccounCreatetModal: React.FC = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const { register, reset, control, getValues, setValue } = useForm<CurrentAccountTableType>()
  const t = useTranslations('current-account')
  const toast = useCustomToast()
  const {paymentId: paymentTypeId, branchId} = useSelector((state: RootState) => state.currentAccount)
  const [formType, setFormType] = React.useState<'edit' | 'create'>('create')
  const state = useSelector((state: RootState) => state.customers)
  const customer: CustomerState | undefined = state.customers.find(customer => customer.id === state.activeCustomerId)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>()

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'createCurrentAccount' && modal.isOpen)
  )

  const isSalesModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'salesCompletedModal' && modal.isOpen)
  )

  const isDeleteModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'deleteCurrentAccount' && modal.isOpen)
  )

  const { data: SearchQueryByInputsData, refetch } = useQuery({
    queryKey: ['getSearchQueryByInputs', isModalOpen],
    queryFn: async () => await currentAccountService.getSearchQueryByInputs(getValues('searchKey')),
    enabled: isModalOpen
  })

  const { mutate: deleteAccount } = useMutation({
    mutationFn: () => CurrentAccountService.deleteCurrentAccountByCustomerId(selectedCustomerId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getSearchQueryByInputs'] })
      handleCloseModal('deleteCurrentAccount')
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

  const { mutate: mutateSalesByAccountId } = useMutation({
    mutationFn: (data: CurrentAccountBySalesType) => currentAccountService.postSalesByAccountId(data),
    onSuccess: () => {
      dispatch(deleteCustomer())
      handleCloseModal('salesCompletedModal')
      handleCloseModal('createCurrentAccount')
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

  const handleSalesByAccountId = () => {
    const payload: CurrentAccountBySalesType = {
      currencyId: customer?.currencyId!,
      customerId: selectedCustomerId!,
      discountTotalAmount: customer?.discountTotalAmount!,
      items: customer?.cart!,
      paymentTypeId: paymentTypeId,
      totalAmount: customer?.totalAmount!,
      totalQuantity: customer?.totalQuantity!
    }
    mutateSalesByAccountId(payload)
  }

  const handleNewCurrentAccountOpenModal = async () => {
    setFormType('create')
    dispatch(openModal({ id: 'createNewCurrentAccount' }))
  }

  const handleCloseModal = (modalId: string = 'createCurrentAccount') => {
    reset()
    dispatch(closeModal(modalId))
  }

  const handleEditAccount = async (id: number) => {
    setFormType('edit')
    dispatch(setCustomerId(id))
    dispatch(openModal({ id: 'createNewCurrentAccount' }))
  }

  const handleSalesCompletedModal = (id: number) => {
    dispatch(openModal({ id: 'salesCompletedModal' }))
    setSelectedCustomerId(id)
  }

  const handleDeleteCurrentAccount = (id: number) => {
    dispatch(openModal({ id: 'deleteCurrentAccount' }))
    setSelectedCustomerId(id)
  }

  useEffect(() => {
    if (isModalOpen) {
      dispatch(setIsClickOutsideEnabled(false))
    }

    return () => {dispatch(setIsClickOutsideEnabled(true))}
  }, [isModalOpen])

  const columns = [
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: arg => (
        <div className='flex space-x-2'>
          <FaTrash
            size={16}
            onClick={() => handleDeleteCurrentAccount(arg.row.original.customerId)}
            className='hover:cursor-pointer'
          />
          <FaEdit
            size={17}
            onClick={() => handleEditAccount(arg.row.original.customerId)}
            className='hover:cursor-pointer'
          />
        </div>
      )
    }),
    columnHelper.accessor('title', {
      header: t('title')
    }),
    columnHelper.accessor('customerPhone', {
      header: t('customerPhone')
    }),
    columnHelper.accessor('customerFullName', {
      header: t('customerFullName')
    }),
    columnHelper.accessor('mail', {
      header: t('mail')
    }),
    columnHelper.accessor('customerType', {
      header: t('customerType')
    }),
    columnHelper.accessor('balanceLimit', {
      header: t('balanceLimit')
    }),
    columnHelper.accessor('city', {
      header: t('city')
    }),
    columnHelper.accessor('district', {
      header: t('district')
    }),
    columnHelper.accessor('createdAt', {
      header: t('createdDate')
    }),
    columnHelper.display({
      id: 'second-actions',
      header: '',
      cell: arg => (
        <Button
          variant='blueSolid'
          onClick={() => handleSalesCompletedModal(arg.row.original.customerId)}
          className='h-10 gap-x-2 disabled:border-neutral-100 disabled:bg-white disabled:text-slate-300'>
          <FaCoins
            size={17}
            className='hover:cursor-pointer'
          />
          {t('btn_sale')}
        </Button>
      )
    })
  ]

  return (
    <>
      {isModalOpen && (
        <>
          <Modal
            id='createCurrentAccount'
            name={t('modal_title')}
            onClose={handleCloseModal}
            firstButtonName={t('btn_cancel')}>
            <div className='flex w-full justify-between gap-2 p-1'>
              <div className='flex space-x-2'>
                <Button
                  variant='greenSolid'
                  onClick={handleNewCurrentAccountOpenModal}
                  className='mt-4 h-14 gap-x-2 disabled:border-neutral-100 disabled:bg-white disabled:text-slate-300'>
                  <FaCoins />
                  {t('btn_new_current')}
                </Button>
              </div>

              <div className='flex space-x-2'>
                <Input
                  label={t('search_key')}
                  {...register('searchKey')}
                  className='w-36 !gap-0 disabled:opacity-75'
                  srOnly={false}
                />

                <Button
                  variant='whiteSolid'
                  onClick={refetch}
                  className='mt-4 w-24 disabled:border-neutral-100 disabled:bg-white disabled:text-slate-300'>
                  <FaSearch aria-label='plus' />
                  {t('btn_search')}
                </Button>
                <Button
                  variant='whiteSolid'
                  onClick={() => {
                    setValue('searchKey', '')
                    refetch()
                  }}
                  className='mt-4 w-12 disabled:border-neutral-100 disabled:bg-white disabled:text-slate-300'>
                  {t('btn_all')}
                </Button>
              </div>
            </div>
            <div className='border-b-2'></div>

            <ReportTable data={SearchQueryByInputsData?.data?.data ?? []} columns={columns} columnTypes={columnTypes} />
          </Modal>
          {isSalesModalOpen && (
            <Modal
              name={t('complete_sale_title')}
              message={t('complete_sale_message')}
              onClose={() => handleCloseModal('salesCompletedModal')}
              onSave={handleSalesByAccountId}
              firstButtonName={t('cancel')}
              secondButtonName={t('confirm')}
              id={'salesCompletedModal'}
            />
          )}

          {isDeleteModalOpen && (
            <Modal
              name={t('complete_delete_title')}
              message={t('complete_delete_message')}
              onClose={() => handleCloseModal('deleteCurrentAccount')}
              onSave={deleteAccount}
              firstButtonName={t('cancel')}
              secondButtonName={t('confirm')}
              id={'deleteCurrentAccount'}
            />
          )}
        </>
      )}
      <CurrentAccounInnerCreatetModal formType={formType} />
    </>
  )
}

export default CurrentAccounCreatetModal
