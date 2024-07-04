'use client'
import Input from '@/components/input/input'
import Button from '@/components/button'
import { useTranslations } from 'next-intl'
import { useForm, SubmitHandler } from 'react-hook-form'
import useCustomToast from '@/hooks/use-toast'
import { ForgotPasswordDataType } from '@/lib/types'
import fetchClient from '@/lib/fetch-client'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const t = useTranslations('auth')
  const toast = useCustomToast()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ForgotPasswordDataType>()

  const onSubmit: SubmitHandler<ForgotPasswordDataType> = async data => {
    try {
      const response = await fetchClient('/auth/forget-password', {
        method: 'POST',
        data: data
      })
      const responseBody = await response.json()
      toast({
        type: 'success',
        message: responseBody.message
      })
      router.push('/login')
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center gap-5'>
      <Input {...register('email')} name='email' type='tel' size='large' label={t('email')} />
      <Button type='submit' disabled={isSubmitting}>
        {t('send')}
      </Button>
    </form>
  )
}
export default LoginForm
