'use client'
import React, { useEffect, useState } from 'react'
import Input from '@/components/input/input'
import Button from '@/components/button'
import useCustomToast from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { useForm, SubmitHandler } from 'react-hook-form'
import { AccountType } from '@/lib/types'
import fetchClient from '@/lib/fetch-client'
// import RadioButton from '@/components/button/radio-button'
import PhoneInput from '@/components/input/phone-input'
import { useRouter } from 'next/navigation'
import PermissionModal from '../permission-modal'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useDispatch } from 'react-redux'
import { openModal } from '@/store/modalSlice'

type AccountFormProps = {
  type: 'add' | 'update'
  initialData?: AccountType | null
}

const AccountForm = ({ type, initialData }: AccountFormProps) => {
  const router = useRouter()
  const t = useTranslations('add-account')
  const toast = useCustomToast()
  const dispatch = useDispatch()

  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [role, setRole] = useState<string>('company_user')
  // const [roleShow, setRoleShow] = React.useState<string>('company_user')

  const permissions = useSelector((state: RootState) => state.permissions.permissions)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm<AccountType>({
    defaultValues:
      type === 'add'
        ? {
            role: role
          }
        : initialData || {}
  })

  useEffect(() => {
    setValue('role', role)
  }, [role, setValue])

  useEffect(() => {
    if (type === 'update' && initialData) {
      setIsFetching(false)
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof AccountType, value)
      })
      // if (initialData.roles && initialData.roles.length > 0) {
      //   setRole(initialData.roles[0])
      //   setRoleShow(initialData.roles[0])
      //}
    }
  }, [initialData, setValue])

  const onSubmit: SubmitHandler<AccountType> = async data => {
    // Add Form Action
    if (type === 'add') {
      if (data.password !== data.confirmPassword) {
        toast({
          type: 'error',
          message: t('confirmPasswordError')
        })
        return
      }

      try {
        const response = await fetchClient('/branch/personnel', {
          method: 'POST',
          data: { ...data, permissions }
        })
        const responseBody = await response.json()
        toast({
          type: 'success',
          message: responseBody.message
        })
        router.push('/personnel-list')
      } catch (error: any) {
        if (error instanceof Response) {
          error = await error.json()
        }
        toast({
          type: 'error',
          message: error.message || error.statusText
        })
      }
    }

    // Update Form Action
    else if (type === 'update') {
      try {
        if (initialData) {
          setRole((data.role = role)) // Set the role as an array

          setRole((initialData.roles[0] = role))
          data.roles = [role]

          // PUT request
          const response = await fetchClient(`/branch/personnel/${initialData.userId}`, {
            method: 'PUT',
            data: { ...data, permissions }
          })

          const responseBody = await response.json()

          if (response.ok) {
            toast({
              type: 'success',
              message: responseBody.message
            })
            router.push('/personnel-list')
          } else {
            throw new Error(responseBody.message)
          }
        }
      } catch (error: any) {
        console.error('Error:', error) // Debugging log
        if (error instanceof Response) {
          error = await error.json()
        }
        toast({
          type: 'error',
          message: error.message || error.statusText
        })
      }
    } else return
  }

  const inputTitleStyle = 'mb-3 text-sm font-medium'

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto my-10 flex w-full max-w-[1238px] flex-col rounded-3xl bg-white shadow-sm'>
        <div className='flex'>
          <div className='flex w-1/2 flex-col justify-start gap-4 p-4 pb-12 pr-12'>
            <div className='flex justify-between gap-4'>
              <div className='w-1/2'>
                <p className={inputTitleStyle}>{t('first_name')}</p>
                <Input
                  {...register('firstName')}
                  name='firstName'
                  type='text'
                  size='small'
                  label={t('first_name')}
                  disabled={type === 'update' && isFetching}
                />
              </div>
              <div className='w-1/2'>
                <p className={inputTitleStyle}>{t('last_name')}</p>
                <Input
                  {...register('lastName')}
                  name='lastName'
                  type='text'
                  size='small'
                  label={t('last_name')}
                  disabled={type === 'update' && isFetching}
                />
              </div>
            </div>

            <div>
              <p className={inputTitleStyle}>{t('email')} </p>
              <Input
                {...register('email')}
                name='email'
                type='email'
                size='small'
                label={t('email')}
                disabled={type === 'update' && isFetching}
              />
            </div>
            {type === 'add' && (
              <div className='flex justify-between gap-4'>
                <div className='w-full'>
                  <p className={inputTitleStyle}>{t('password')}</p>
                  <Input {...register('password')} name='password' type='password' size='small' label={t('password')} />
                </div>
                <div className='w-full'>
                  <p className={inputTitleStyle}>{t('confirm_password')}</p>
                  <Input
                    {...register('confirmPassword')}
                    name='confirmPassword'
                    type='password'
                    size='small'
                    label={t('confirm_password')}
                  />
                </div>
              </div>
            )}
            <div className='w-full'>
              <p className={inputTitleStyle}>{t('identity_number')}</p>
              <Input
                {...register('identityNumber')}
                name='identityNumber'
                type='text'
                size='small'
                label={t('identity_number')}
                disabled={type === 'update' && isFetching}
              />
            </div>
            <div>
              <p className={inputTitleStyle}>{t('phone_number')}</p>
              <PhoneInput
                register={register}
                name='phoneNumber'
                label={t('phone_number')}
                disabled={type === 'update' && isFetching}
              />
            </div>
            <div>
              <p className={inputTitleStyle}>{t('emergency_name')}</p>
              <Input
                {...register('emergencyName')}
                name='emergencyName'
                type='text'
                size='small'
                label={t('emergency_name')}
                disabled={type === 'update' && isFetching}
              />
            </div>
            <div>
              <p className={inputTitleStyle}>{t('emergency_phone_number')}</p>
              <PhoneInput
                register={register}
                name='emergencyPhoneNumber'
                label={t('emergency_phone_number')}
                disabled={type === 'update' && isFetching}
              />
            </div>
          </div>
          <div className='max-h-min border-l-[1px] border-solid border-[#F1F1F1]' />

          <div className='flex w-1/2 flex-col justify-start gap-4 p-4 pb-12 pr-12'>
            {/* <div>
              <p className={inputTitleStyle}>{t('user_role')}</p>
              <div className='flex gap-3'>
                <RadioButton
                  label={t('branch_admin')}
                  name='role'
                  value='company_admin'
                  checked={roleShow === 'company_admin'}
                  onChange={() => {
                    setRole('company_admin')
                    setRoleShow('company_admin')
                  }}
                />
                <RadioButton
                  label={t('branch_user')}
                  name='role'
                  value='company_user'
                  checked={roleShow === 'company_user'}
                  onChange={() => {
                    setRole('company_user')
                    setRoleShow('company_user')
                  }}
                />
              </div>
            </div> */}
            <div>
              <p className={inputTitleStyle}>{t('iban')}</p>
              <Input
                {...register('iban')}
                name='iban'
                type='text'
                size='small'
                label={t('iban')}
                disabled={type === 'update' && isFetching}
              />
            </div>
            <div>
              <p className={inputTitleStyle}>{t('responsibility')}</p>
              <Input
                {...register('responsibility')}
                name='responsibility'
                type='text'
                size='small'
                label={t('responsibility')}
                disabled={type === 'update' && isFetching}
              />
            </div>
            <div>
              <p className={inputTitleStyle}>{t('address')}</p>
              <Input
                {...register('address')}
                name='address'
                type='text'
                size='small'
                label={t('address')}
                disabled={type === 'update' && isFetching}
              />
            </div>
            <div>
              <p className={inputTitleStyle}>{t('blood_type')}</p>
              <Input
                {...register('bloodType')}
                name='bloodType'
                type='text'
                size='small'
                label={t('blood_type')}
                disabled={type === 'update' && isFetching}
              />
            </div>
            <div>
              <p className={inputTitleStyle}>{t('other')}</p>
              <textarea
                {...register('other')}
                name='other'
                className='h-28 w-full rounded-xl border border-zinc-100 bg-[#F1F1F1] px-4 py-3 text-sm font-medium outline-0 placeholder:text-neutral-400'
                required={false}
                placeholder={t('other')}
                disabled={type === 'update' && isFetching}
              />
            </div>
            <div>
              <Button type='button' className='h-12 w-48' onClick={() => dispatch(openModal({ id: 'permissionModal' }))}>
                İzinler
              </Button>
            </div>
          </div>
        </div>
        <hr />
        <div className='flex justify-end gap-4 p-4'>
          <Button
            className='h-[47px] w-[161px] justify-center border'
            variant='outlineOrange'
            size='small'
            href='/'
            disabled={isSubmitting}>
            {t('cancel')}
          </Button>
          <Button
            className='h-[47px] w-[161px] justify-center'
            variant='primaryGradient'
            size='small'
            type='submit'
            disabled={isSubmitting}>
            {t('save')}
          </Button>
        </div>
      </form>
      <PermissionModal type={type} permissionData={initialData?.permissions!} />
    </>
  )
}

export default AccountForm
