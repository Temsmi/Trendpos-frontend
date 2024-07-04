'use client'
import React from 'react'
import { TransactionReceiptType } from '@/lib/types'
import { useTranslations } from 'next-intl'
import Modal from '../popup/modal-form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { closeModal } from '@/store/modalSlice'
import { createColumnHelper } from '@tanstack/react-table'
import { ReportTable } from '../report-table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import currentAccountService from '@/services/current-account-service'

const columnHelper = createColumnHelper<TransactionReceiptType>()

const columnTypes = [
  'string', // name
  'string', // barcode
  'numeric', // quantity
  'numeric', // unitPrice
  'numeric', // number
  'string', // salesDate
]

const ReceiptDetailModal: React.FC = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const t = useTranslations('current-account')
  const {fullName, salesTransactionId, branchId} = useSelector((state: RootState) => state.currentAccount)
  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'receiptDetailModal' && modal.isOpen)
  )

  const { data: ReceiptDetailData, isError } = useQuery({
    queryKey: ['getReceiptDetailByTransactionId', isModalOpen],
    queryFn: async () => await currentAccountService.getReceiptDetailByTransactionId(salesTransactionId, branchId),
    enabled: isModalOpen,
    retry:false
  })

  const handleCloseModal = (modalId: string = 'receiptDetailModal') => {
    dispatch(closeModal(modalId))
  }

  const columns = [   
    columnHelper.accessor('barcode', {
      header: t('transaction_barcode')
    }),
    columnHelper.accessor('name', {
      header: t('transaction_name')
    }),  
    columnHelper.accessor('quantity', {
      header: t('transaction_quantity'),
    }),
    columnHelper.accessor('unityPrice', {
      header: t('transaction_amount')
    }),
    columnHelper.accessor('salesDate', {
      header: t('createdDate'),
    }),
    columnHelper.accessor('tax', {
      header: t('transaction_balance')
    })   
  ]

  return (
    <>
      {isModalOpen && (
        <>
          <Modal id='receiptDetailModal' onClose={handleCloseModal} firstButtonName={t('btn_cancel')}>
            <div className='flex items-center gap-x-5'>
              <h2 className='font-bold text-xl mt-2'>{fullName}</h2>
            </div>
            <div className='border-b-2'></div>

            <div className='max-h-80 overflow-auto'>
              {isError ? (
                <h2>{t('transaction_not_found')}</h2>
              ) : (
                <ReportTable
                  data={ReceiptDetailData?.data?.data?.items ?? []}
                  columns={columns}
                  columnTypes={columnTypes}
                />
              )}
            </div>
            {!isError && (
              <div className='grid grid-cols-2 *:font-bold mt-3'>
                <p>
                  {t('transaction_current_number')}: {ReceiptDetailData?.data?.data?.items?.length || 0}
                </p>
                <p>
                  {t('transaction_total_amount')}: {ReceiptDetailData?.data?.data?.totalAmount}
                </p>
                <p>
                  {t('transaction_total_quantity')}: {ReceiptDetailData?.data?.data?.totalQuantity}
                </p>
              </div>
            )}
          </Modal>
        </>
      )}
    </>
  )
}

export default ReceiptDetailModal
