'use client'
import { useLocale, useTranslations } from 'next-intl'
import Input from '@/components/input/input'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Listbox } from '@headlessui/react'
import { TbChevronDown } from 'react-icons/tb'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import PhoneInput from '@/components/input/phone-input'
import { useForm, SubmitHandler } from 'react-hook-form'
import useCustomToast from '@/hooks/use-toast'
import { LoginDataType } from '@/lib/types'
import Button from '@/components/button'

type OptionType = { id: number; name: string; default?: boolean; unavailable?: boolean }

const LoginForm = () => {
  const locale = useLocale()
  const toast = useCustomToast()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginDataType>()
  const t = useTranslations('auth')

  const options = [
    { id: 1, name: t('phone'), default: true },
    { id: 2, name: t('email'), unavailable: false }
  ]

  const [selectedValue, setSelectedValue] = useState<OptionType | undefined>(options?.find(option => option.default))

  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

  const onSubmit: SubmitHandler<LoginDataType> = async data => {
    const uniqueIdentifier = data?.email ? data.email : data.phone

    try {
      signIn('credentials', {
        uniqueIdentifier: uniqueIdentifier!.replaceAll(' ', ''),
        password: data.password,
        callbackUrl
      })
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

  useEffect(() => {
    if (error) {
      toast({
        message: locale === 'tr' ? error === 'CredentialsSignin' ? 'Geçersiz Kullanıcı Bilgisi' : 'Giriş yaparken bir hata oluştu' : 'An error occurred while logging in',
        type: 'error',
        toastId: error
      })
    }
  }, [error])

  useEffect(() => {
    if (error) {
      toast({
        message: error,
        type: 'error',
        toastId: error
      })
    }
  }, [error])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center gap-5'>
      <div className='relative w-full'>
        {selectedValue?.name === 'EMAIL' ? (
          <Input {...register('email')} name='email' type='email' size='large' label='E-mail adresiniz' />
        ) : (
          <PhoneInput register={register} name='phone' label='Telefon numaranız' />
        )}
        <Listbox
          value={selectedValue}
          onChange={setSelectedValue}
          as='div'
          className='absolute right-0 top-0 z-10 flex h-full cursor-pointer flex-col items-center border-l border-[#DEDEDE] '>
          {({ open }) => (
            <>
              <Listbox.Button
                className={classNames(
                  'flex items-center gap-1 rounded-tr-xl px-6 py-4 text-sm font-semibold text-[#72748C]',
                  {
                    'bg-[#FDFDFD]': open
                  }
                )}>
                {selectedValue?.name}
                <TbChevronDown
                  className={classNames('h-6 w-6 stroke-[3px]', {
                    'rotate-180': open
                  })}
                />
              </Listbox.Button>
              <Listbox.Options className='-mt-0.5 w-full rounded-b-xl bg-[#FDFDFD] text-sm text-[#72748C]'>
                {options.map(item => (
                  <Listbox.Option
                    key={item.id}
                    value={item}
                    disabled={item.unavailable}
                    className='px-3 py-1 last:rounded-b-xl hover:bg-[#99999938]'>
                    {item.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </>
          )}
        </Listbox>
      </div>
      <Input {...register('password')} name='password' type='password' size='large' label={t('password')} />
      <Button type='submit' disabled={isSubmitting}>
        {t('login')}
      </Button>
    </form>
  )
}
export default LoginForm
