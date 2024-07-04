'use client'

import { useState } from 'react'

import Input from '../input/input'
import { PersonnelSelect } from '../personnel-select-sales-report'
import { CategorySelect } from '../category-select'

type SalesFilterProps = {
  startDate: string
  endDate: string
  companyId: number
  cat1: string | undefined
  cat2: string | undefined
  cat3: string | undefined
  brand: string | undefined
  subBrand: string | undefined
  productName: string | undefined
}

interface CategoryQueryParamsType {
  languageId: string
  cat1?: string
  cat2?: string
  cat3?: string
}

interface Personnel {
  userId: string | null
  firstName: string | null
}

export const SalesFilter = (props: SalesFilterProps) => {
  const { startDate, endDate } = props

  const [dateRange, setDateRange] = useState({
    startDate: startDate,
    endDate: endDate
  })
  const [categoryQueryParams, setCategoryQueryParams] = useState<CategoryQueryParamsType>({
    languageId: 'TR', // Initial languageId value
    cat1: props.cat1, // Initialize cat1 with props.cat1 value
    cat2: props.cat2, // Initialize cat2 with props.cat2 value
    cat3: props.cat3 // Initialize cat3 with props.cat3 value
  })
  const [catQueryParams, setCatQueryParams] = useState<CategoryQueryParamsType>({
    languageId: 'TR', // Initial languageId value
    cat1: props.cat1, // Initialize cat1 with props.cat1 value
    cat2: props.cat2, // Initialize cat2 with props.cat2 value
    cat3: props.cat3 // Initialize cat3 with props.cat3 value
  })
  const [productName, setProductName] = useState('')
  const [brand, setBrand] = useState('')
  const [subBrand, setSubBrand] = useState('')
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | undefined>(undefined)

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value)
  }

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrand(e.target.value)
  }

  const handleSubBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubBrand(e.target.value)
  }

  const handlePersonnelChange = (value: Personnel | undefined) => {
    setSelectedPersonnel(value)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    })
  }

  const handleCategoryChange = (name: string, value: string) => {
    const updatedValue = value ? value.toUpperCase() : value
    if (name === 'cat1') {
      setCatQueryParams(prevParams => ({
        ...prevParams,
        cat1: value,
        cat2: undefined,
        cat3: undefined
      }))
      setCategoryQueryParams(prevParams => ({
        ...prevParams,
        cat1: updatedValue,
        cat2: undefined,
        cat3: undefined
      }))
    } else if (name === 'cat2') {
      setCatQueryParams(prevParams => ({
        ...prevParams,
        cat2: value,
        cat3: undefined
      }))
      setCategoryQueryParams(prevParams => ({
        ...prevParams,
        cat2: updatedValue,
        cat3: undefined
      }))
    } else {
      setCatQueryParams(prevParams => ({
        ...prevParams,
        [name]: value
      }))

      setCategoryQueryParams(prevParams => ({
        ...prevParams,
        [name]: updatedValue
      }))
    }
  }

  return (
    <form method='GET' className='grid grid-cols-12 gap-3 p-5'>
      <div className='col-span-3'>
        <label style={{ fontSize: 14, color: 'gray', marginLeft: 5 }}>Başlangıç ​Tarihi</label>
        <input
          type='date'
          value={dateRange.startDate}
          name='startDate'
          onChange={handleDateChange}
          className='w-full rounded-xl border border-zinc-100 bg-[#F1F1F1] p-3 text-sm font-medium outline-0 placeholder:text-neutral-400'
          onClick={e => e.currentTarget.showPicker()}
        />
      </div>
      <div className='col-span-3'>
        <label style={{ fontSize: 14, color: 'gray', marginLeft: 5 }}>Bitiş Tarihi</label>
        <input
          type='date'
          value={dateRange.endDate}
          name='endDate'
          onChange={handleDateChange}
          className='w-full rounded-xl border border-zinc-100 bg-[#F1F1F1] p-3 text-sm font-medium outline-0 placeholder:text-neutral-400'
          onClick={e => e.currentTarget.showPicker()}
        />
      </div>
      <CategorySelect
        className={''}
        required={false}
        value={categoryQueryParams.cat1 ? categoryQueryParams.cat1 : undefined} // Use cat1 directly, ensuring it's a string or an empty string if undefined
        name='cat1'
        externalParams={catQueryParams}
        onChange={value => handleCategoryChange('cat1', value)}
        label={'Category 1'}
      />

      <CategorySelect
        className={''}
        required={false}
        value={categoryQueryParams.cat2 ? categoryQueryParams.cat2 : undefined} // Use cat2 directly, ensuring it's a string or an empty string if undefined
        name='cat2'
        externalParams={catQueryParams}
        onChange={value => handleCategoryChange('cat2', value)}
        label={'Category 2'}
      />

      <CategorySelect
        className={' text-sm'}
        required={false}
        value={categoryQueryParams.cat3 ? categoryQueryParams.cat3 : undefined} // Use cat3 directly, ensuring it's a string or an empty string if undefined
        name='cat3'
        externalParams={catQueryParams}
        onChange={value => handleCategoryChange('cat3', value)}
        label={'Category 3'}
      />
      <Input
        name='productName'
        label='Product Name'
        value={productName}
        onChange={handleProductNameChange}
        required={false}
      />
      <Input name='brand' label='Brand' value={brand} onChange={handleBrandChange} required={false} />
      <Input name='subBrand' label='Sub-Brand' value={subBrand} onChange={handleSubBrandChange} required={false} />

      <PersonnelSelect
        label='Select User'
        companyId={props.companyId}
        value={selectedPersonnel}
        onChange={handlePersonnelChange}
        required={false}
      />

      <div className='col-span-3 flex flex-col justify-end'>
        <button
          className='font-400 h-[67%] w-full rounded-lg bg-white p-3 py-2 text-[14px] font-bold text-black'
          style={{ border: '1px solid #e6e5e3' }}
          type='submit'>
          Listele
        </button>
      </div>
    </form>
  )
}
