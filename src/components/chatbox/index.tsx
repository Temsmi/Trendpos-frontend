'use client'
import { BsLifePreserver } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import React, { useEffect, useState } from 'react'
import Input from '@/components/input/input'
import Button from '@/components/button'
import MessageInput from '@/components/message'
import useCustomToast from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { useForm, SubmitHandler, set } from 'react-hook-form'
import fetchClient from '@/lib/fetch-client'
import { ContactSupportDataType } from '@/lib/types'
import { Icon } from '../icons'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

type ChatboxProps = {
  name: string
  surname: string
  email: string
}

const Chatbox: React.FC<ChatboxProps> = ({ name, surname, email }) => {
  const t = useTranslations('dashboard')
  const [isOpen, setIsOpen] = useState(false)

  const QuilModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ]
    }
  }

  const toggleChatbox = () => {
    setIsOpen(prevIsOpen => !prevIsOpen)
  }

  const toast = useCustomToast()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue
  } = useForm<ContactSupportDataType>({
    defaultValues: {
      // Specify initial values for your form fields
      firstname: name,
      lastname: surname,
      email: email
    }
  })

  useEffect(() => {
    register('message', { required: true })
  }, [register])
  const onQuillStateChange = (editorState: string) => {
    setValue('message', editorState)
  }
  const quillContent = watch('message')

  const onSubmit: SubmitHandler<ContactSupportDataType> = async data => {
    try {
      const response = await fetchClient('/dashboard/contact-support', {
        method: 'POST',
        data: data
      })
      const responseBody = await response.json()
      toast({
        type: 'success',
        message: responseBody.message
      })
      // reset form
      resetForm()
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

  const resetForm = () => {
    setValue('message', '')
    toggleChatbox()
  }

  const inputStyle = {
    backgroundColor: 'white',
    border: '0.1px solid #e6e5e3'
  }

  return (
    <div>
      {isOpen && (
        <div className='absolute bottom-28 right-7 flex h-[600px] w-[454px] flex-col rounded-[27px] bg-white shadow-lg'>
          <div className='flex h-[60px] items-center rounded-tl-[27px] rounded-tr-[27px] bg-[#ff8f1e] pl-6 text-[20px] font-[500] text-white'>
            {t('help')}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mt-6 flex h-[500px] flex-col items-center justify-start gap-4 px-6'>
              <Input
                {...register('firstname')}
                style={inputStyle}
                name='firstname'
                type='text'
                size='large'
                label={t('name')}
                required
              />
              <Input
                {...register('lastname')}
                style={inputStyle}
                name='lastname'
                type='text'
                size='large'
                label={t('surname')}
                required
              />
              <Input
                {...register('email')}
                style={inputStyle}
                name='email'
                type='email'
                size='large'
                label={t('email')}
                required
              />
              {/* <textarea
                {...register('message')}
                name="message"
                placeholder={t('typeYourMessage')}
                className="h-[150px] w-full resize-none rounded-xl border border-zinc-100 bg-[#FDFDFD] px-6 py-4 text-sm font-medium outline-0 placeholder:text-neutral-400"
              /> */}
              <div className='flex h-full flex-col overflow-y-auto bg-[#FDFDFD] scrollbar-thin scrollbar-thumb-[#ff8f1e]'>
                <ReactQuill
                  placeholder={t('help_component_placeholder')}
                  theme='snow'
                  value={quillContent}
                  onChange={onQuillStateChange}
                  modules={QuilModules}
                  className='quill'
                />
              </div>
              {/* TODO: fix this */}
              {/* <MessageInput
                {...register('message')}
                name="message"
                placeholder={t('typeYourMessage')}
                className="h-[150px] w-full"
              /> */}
              <div className='mt-4 w-full'>
                <span className='flex justify-end'>
                  <Button
                    variant='primarySolid'
                    className='px-14 py-3.5'
                    size='small'
                    type='submit'
                    disabled={isSubmitting}>
                    {isSubmitting ? <BsLifePreserver className='animate-spin' /> : t('send')}
                  </Button>
                </span>
              </div>
            </div>
          </form>
        </div>
      )}

      <div
        className='fixed bottom-7 right-7 flex cursor-pointer items-center justify-center rounded-full border border-white bg-[#FF6D00] shadow-[0px_4px_30px_0px_#FF8F1E87]'
        onClick={toggleChatbox}>
        {isOpen ? (
          <div className=' flex h-[60px] w-[60px] items-center justify-center rounded-full'>
            <IoMdClose className='text-[30px] text-white' />
          </div>
        ) : (
          <div className='flex items-center gap-2 px-4 py-2 text-white'>
            <Icon name='help' color='white' />
            <span className='text-[18px] font-[400]'>{t('help')}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatbox
