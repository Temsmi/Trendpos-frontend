import classNames from 'classnames'
import React, { useState, useEffect } from 'react'
import Select, { StylesConfig } from 'react-select'

type DropdownItem<T> = {
  value: T | undefined
  label: string
}

type NewProductDropdownProps<T> = {
  className?: string
  srOnly?: boolean
  isDisabled?: boolean
  submenu: DropdownItem<T>[]
  onChange?: (selectedValue: T | undefined) => void
  label?: string
  selectedValue?: T | undefined
  customBorderColor?: string
  id?: string
  labelId?: string
  isProfile?:boolean
}

const NewProductDropdown = <T,>({
  className,
  submenu = [],
  onChange,
  label,
  srOnly = true,
  customBorderColor,
  selectedValue: initialSelectedValue,
  isDisabled,
  id,
  labelId,
  isProfile,
  ...props
}: NewProductDropdownProps<T>) => {
  const [selectedValue, setSelectedValue] = useState<T | undefined>(initialSelectedValue)
  const safeSubmenu = Array.isArray(submenu) ? submenu : []
  const value = safeSubmenu.find(item => item.value === selectedValue)

  useEffect(() => {
    setSelectedValue(initialSelectedValue)
  }, [initialSelectedValue])

  const handleOnChange = (selectedOption: DropdownItem<T> | null) => {
    const value = selectedOption ? selectedOption.value : undefined
    setSelectedValue(value)
    if (onChange) {
      onChange(value)
    }
  }

  const customStyles: StylesConfig<DropdownItem<T>, false> = {
    control: (provided, state) => ({
      ...provided,
      background: isProfile ? '#FDFDFD' : state.isDisabled ? 'rgba(241, 241, 241, 0.75)' : 'rgb(241, 241, 241)',
      '&:hover': {
        background: state.isDisabled ? 'rgba(209, 213, 219, 0.5)' : '',
        color: 'white'
      },
      width: '100%',
      height: '3rem',
      borderRadius: customBorderColor ? '0 0.75rem 0.75rem 0' : '0.75rem',
      border: isProfile ? 'border border-zinc-200' : 'none',
      borderLeft: isProfile ? '' : customBorderColor ? `0.5px solid ${customBorderColor}` : 'none',
      boxShadow: isProfile ? '#e4e4e7' : state.isFocused ? '0 0 0 1px #ff761e' : 'none'
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? 'rgba(163, 163, 163, 0.75)' : 'rgb(163, 163, 163)'
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#ff761e' : state.isFocused ? '#ff741e31' : 'transparent',
      color: state.isSelected ? 'white' : 'black',
      '&:active': {
        background: state.isSelected ? '#ff761e' : '#ff741e31'
      }
    }),
    clearIndicator: provided => ({
      ...provided,
      display: 'none'
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? 'rgba(163, 163, 163, 0.75)' : 'black'
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: 'black',
      '&:hover': {
        color: 'black'
      }
    })
  }
  

  return (
    <div id={labelId} className='custom-dropdown relative w-full'>
      {label && (
        <label
          className={classNames(
            'block text-sm font-medium',
            { 'text-black': !isDisabled, 'opacity-50': isDisabled },
            srOnly ? 'sr-only' : '',
            className
          )}>
          {label}
        </label>
      )}
      <Select
        value={value}
        onChange={handleOnChange}
        options={submenu}
        styles={customStyles}
        isClearable={true}
        isDisabled={isDisabled}
        placeholder={initialSelectedValue === undefined ? label : ''}
        menuPosition='fixed'
        menuPlacement='auto'
        id={id}
        {...props}
      />
    </div>
  )
}

export default NewProductDropdown
