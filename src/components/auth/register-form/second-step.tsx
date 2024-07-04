'use client'
import PinInput from '@/components/input/pin-input'
import { useWizard } from 'react-use-wizard'
import TimeCounter from './time-counter'
import { useEffect, useState } from 'react'
import { SubmitHandler, UseFormRegister, UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form'
import Link from 'next/link'
import { RegisterDataType } from '@/lib/types'
import fetchClient from '@/lib/fetch-client'
import useCustomToast from '@/hooks/use-toast'
import Button from '@/components/button'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'

const RegisterSecondStep = ({
  register,
  handleSubmit,
  setValue,
  isSubmitting,
}: {
  register: UseFormRegister<RegisterDataType>
  handleSubmit: UseFormHandleSubmit<RegisterDataType>
  setValue: UseFormSetValue<RegisterDataType>
  isSubmitting: boolean
}) => {
  const toast = useCustomToast()
  const { nextStep } = useWizard()
  const [timeEnd, setTimeEnd] = useState<boolean>(false)
  const terms = useSelector((state: RootState) => state.terms.terms)

  const [ipAddress, setIpAddress] = useState<string>()

  const fetchIP = async () => {
    const response = await fetch('https://api.ipify.org')
    const data = await response.text()
    setIpAddress(data)
  }

  useEffect(() => {
    fetchIP()
  }, [])
  
  const onSubmit: SubmitHandler<RegisterDataType> = async data => {
    try {
      await fetchClient('/validation/phone-validation-confirm', {
        method: 'POST',
        data: { otpCode: data.otpCode, phoneNumber: data.phoneNumber.replaceAll(' ', '') }
      })

      const { otpCode, ...payload } = data

      const contentIds = [terms.explicitConsent && 1, terms.clarificationText && 3, 4]
      if (terms.acceptEmail) {
        contentIds.push(2)
      }

      await fetchClient('/auth/pre-register', {
        method: 'POST',
        data: { ...payload, contentIds, ipAddress, phoneNumber: payload.phoneNumber.replaceAll(' ', '') }
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

  const t = useTranslations('auth')
  const date = new Date()
  let newdate = +date + 300000
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center gap-9'>
        <PinInput {...register('otpCode')} setValue={setValue} length={4} timeEnd={timeEnd} />
        <TimeCounter onTimeEnd={setTimeEnd} date={newdate} />
        <Button type='submit' disabled={timeEnd || isSubmitting}>
          {timeEnd ? t('send_code_again') : t('verify')}
        </Button>
      </form>
      <div className='text-center text-sm font-medium text-black '>
        {t('already_have_an_account')}{' '}
        <Link href='/login' className='text-sm font-bold text-[#0080FF] underline'>
          {t('login')}
        </Link>
      </div>
    </>
  )
}
export default RegisterSecondStep
