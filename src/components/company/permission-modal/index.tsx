import Checkbox from '@/components/checkbox'
import Modal from '@/components/popup/modal-form'
import { RootState } from '@/lib/store'
import { PermissionModalType } from '@/lib/types'
import { closeModal } from '@/store/modalSlice'
import { setPermission } from '@/store/permission-slice'
import { useTranslations } from 'next-intl'
import { useEffect, useLayoutEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

type PermissionModalProps = {
  type: 'add' | 'update'
  permissionData: PermissionModalType
}

const PermissionModal = ({type, permissionData }: PermissionModalProps) => {
  const { register, getValues, setValue } = useForm<PermissionModalType>()
  const dispatch = useDispatch()
  const t = useTranslations('add-account')

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'permissionModal' && modal.isOpen)
  )
  const handleCloseModal = () => {
    dispatch(closeModal('permissionModal'))
  }

  console.log('permissionData: ', permissionData)

  const handleSavePermission = () => {
    dispatch(setPermission(getValues()))
    handleCloseModal()
  }

  useLayoutEffect(() => {
    if (type==='update' && permissionData) {
      setValue('sales', permissionData.sales)
      setValue('sales_report', permissionData.sales_report)
      setValue('stock_report', permissionData.stock_report)
      setValue('update_product', permissionData.update_product)
      setValue('create_product', permissionData.create_product)
      setValue('cari', permissionData.cari)
    }
  }, [permissionData])


  useEffect(() => {
    if(type==='add'){
      setValue('sales', false)
      setValue('sales_report', false)
      setValue('stock_report', false)
      setValue('update_product', false)
      setValue('create_product', false)
      setValue('cari', false)
    }
  }, [type])

  return (
    <>
      {isModalOpen && (
        <Modal
          id='permissionModal'
          onSave={handleSavePermission}
          onClose={handleCloseModal}
          firstButtonName={t('cancel')}
          secondButtonName={t('confirm')}
          className='!px-2'>
          <div className='space-y-5'>
            <div>
              <h2 className='font-bold'>{t('sales_title')}</h2>
              <hr className='bg-slate-300 h-0.5 my-2' />
              <Checkbox {...register('sales')} label={t('sales')} />
            </div>

            <div>
              <h2 className='font-bold'>{t('sales_report_title')}</h2>
              <hr className='bg-slate-300 h-0.5 my-2' />
              <div className='space-y-2'>
                <Checkbox {...register('sales_report')} label={t('sales_report')} />
                <Checkbox {...register('stock_report')} label={t('stock_report')} />
              </div>
            </div>

            <div>
              <h2 className='font-bold'>{t('product_catologue_title')}</h2>
              <hr className='bg-slate-300 h-0.5 my-2' />
              <div className='space-y-2'>
                <Checkbox {...register('update_product')} label={t('update_product')} />
                <Checkbox {...register('create_product')} label={t('create_product')} />
              </div>
            </div>

            <div>
              <h2 className='font-bold'>{t('cari_title')}</h2>
              <hr className='bg-slate-300 h-0.5 my-2' />
              <Checkbox {...register('cari')} label={t('cari')} />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default PermissionModal
