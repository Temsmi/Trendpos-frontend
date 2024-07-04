'use client'
import { default as Phone } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import classNames from 'classnames'
import { useState } from 'react'
import type { FieldValues, UseFormRegister } from 'react-hook-form'
import type { E164Number } from 'libphonenumber-js'

type PhoneInputProps = {
  className?: string
  name: string
  label: string
  placeholder?: string
  srOnly?: boolean
  disabled?: boolean
  register: UseFormRegister<any>
}

const numberContainerStyles = 'text-sm font-medium outline-0 placeholder:text-neutral-400 '
const countrySelectStyles = 'w-fit rounded-xl bg-[#FDFDFD]'

const PhoneInput: React.FC<PhoneInputProps> = ({
  className,
  name,
  label,
  placeholder,
  register,
  disabled,
  srOnly = true,
  ...props
}) => {
  const [value, setValue] = useState<E164Number>()
  return (
    <div className={classNames('flex w-full flex-col gap-1.5', className)}>
      <label
        htmlFor={name}
        className={classNames('w-fit text-sm font-medium text-[#999999]', srOnly ? 'sr-only' : '', className)}>
        {label}
      </label>
      <Phone
        {...register(name)}
        placeholder={placeholder ?? label}
        type='text'
        name={name}
        disabled={disabled}
        id={name}
        value={value}
        onChange={setValue}
        international
        required
        defaultCountry='TR'
        countryCallingCodeEditable={false}
        limitMaxLength={true}
        className='w-full rounded-xl border border-zinc-100 bg-[#FDFDFD] px-6 py-4'
        numberInputProps={{
          className: numberContainerStyles
        }}
        countrySelectProps={{
          className: countrySelectStyles
        }}
        {...props}
      />
    </div>
  )
}

export default PhoneInput
