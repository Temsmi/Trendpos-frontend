'use client'
import fetchClient from '@/lib/fetch-client'
import { DropdownItem } from '@/lib/types'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import Select, { StylesConfig } from 'react-select'

interface CategorySelectProps {
  className?: string
  required?: boolean
  value: any
  name: string
  externalParams?: any
  onChange: (e: any) => void
  width?: string
  disabled?: boolean
  customBorderColor?: string
  label: string
  isDisabled?: boolean
}

export function CategorySelect(props: CategorySelectProps) {
  const {
    className = '',
    required = false,
    value,
    name,
    externalParams = {},
    onChange,
    width,
    disabled = false,
    customBorderColor = '#B1B5BB',
    label,
    isDisabled
  } = props

  const t = useTranslations('sales-report')

  const [isLoading, setIsLoading] = useState(false)
  const [cats, setCats] = useState([{ value: t('all'), label: t('all') }])

  const fetchCategories = async () => {
    let params = { ...externalParams }
    if (name === 'cat1') {
      params = {
        languageId: externalParams.languageId
      }
    }

    if (name === 'cat2') {
      if (!externalParams.cat1) {
        setCats([{ value: t('all'), label: t('all') }])
        return
      }
      delete params.cat2
      delete params.cat3
    } else if (name === 'cat3') {
      if (!externalParams.cat2) {
        setCats([{ value: t('all'), label: t('all') }])
        return
      }
      delete params.cat3
    }

    try {
      setIsLoading(true)

      if(externalParams.cat1 == t('all')){
        params.cat1 = "all"
      }
      if(externalParams.cat2 == t('all')){
        params.cat2 = "all"
      }
      if(externalParams.cat2 == t('all')){
        params.cat2 = "all"
      }
      const queryParams = new URLSearchParams({
        include_only: name,
        ...params
      })
      

      const res = await fetchClient(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/branch-catalog/category-filter?${queryParams}`
      )

      if (res.ok) {
        const data = await res.json()
        if (data.data && data.data.length > 0) {
          const newCategories = data.data.map((c: any) => ({
            value: c[name],
            label: c[name],
            name: name
          }))
          setCats([{ value: t('all'), label: t('all') }, ...newCategories])
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const customStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      background: state.isDisabled ? 'rgba(241, 241, 241, 0.75)' : 'rgb(241, 241, 241)',
      '&:hover': {
        background: state.isDisabled ? 'rgba(209, 213, 219, 0.5)' : '',
        color: 'white'
      },
      width: '100%',
      height: '3rem',
      borderRadius: '0.75rem',
      border: 'none',
      boxShadow: state.isFocused ? '0 0 0 1px #ff761e' : 'none'
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
    <div className='custom-dropdown relative w-full'>
      {label && (
        <label
          className={classNames(
            ' block text-sm font-medium',
            { 'text-#00000': !isDisabled, 'opacity-50': isDisabled },
            className
          )}>
          {label}
        </label>
      )}

      <Select
        isDisabled={isDisabled}
        options={cats}
        required={required}
        className={className}
        name={name}
        onFocus={() => {
          fetchCategories()
        }}
        value={value ? { value: value, label: value } : { value: t('all'), label: t('all') }}
        onChange={onChange}
        isLoading={isLoading}
        styles={customStyles}
        menuPosition='fixed'
        menuPlacement='auto'
        isClearable={false}
      />
    </div>
  )
}
