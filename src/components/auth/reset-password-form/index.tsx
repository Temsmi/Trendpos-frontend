'use client'
import Input from '@/components/input/input'
import { useForm, SubmitHandler } from 'react-hook-form'
import useCustomToast from '@/hooks/use-toast'
import { ResetPasswordDataType } from '@/lib/types'
import fetchClient from '@/lib/fetch-client'
import Button from '@/components/button'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const params = useParams()
  const email = searchParams.get('email')
  const token = params.token.toString()
  const toast = useCustomToast()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ResetPasswordDataType>()
  const onSubmit: SubmitHandler<ResetPasswordDataType> = async data => {
    try {
      const response = await fetchClient('/auth/reset-password', {
        method: 'PUT',
        data: {
          ...data,
          email: email,
          token: token
        }
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
      <Input {...register('password')} name='password' type='password' size='large' label='Şifreniz' />
      <Input
        {...register('confirmPassword')}
        name='confirmPassword'
        type='password'
        size='large'
        label='Şifrenizi Tekrar Giriniz'
      />
      <Button type='submit' disabled={isSubmitting}>
        Gönder
      </Button>
    </form>
  )
}

export default ResetPasswordForm
