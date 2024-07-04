'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import Input from '@/components/input/input'
import { FaCoins, FaEdit, FaSearch, FaTrash } from 'react-icons/fa'
import { IoTimer } from "react-icons/io5";
import Button from '@/components/button/index'
import { useForm } from 'react-hook-form'
import { CurrentAccountTableType } from '@/lib/types'
import { useTranslations } from 'next-intl'
import useCustomToast from '@/hooks/use-toast'
import Modal from '../popup/modal-form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { closeModal, openModal } from '@/store/modalSlice'
import { createColumnHelper } from '@tanstack/react-table'
import { ReportTable } from '../report-table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CurrentAccountService from '@/services/current-account-service'
import currentAccountService from '@/services/current-account-service'
import SalesActivityModal from './sales-activity-modal';
import CurrentAccounInnerCreatetModal from './current-account-inner-create-modal'
import {setFullName, setCustomerId} from '@/store/current-account-slice'

const columnHelper = createColumnHelper<CurrentAccountTableType>()

const columnTypes = [
  'string', // title
  'string', // phone
  'string', // name
  'string', // mail
  'string', // type
  'string', // balanceLimit
  'string', // city
  'string', // district
  'string' // date
]

const CurrentAccountPage = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const { register, reset, getValues, setValue } = useForm<CurrentAccountTableType>()
  const t = useTranslations('current-account')
  const toast = useCustomToast()
  const [formType, setFormType] = React.useState<'edit' | 'create'>('create')
  const {customerId, branchId} = useSelector((state: RootState) => state.currentAccount)  
  
  const isDeleteModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'deleteCurrentAccount' && modal.isOpen)
  )

  const { data: SearchQueryByInputsData, refetch } = useQuery({
    queryKey: ['getSearchQueryByInputs'],
    queryFn: async () => await currentAccountService.getSearchQueryByInputs(getValues('searchKey')),
  })

  const { mutate: deleteAccount } = useMutation({
    mutationFn: () => CurrentAccountService.deleteCurrentAccountByCustomerId(customerId!),
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

  const handleNewCurrentAccountOpenModal = async () => {
    setFormType('create')
    dispatch(openModal({ id: 'createNewCurrentAccount' }))
  }

  const handleDeleteCurrentAccount = (id: number) => {
    dispatch(setCustomerId(id))
    dispatch(openModal({ id: 'deleteCurrentAccount' }))
  }

  const handleEditAccount = async (id: number) => {
    dispatch(setCustomerId(id))
    setFormType('edit')
    dispatch(openModal({ id: 'createNewCurrentAccount' }))
  }

  const handleCloseModal = (modalId: string = 'createCurrentAccount') => {
    reset()
    dispatch(closeModal(modalId))
  }

  const handleSalesActivityOpenModal = async (id: number) => {
    dispatch(setCustomerId(id))
    dispatch(openModal({ id: 'salesActivityModal' }))
  }

  const columns = [
    columnHelper.display({
      id: 'actions',
      header: t('tbl_action'),
      cell: arg => (
        <div className='flex space-x-2'>
          <FaTrash
            size={16}
            onClick={() => handleDeleteCurrentAccount(arg.row.original.customerId)}
            className='hover:cursor-pointer'
          />
          <FaEdit
            size={16}
            onClick={() => handleEditAccount(arg.row.original.customerId)}
            className='hover:cursor-pointer'
          />
            <IoTimer
            size={17}
            onClick={() => {handleSalesActivityOpenModal(arg.row.original.customerId); dispatch(setFullName(arg.row.original.customerFullName))}}
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
  ]

  return (
    <>
      <div className='flex w-full justify-between gap-2 p-1'>
        <Button
          variant='greenSolid'
          onClick={handleNewCurrentAccountOpenModal}
          className='mt-4 h-14 gap-x-2 disabled:border-neutral-100 disabled:bg-white disabled:text-slate-300'>
          <FaCoins />
          {t('btn_new_current')}
        </Button>

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
      <CurrentAccounInnerCreatetModal formType={formType} />
      {isDeleteModalOpen && (
        <Modal
          name={t('complete_delete_title')}
          message={t('complete_delete_message')}
          onClose={() => handleCloseModal('deleteCurrentAccount')}
          onSave={deleteAccount}
          firstButtonName={t('cancel')}
          secondButtonName={t('btn_confirm')}
          id={'deleteCurrentAccount'}
        />
      )}
      <SalesActivityModal />
    </>
  )
}

export default CurrentAccountPage
