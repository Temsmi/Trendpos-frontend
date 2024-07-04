import { useState, useEffect } from 'react'
import Select, { StylesConfig } from 'react-select'
import fetchClient from '@/lib/fetch-client'

interface PersonnelSelectProps {
  className?: string
  required?: boolean
  value: { userId: string | null; firstName: string | null } | undefined
  onChange: (value: { userId: string | null; firstName: string | null } | undefined) => void
  label: string
  companyId: number
}

export function PersonnelSelect(props: PersonnelSelectProps) {
  const { className = '', required = false, value, onChange, label, companyId } = props

  const [isLoading, setIsLoading] = useState(false)
  const [personnelList, setPersonnelList] = useState<any[]>([])

  useEffect(() => {
    if (companyId) {
      fetchPersonnel()
    }
  }, [companyId])

  const fetchPersonnel = async () => {
    try {
      setIsLoading(true)
      const res = await fetchClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/company/${companyId}/personnel/`)
      if (res.ok) {
        const data = await res.json()
        if (data.data && data.data.length > 0) {
          setPersonnelList([{ userId: 'all', firstName: 'All' }, ...data.data])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

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
      {label && <label className={className}>{label}</label>}

      <Select
        options={personnelList.map((person: any) => ({
          value: { userId: person.userId, firstName: person.firstName },
          label: person.firstName
        }))}
        required={required}
        className={className}
        name='createdUser'
        onFocus={fetchPersonnel}
        value={value ? { value: value.userId, label: value.firstName } : { value: 'all', label: 'All' }}
        onChange={(selectedOption: any) => onChange(selectedOption ? selectedOption.value : { userId: 'all', firstName: 'All' })}
        isLoading={isLoading}
        styles={customStyles}
        menuPosition='fixed'
        menuPlacement='auto'
        isClearable={false}
      />
    </div>
  )
}
