'use client'
import React from 'react'
import classNames from 'classnames'

type MessageInputProps = {
  className?: string
  name: string
  placeholder?: string
  required?: boolean
} & React.TextareaHTMLAttributes<HTMLTextAreaElement> // Updated type here

const MessageInput: React.ForwardRefRenderFunction<HTMLTextAreaElement, MessageInputProps> = (
  { className, name, placeholder, required = true, ...props },
  ref
) => {
  return (
    <div className={classNames('flex flex-col gap-1.5', className)}>
      <div className='relative'>
        <textarea
          name={name}
          id={name}
          placeholder={placeholder}
          required={required}
          className={classNames(
            'px-6 py-4 rounded-xl border border-zinc-100 bg-[#FDFDFD] text-sm font-medium outline-0 placeholder:text-neutral-400 resize-none',
            className
          )}
          {...props}
        />
      </div>
    </div>
  )
}

MessageInput.displayName = 'MessageInput'

export default MessageInput
