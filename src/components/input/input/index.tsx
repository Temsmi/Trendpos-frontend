'use client'
import classNames from 'classnames'
import { useState, forwardRef } from 'react'
import { TbEye, TbEyeOff } from 'react-icons/tb'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string
  name: string
  label: string
  placeholder?: string
  size?: 'large' | 'small' | 'x-small'
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'date'
  srOnly?: boolean
  required?: boolean
  ref?: React.LegacyRef<HTMLInputElement> | undefined
  isMultiple?:boolean
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { className, name, label, placeholder, size, type = 'text', srOnly = true, required = true, isMultiple, ...props },
  ref
) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={classNames('flex w-full select-none flex-col gap-1.5', className)}>
      <label
        htmlFor={name}
        className={classNames(
          'w-fit text-sm font-medium ',
          props.disabled && 'text-black/50',
          srOnly ? 'sr-only' : '',
          className
        )}>
        {label}
      </label>
      <div className='relative w-full'>
        {isMultiple ? (
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            name={name}
            id={name}
            placeholder={placeholder ?? label}
            title={label}
            aria-label={label}
            required={required}
            rows={2}
            className={classNames(
              'w-full rounded-xl border border-zinc-200 bg-[#F1F1F1] text-sm font-medium outline-0 placeholder:text-neutral-400',
              props.disabled && 'text-black/50 resize-none',
              size === 'large' ? 'px-6 py-4' : size === 'x-small' ? '!w-fit px-2 py-1' : 'px-4 py-3',
              className
            )}
            disabled={props.disabled}
          />
        ) : (
          <>
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              name={name}
              id={name}
              placeholder={placeholder ?? label}
              title={label}
              aria-label={label}
              required={required}
              type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
              className={classNames(
                'w-full rounded-xl border border-zinc-200 bg-[#F1F1F1] text-sm font-medium outline-0 placeholder:text-neutral-400',
                props.disabled && 'text-black/50',
                size === 'large' ? 'px-6 py-4' : size === 'x-small' ? '!w-fit px-2 py-1' : 'px-4 py-3',
                className
              )}
              {...props}
            />
            {type === 'password' && (
              <div
                className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-[#999999]'
                onClick={togglePasswordVisibility}>
                {showPassword ? <TbEye /> : <TbEyeOff />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

Input.displayName = 'Input'
export default forwardRef(Input)
