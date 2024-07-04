'use client'
import React from 'react'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { ImZoomIn } from 'react-icons/im'
import Button from '@/components/button/index'
import { CustomerTransactionHistoryTableType } from '@/lib/types'
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
import SalesActivityAddModal from './sales-activity-add-modal'
import dayjs from 'dayjs'
import ReceiptDetailModal from './receipt-detail-modal'
import {setSalesTransactionId, setTransactId} from '@/store/current-account-slice'

const columnHelper = createColumnHelper<CustomerTransactionHistoryTableType>()

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

const SalesActivityModal: React.FC = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const t = useTranslations('current-account')
  const toast = useCustomToast()
  const [formType, setFormType] = React.useState<'edit' | 'create'>('create')
  const {customerId, fullName, transactId} = useSelector((state: RootState) => state.currentAccount)

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'salesActivityModal' && modal.isOpen)
  )

  const isDeleteModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'deleteCurrentAccount' && modal.isOpen)
  )

  const { data: CustomerTransactionHistoryData, isError } = useQuery({
    queryKey: ['getCustomerTransactionHistoryByCustomerId', isModalOpen],
    queryFn: async () => await currentAccountService.getCustomerTransactionHistoryByCustomerId(customerId),
    enabled: isModalOpen,
    retry:false
  })

  const { mutate: deleteAccount } = useMutation({
    mutationFn: () => CurrentAccountService.deleteCustomerTransactionHistory(transactId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getCustomerTransactionHistoryByCustomerId'] })
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

  const handleAddActivityOpenModal = () => {
    setFormType('create')
    dispatch(openModal({ id: 'salesActivityAddModal' }))
  }

  const handleCloseModal = (modalId: string = 'salesActivityModal') => {
    dispatch(closeModal(modalId))
  }

  const handleEditAccount = (id: number) => {
    dispatch(setTransactId(id))
    setFormType('edit')
    dispatch(openModal({ id: 'salesActivityAddModal' }))
  }

  const handleReceiptModal = (id: number) => {
    dispatch(setSalesTransactionId(id))
    dispatch(openModal({ id: 'receiptDetailModal' }))
  }

  const handleDeleteCurrentAccount = (id: number) => {
    dispatch(openModal({ id: 'deleteCurrentAccount' }))
    dispatch(setTransactId(id))
  }

  const columns = [
    columnHelper.display({
      id: 'actions',
      header: t('tbl_action'),
      cell: arg => (
        <div className='flex space-x-2'>
          {arg.row.original.salesTransactionId < 0 ? (
            <>
              <FaTrash
                size={16}
                onClick={() => handleDeleteCurrentAccount(arg.row.original.Id)}
                className='hover:cursor-pointer'
              />
              <FaEdit
                size={17}
                onClick={() => handleEditAccount(arg.row.original.Id)}
                className='hover:cursor-pointer'
              />
            </>
          ) : (
            <ImZoomIn
              size={17}
              onClick={() => handleReceiptModal(arg.row.original.salesTransactionId)}
              className='hover:cursor-pointer'
            />
          )}
        </div>
      )
    }),
    columnHelper.accessor('date', {
      header: t('createdDate'),
      cell: arg => <p>{dayjs(arg.row.original.date).format('YYYY-MM-DD')}</p>
    }),
    columnHelper.accessor('transactionType', {
      header: t('transaction_type')
    }),
    columnHelper.accessor('description', {
      header: t('transaction_description')
    }),
    columnHelper.accessor('salesTransactionId', {
      header: t('transaction_id'),
      cell: arg => <p>{arg.row.original.salesTransactionId < 0 ? '' : arg.row.original.salesTransactionId}</p>
    }),
    columnHelper.accessor('debt', {
      header: t('transaction_debt')
    }),
    columnHelper.accessor('deptPay', {
      header: t('transaction_balance')
    })
  ]

  return (
    <>
      {isModalOpen && (
        <>
          <Modal id='salesActivityModal' onClose={handleCloseModal} firstButtonName={t('btn_cancel')}>
            <div className='flex items-center gap-x-5'>
              <Button
                variant='greenSolid'
                onClick={handleAddActivityOpenModal}
                className='gap-x-1 disabled:border-neutral-100 disabled:bg-white disabled:text-slate-300'>
                <FaPlus size={12} />
                {t('transaction_add')}
              </Button>

              <h2 className='font-bold text-xl mt-2'>{fullName}</h2>
            </div>
            <div className='border-b-2 mt-2'></div>

            <div className='max-h-80 overflow-auto'>
              {isError ? (
                <h2>{t('transaction_not_found')}</h2>
              ) : (
                <ReportTable
                  data={CustomerTransactionHistoryData?.data?.data?.items ?? []}
                  columns={columns}
                  columnTypes={columnTypes}
                />
              )}
            </div>
            {!isError && (
              <div className='grid grid-cols-2 *:font-bold mt-3'>
                <p>
                  {t('transaction_current_number')}: {CustomerTransactionHistoryData?.data?.data?.items?.length || 0}
                </p>
                <p>
                  {t('transaction_debt')}: {CustomerTransactionHistoryData?.data?.data?.totalDebt}
                </p>
                <p>
                  {t('transaction_current_debtPay')}: {CustomerTransactionHistoryData?.data?.data?.totalDebtPay}
                </p>
                <p>
                  {t('transaction_total_balance')}: {CustomerTransactionHistoryData?.data?.data?.balance}
                </p>
              </div>
            )}
          </Modal>
          <SalesActivityAddModal formType={formType} />
          <ReceiptDetailModal />

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
        </>
      )}
    </>
  )
}

export default SalesActivityModal
