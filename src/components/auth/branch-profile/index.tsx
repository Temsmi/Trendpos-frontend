'use client'

import Button from '@/components/button'
import Input from '@/components/input/input'
import Separator from '@/components/separator'
import { Controller, useForm } from 'react-hook-form'
import { BranchProfileDataType } from '@/lib/types'
import useCustomToast from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import NewProductDropdown from '@/components/dropdown/new-product-dropdown'
import branchProfileService from '@/services/branch-profile-service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

const BranchProfileForm = () => {
  const toast = useCustomToast()
  const t = useTranslations('company-profile')
  const queryClient = useQueryClient()

  const { data:printerTypeData, isSuccess:printIsSucces} = useQuery({
    queryKey: ['getPrinterFilterData'],
    queryFn: async () => await branchProfileService.getPrinterFilterOption(),
  })

  const { data:currencyFilterData, isSuccess:currencyIsSuccess } = useQuery({
    queryKey: ['getCurrencyFilterData'],
    queryFn: async () => await branchProfileService.getCurrencyFilterOption(),
  })

  const { data:branch} = useQuery({
    queryKey: ['getBranchProfileData'],
    queryFn: async () => await branchProfileService.getBranch(),
    enabled: printIsSucces && currencyIsSuccess
  })
 
  const {mutate:mutateBranch} = useMutation({mutationFn: (body) => branchProfileService.putBranch(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getBranchProfileData'] })
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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm<BranchProfileDataType>()

  const onSubmit = async (data: BranchProfileDataType) => {
    const payload = {
      branchInvoiceName: data.branchInvoiceName,
      branchName: data.branchName,
      branchOwnerEmail: data.branchOwnerEmail,
      branchOwnerFirstName: data.branchOwnerFirstName,
      branchOwnerLastName: data.branchOwnerLastName,
      branchOwnerPhoneNumber: data.branchOwnerPhoneNumber,
      currency: data.currency,
      printerId: data.printerId,
      id: branch?.data.data.id
    }

    mutateBranch(payload as any)
  }

  useEffect(() => {
    setValue('branchName', branch?.data.data.branchName)
    setValue('branchInvoiceName', branch?.data.data.branchInvoiceName)
    setValue('branchOwnerFirstName', branch?.data.data.branchOwnerFirstName)
    setValue('branchOwnerLastName', branch?.data.data.branchOwnerLastName)
    setValue('branchOwnerPhoneNumber', branch?.data.data.branchOwnerPhoneNumber)
    setValue('branchOwnerEmail', branch?.data.data.branchOwnerEmail)
    setValue('currency', branch?.data.data.currency)
    setValue('country', branch?.data.data.country)
    setValue('city', branch?.data.data.city)
    setValue('district', branch?.data.data.district)
    setValue('address', branch?.data.data.address)
    setValue('printerId', branch?.data.data.printerId)    
  }, [branch])

  return (
    <div className='h-full w-full rounded-3xl bg-white'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex h-full gap-x-10'>
          <div className='flex-1 space-y-5 p-6'>
            <Input label={t('branch_name') + ':'} {...register('branchName')} srOnly={false} className='bg-[#FDFDFD]' />
            <Input
              label={t('branch_owner_name') + ':'}
              {...register('branchOwnerFirstName')}
              srOnly={false}
              className='bg-[#FDFDFD]'
            />
            <Input
              label={t('branch_owner_surname') + ':'}
              {...register('branchOwnerLastName')}
              srOnly={false}
              className='bg-[#FDFDFD]'
            />
            <Input
              label={t('branch_invoice_name') + ':'}
              {...register('branchInvoiceName')}
              srOnly={false}
              className='bg-[#FDFDFD]'
            />
            <Input
              label={t('branch_owner_phone') + ':'}
              {...register('branchOwnerPhoneNumber')}
              srOnly={false}
              className='bg-[#FDFDFD]'
            />
            <Input
              label={t('branch_owner_mail') + ':'}
              {...register('branchOwnerEmail')}
              srOnly={false}
              className='bg-[#FDFDFD]'
            />
          </div>
          <Separator orientation='vertical' className='h-auto' />
          <div className='flex-1 space-y-5 p-6'>
            <Controller
              name='currency'
              control={control}
              render={({ field }) => (
                <NewProductDropdown
                  isProfile
                  label={t('currency')}
                  submenu={currencyFilterData?.data?.data}
                  onChange={selectedValue => field.onChange(selectedValue)}
                  selectedValue={field.value}
                  srOnly={false}
                />
              )}
            />
            <Controller
              name='printerId'
              control={control}
              render={({ field }) => (
                <NewProductDropdown
                  isProfile
                  label={t('printer_name')}
                  submenu={printerTypeData?.data?.data}
                  onChange={selectedValue => field.onChange(selectedValue)}
                  selectedValue={field.value}
                  srOnly={false}
                />
              )}
            />
            <Input
              label={t('country') + ':'}
              {...register('country')}
              disabled
              srOnly={false}
              className='bg-[#FDFDFD]'
            />
            <Input label={t('city') + ':'} {...register('city')} disabled srOnly={false} className='bg-[#FDFDFD]' />
            <Input
              label={t('district') + ':'}
              {...register('district')}
              disabled
              srOnly={false}
              className='bg-[#FDFDFD]'
            />
            <Input
              isMultiple
              label={t('address') + ':'}
              {...register('address')}
              disabled
              srOnly={false}
              className='bg-[#FDFDFD]'
            />
          </div>
        </div>
        <Separator orientation='horizontal' />
        <div className='flex items-center justify-end gap-x-4 p-4'>
          <Button
            type='button'
            href='/'
            variant='outline'
            className='border-orange-500 px-[72px] py-3.5 text-orange-500'>
            {t('cancel')}
          </Button>
          <Button type='submit' className='px-[72px] py-3.5'>
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </div>
  )
}
export default BranchProfileForm
