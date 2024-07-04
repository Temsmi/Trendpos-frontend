'use client'
import Input from '@/components/input/input'
import Link from 'next/link'
import { useWizard } from 'react-use-wizard'
import PhoneInput from '@/components/input/phone-input'
import { SubmitHandler, UseFormRegister, UseFormHandleSubmit } from 'react-hook-form'
import fetchClient from '@/lib/fetch-client'
import { RegisterDataType } from '@/lib/types'
import useCustomToast from '@/hooks/use-toast'
import Button from '@/components/button'
import { useTranslations } from 'next-intl'
import Checkbox from '@/components/checkbox'
import {ErrorMessage} from '@hookform/error-message'
import Modal from '@/components/popup/modal-form'
import { AppDispatch, RootState } from '@/lib/store'
import { useDispatch } from 'react-redux'
import { closeModal, openModal } from '@/store/modalSlice'
import { useSelector } from 'react-redux'
import TermModal from './term-modal'
import { useEffect, useState } from 'react'
import { setTerms } from '@/store/terms-slice'
import { useQuery } from '@tanstack/react-query'
import currentAccountService from '@/services/current-account-service'

const RegisterFirstStep = ({
  register,
  handleSubmit,
  isSubmitting,
  errors
}: {
  register: UseFormRegister<RegisterDataType>
  handleSubmit: UseFormHandleSubmit<RegisterDataType>
  isSubmitting: boolean,
  errors:any
}) => {
  const toast = useCustomToast()
  const { nextStep } = useWizard()
  const [tabId, setTabId] = useState<number>(1)
  const t = useTranslations('auth')
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit: SubmitHandler<RegisterDataType> = async data => {
    dispatch(setTerms({
      acceptEmail:data.acceptEmail,
      clarificationText:data.clarificationText,
      explicitConsent:data.explicitConsent
    }))
    try {
      await fetchClient('/auth/pre-register-validation', {
        method: 'POST',
        data: {
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          phoneNumber: data.phoneNumber.replaceAll(' ', '')
        }
      })

      await fetchClient('/validation/phone-validation', {
        method: 'POST',
        data: { phoneNumber: data.phoneNumber.replaceAll(' ', '') }
      })

      nextStep()
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

  const isTermModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'termModal')
  )

  const handleOpenModal = (id:number) => {
    setTabId(id)
    dispatch(openModal({ id: 'termModal' }))
  }

  const handleCloseModal = () => {
    dispatch(closeModal('termModal'))
  }

  const { data: kvkkContentData } = useQuery({
    queryKey: ['getKvkkContent'],
    queryFn: async () => await currentAccountService.getKvkkContent(),
  })
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center gap-2.5'>
        <Input {...register('name')} name='name' type='text' size='large' label={t('name')} />
        <Input {...register('surname')} name='surname' type='text' size='large' label={t('surname')} />
        <Input {...register('email')} name='email' type='email' size='large' label={t('email')} />
        <PhoneInput register={register} name='phoneNumber' label={t('phone')} />
        <Input {...register('password')} name='password' type='password' size='large' label={t('password')} />
        <Input
          {...register('password_confirmation')}
          name='password_confirmation'
          type='password'
          size='large'
          label={t('password_confirm')}
        />
        <div>
          <Checkbox
            {...register('explicitConsent', { required: t('required') })}
            name='explicitConsent'
            label={t.rich('explicit_consent', {
              explicit_consent: chunks => (
                <span onClick={() => handleOpenModal(0)} className='font-bold underline cursor-pointer'>
                  {chunks}
                </span>
              )
            })}
          />
          <ErrorMessage
            errors={errors}
            name='explicitConsent'
            render={({ message }) => <p className='text-red-600 font-bold w-full'>{message}</p>}
          />
        </div>
        <Checkbox {...register('acceptEmail')} name='acceptEmail' label={t('accept_email')} />
        <div>
          <Checkbox
            {...register('clarificationText', { required: t('required') })}
            name='clarificationText'
            label={t.rich('terms', {
              terms: chunks => <span onClick={() => handleOpenModal(1)} className='font-bold underline cursor-pointer'>{chunks}</span>
            })}
          />
          <ErrorMessage
            errors={errors}
            name='clarificationText'
            render={({ message }) => <p className='text-red-600 font-bold w-full'>{message}</p>}
          />
        </div>
        <Button type='submit' disabled={isSubmitting}>
          {t('approve')}
        </Button>
        <p>{t.rich('membership_conditions', {membership_conditions: chunks => <span onClick={() => handleOpenModal(2)} className='font-bold underline cursor-pointer'>{chunks}</span>})}</p>
      </form>
      <div className='text-center text-sm font-medium text-black '>
        {t('already_have_an_account')}{' '}
        <Link href='/login' className='text-sm font-bold text-[#0080FF] underline'>
          {t('login')}
        </Link>
      </div>
      {isTermModalOpen && (
        <Modal id='termModal' secondButtonName={t('ok')} onSave={() => handleCloseModal()} onClose={handleCloseModal}>
          <TermModal tabId={tabId} kvkkContentData={kvkkContentData} />
        </Modal>
      )}
    </>
  )
}

export default RegisterFirstStep