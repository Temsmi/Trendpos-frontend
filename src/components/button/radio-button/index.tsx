import React from 'react'

type RadioButtonProps = {
  label: string
  name: string
  value: string
  checked?: boolean
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
}

const RadioButton = ({ label, name, value, checked, disabled, onChange, onClick }: RadioButtonProps) => {
  return (
    <div className='flex items-center gap-2'>
      <input
        type='radio'
        id={value}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onClick={onClick}
        onChange={onChange}
        className='focus:ring-primary h-4 w-4 rounded-full border-2 border-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100'
      />
      <label htmlFor={value}>{label}</label>
    </div>
  )
}

export default RadioButton
