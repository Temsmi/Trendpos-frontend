'use client'
import React, { useEffect, useRef, useState } from 'react'
import Input from '@/components/input/input'
import { FaMinus, FaPlus } from 'react-icons/fa'
import Button from '@/components/button/index'
import NewProductDropdown from '@/components/dropdown/new-product-dropdown'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { DropdownItem, NewProductType, FilterOptions } from '@/lib/types'
import fetchClient from '@/lib/fetch-client'
import { useTranslations } from 'next-intl'
import useCustomToast from '@/hooks/use-toast'
import { CategorySelect } from '../create-product-category-select'
import Modal from '../popup/modal-form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { closeModal } from '@/store/modalSlice'
import { changeProductName, changeProductSellingPrice } from '@/store/customersStore'

interface CategoryQueryParamsType {
  languageId: string
  cat1?: string
  cat2?: string
  cat3?: string
}

interface FirmOption {
  label: string
  value: string | number
}

interface BrandOption {
  label: string
  value: string | number
}

interface SubBrandOption {
  label: string
  value: string | number
}

const CreateProductModal: React.FC = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, setValue, getValues, reset, control } = useForm<NewProductType>()
  const t = useTranslations('create-product')
  const [productData, setProductData] = useState<NewProductType | null>(null)
  const [categoryQueryParams, setCategoryQueryParams] = useState<CategoryQueryParamsType>({ languageId: 'TR' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useCustomToast()
  const [filterOptions, setFilterOptions] = useState<FilterOptions | undefined>(undefined)
  const [isBarcodeScanned, setIsBarcodeScanned] = useState(false)
  const [firmId, setFirmId] = useState<Number>()
  const [brandId, setBrandId] = useState<Number | null>()
  const [subBrandId, setSubBrandId] = useState<Number | null>()
  const [filterOptionsFirm, setFilterOptionsFirm] = useState<FirmOption[]>([])
  const [filterOptionsBrand, setFilterOptionsBrand] = useState<BrandOption[]>([])
  const [filterOptionsSubBrand, setFilterOptionsSubBrand] = useState<SubBrandOption[]>([])
  const [barcode, setBarcode] = useState<string>('')
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)
  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'createProduct' && modal.isOpen)
  )
  const reduxbarcode = useSelector((state: RootState) => {
    const modal = state.modal.modals.find(m => m.id === 'createProduct')
    return modal?.data?.barcode
  })

  useEffect(() => {
    if (reduxbarcode) {
      const numericBarcode = reduxbarcode
      setValue('barcode', numericBarcode)
      setBarcode(numericBarcode) // barkod state'ini güncelle
    }
  }, [reduxbarcode, setValue])

  const [filterOptionsLoaded, setFilterOptionsLoaded] = useState(false)
  useEffect(() => {
    fetchClient('/branch-catalog/filter-options')
      .then(response => response.json())
      .then(data => {
        setFilterOptions(data.data)
        setFilterOptionsLoaded(true)
      })
      .catch(error => {
        console.error('Error fetching data: ', error)
      })
  }, [])
  useEffect(() => {
    if (reduxbarcode) {
      handlePress()
    }
  }, [barcode])
  const handleCategoryFilterChange = (option: any) => {
    const { name, value } = option
    const prev: any = { ...categoryQueryParams, [name]: value }
    if (name === 'cat1') {
      delete prev.cat2
      delete prev.cat3
      setValue('cat2', '')
      setValue('cat3', '')
    } else if (name === 'cat2') {
      delete prev.cat3
      setValue('cat3', '')
    }
    setCategoryQueryParams(prev)
    setValue(name, value)
  }

  const handlePress = async () => {
    setLoading(true)
    setError(null)
    setIsBarcodeScanned(true)
    try {
      if (barcode) {
        const response = await fetchClient(`/branch-catalog/${barcode}`)
        const responseData = await response.json()
        setBarcode(barcode)
        setValue('barcode', responseData.data.barcode)
        setProductData(responseData.data)
        const firmName = responseData.data.firm
        const matchedFirm = filterOptionsFirm.find(item => item.label === firmName)
        if (matchedFirm) {
          setFirmId(Number(matchedFirm.value))
          setValue('firmId', Number(matchedFirm.value))
          const brandsResponse = await fetchClient(`/branch-catalog/brand-filter?firmId=${matchedFirm.value}`)
          const brandsData = await brandsResponse.json()
          setFilterOptionsBrand(brandsData.data)
          const brandName = responseData.data.brand
          const matchedBrand = brandsData.data.find((item: { label: any }) => item.label === brandName)
          if (matchedBrand) {
            setBrandId(Number(matchedBrand.value))
            setValue('brandId', Number(matchedBrand.value))
            const subBrandsResponse = await fetchClient(`/branch-catalog/sub-brand-filter?brandId=${matchedBrand.value}`)
            const subBrandsData = await subBrandsResponse.json()
            setFilterOptionsSubBrand(subBrandsData.data || [])
            setValue('subBrandId', Number(subBrandsData.data?.find((item: { label: any }) => item.label === responseData.data.subBrand)?.value))
          }
        }
        setValue('buyingPrice', responseData.data.buyingPrice)
        setValue('cat1', responseData.data.cat1)
        setValue('cat2', responseData.data.cat2)
        setValue('cat3', responseData.data.cat3)
        setValue('criticalStock', responseData.data.criticalStock)
        setValue('currencyId', filterOptions?.currencies?.find(item => item.label === responseData.data.currency)?.value)
        setValue('name', responseData.data.name)
        setValue('packageTypeId', filterOptions?.packageTypes?.find(item => item.label === responseData.data.packageType)?.value)
        setValue('sellingPrice', responseData.data.sellingPrice)
        setValue('packageUnit', responseData.data.packageUnit)
        setValue('stock', responseData.data.stock)
        setValue('tax', responseData.data.tax)
        setValue('unitTypeId', filterOptions?.unitTypes?.find(item => item.label === responseData.data.unitType)?.value)
        setValue('weight', responseData.data.weight)
        setValue('weightTypeId', filterOptions?.weightTypes?.find(item => item.label === responseData.data.weightType)?.value)
      }
    } catch (error: any) {
      console.error('Error fetching barcode data:', error)
      setError(error.message)
      toast({
        type: 'info',
        message: error.message
      })
    } finally {
      setLoading(false)
    }
    setBarcode(barcode)
    setIsButtonEnabled(false)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const firmResponse = await fetchClient(`/branch-catalog/firm-filter`)
        const firmData = await firmResponse.json()
        setFilterOptionsFirm(firmData.data)

        if (!firmId) throw new Error('No firmId provided')

        const brandResponse = await fetchClient(`/branch-catalog/brand-filter?firmId=${firmId}`)
        const brandData = await brandResponse.json()
        setFilterOptionsBrand(brandData.data)

        if (!brandId) throw new Error('No brandId provided')

        const subBrandResponse = await fetchClient(`/branch-catalog/sub-brand-filter?brandId=${brandId}`)
        const subBrandData = await subBrandResponse.json()
        setFilterOptionsSubBrand(subBrandData.data || [])
      } catch (error) {
        console.error('Error fetching data: ', error)
      } finally {
        setLoading(false)
        setFilterOptionsLoaded(true)
      }
    }
    fetchData()
  }, [firmId, brandId])
  const handleFieldChange = async (field:any, value:any) => {
    
    setLoading(true);
    try {
      if (field === 'firmId') {
        setFirmId(value);
        setValue('firmId', value);
        setBrandId(null);
        setSubBrandId(null);
        setValue('brandId', null);
        setValue('subBrandId', null);
  
        const brandsResponse = await fetchClient(`/branch-catalog/brand-filter?firmId=${value}`);
        const brandsData = await brandsResponse.json();
        setFilterOptionsBrand(brandsData.data);
        setFilterOptionsSubBrand([]);
      } else if (field === 'brandId') {
        setBrandId(value);
        setValue('brandId', value);
        setSubBrandId(null);
        setValue('subBrandId', null);
        
  
        const subBrandsResponse = await fetchClient(`/branch-catalog/sub-brand-filter?brandId=${value}`);
        const subBrandsData = await subBrandsResponse.json();
        setFilterOptionsSubBrand(subBrandsData.data || []);
      } else if (field === 'subBrandId') {
        setSubBrandId(value);
        setValue('subBrandId', value);
      }
    } catch (error) {
      console.error('Error updating field data:', error);
    } finally {
      setLoading(false);
    }
  };
  
 
  

  const onSubmit: SubmitHandler<NewProductType> = async data => {
    let Url = '/branch-catalog'
    let method = 'PUT'
    try {
      const checkResponse = await fetchClient(`${Url}/${data.barcode}`, {
        method: 'GET'
      })

      if (checkResponse.ok) {
        method = 'PUT'
        Url += `/${data.barcode}`
      } else {
        method = 'POST'
      }
    } catch (error) {
      console.error('Error checking barcode existence:', error)
      method = 'POST'
    }
    try {
      const response = await fetchClient(Url, {
        method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
        data: {
          ...data,
          barcode: barcode
        }
      })

      if (response.ok) {
        const responseBody = await response.json()
        toast({
          type: 'success',
          message: responseBody.message
        })
      } else {
        throw new Error(`Response error: ${response.status} ${response.statusText}`)
      }
    } catch (error: any) {
      console.error('Error during the product creation or update process:', error)
      if (error instanceof Response) {
        error = await error.json()
      }
      toast({
        type: 'error',
        message: error.message
      })
    }
  }
  const onSave = () => {
    handleSubmit(async data => {
      try {
        await onSubmit(data)
        dispatch(closeModal('createProduct'))
        reset()
        setBarcode('')
      } catch (error: any) {
        if (error instanceof Response) {
          error = await error.json()
        }
        console.error('Error submitting form: ', error)
        toast({
          type: 'error',
          message: error.message
        })
      }
    })()
  }
  const increaseStock = () => {
    const currentStock = Number(getValues('stock'))
    setValue('stock', currentStock + 1)
  }
  const decreaseStock = () => {
    const currentStock = Number(getValues('stock'))
    if (currentStock > 0) {
      setValue('stock', currentStock - 1)
    }
  }
  const handleCloseModal = () => {
    reset()
    setBarcode('')
    setIsBarcodeScanned(false)
    dispatch(closeModal('createProduct'))
  }
  const handleClickOutside = (event: any) => {
    if (inputRef.current && buttonRef.current) {
      setIsButtonEnabled(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      {isModalOpen && (
        <Modal
          id='createProduct'
          name={t('title')}
          onClose={handleCloseModal}
          onSave={onSave}
          firstButtonName={t('cancel')}
          secondButtonName={t('save')}>
          <div className='space-between flex gap-2 p-1'>
            <div className='space-between flex-1 px-1 '>
              <p>{t('barcode_message')}</p>
              <p className='text-red-500 text-lg px-1 '>{t('note_message')}</p>
            </div>
          </div>
          <div className='space-between flex gap-2 p-1'>
            <div className='space-between flex-1 '>
              <div className='relative w-full'>
                <div>
                  <label htmlFor='name' className='flex items-center'>
                    <span className='text-red-500 text-lg px-1 '>*</span> {t('barcode')}
                  </label>
                </div>
                <Controller
                  name='barcode'
                  control={control}
                  render={({ field: { value, name, onChange } }) => (
                    <Input
                      label={t('barcode')}
                      placeholder={t('barcode')}
                      name={name}
                      type='text'
                      value={value}
                      onChange={e => {
                        setBarcode(e.target.value)
                        onChange(e.target.value)
                      }}
                      onFocus={() => setIsButtonEnabled(true)}
                      ref={inputRef}
                      id='barcodeN'
                    />
                  )}
                />
              </div>
            </div>
            <div className='space-between flex max-w-[12] pt-7'>
              <Button
                variant='whiteSolid'
                onClick={handlePress}
                className='disabled:border-neutral-100 disabled:bg-white disabled:text-slate-300'
                ref={buttonRef}
                disabled={!isButtonEnabled}>
                {loading ? <p>{t('fetching')}</p> : <p>{t('scan_barcode')}</p>}
              </Button>
            </div>
          </div>
          <div className=' w-full border-b-2 mt-2'></div>
          <div className='space-between flex items-center gap-2 p-1'>
            {barcode ? (
              <>
                <div className='space-between flex-1'>
                  <p>{t('status_message_d')}</p>
                </div>
                <div className='space-between flex-1 '>
                  <p>
                    {t('barcode')} {String(barcode)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className='space-between flex-1 '>
                  <p>{t('status_message_w')}</p>
                </div>
                <div className='space-between flex-1 '>
                  <p>{t('product_barcode')}</p>
                </div>
              </>
            )}
          </div>
          <div className='w-full border-b-2'></div>
          <div className='space-between flex items-center gap-2 p-1'>
            <div className='relative w-full'>
              <label htmlFor='name' className='flex items-center'>
                <span className='text-red-500 text-lg'>* </span> {t('product_name')}
              </label>
              <Input
                label={''}
                {...register('name')}
                placeholder={t('product_name')}
                srOnly={false}
                className='w-full disabled:opacity-75'
                disabled={!isBarcodeScanned}
                onChange={e => {
                  const value = e.target.value
                  dispatch(
                    changeProductName({
                      productBarcode: barcode,
                      name: value
                    })
                  )
                }}
                id={'name'}
              />
            </div>
            <div className='relative w-full mt-1 '>
              <label htmlFor='name' className='flex items-center disabled:opacity-75'>
                <span className='py-1'>{t('stock')} </span>
              </label>
              <Controller
                name='stock'
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label={t('stock')}
                    name={name}
                    className='!gap-0 disabled:opacity-75'
                    type='number'
                    value={value}
                    onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    disabled={!isBarcodeScanned}
                  />
                )}
              />
            </div>
            <div className='flex w-full items-center justify-between gap-1.5 pt-8'>
              <Button
                variant='whiteSolid'
                onClick={decreaseStock}
                disabled={!isBarcodeScanned}
                className='disabled:border-neutral-100 disabled:bg-white disabled:text-slate-300'>
                <FaMinus aria-label='minus' />
                {t('decrease_stock')}
              </Button>
            </div>
            <div className='flex w-full items-center justify-between gap-1.5 pt-8'>
              <Button
                variant='whiteSolid'
                onClick={increaseStock}
                disabled={!isBarcodeScanned}
                className='disabled:border-neutral-100 disabled:bg-white disabled:text-slate-300'>
                <FaPlus aria-label='plus' />
                {t('increase_stock')}
              </Button>
            </div>
          </div>
          <div className='border-b-2 mt-2'></div>
          <div className=' space-between flex items-center gap-2 p-1'>
            <div className='space-between  flex mt-1'>
              <div className='flex ' style={{ flexBasis: '65%' }}>
                <div className='relative w-full items-center justify-between'>
                  <label htmlFor='name' className='flex items-center disabled:opacity-75 mb-1'>
                    {t('buying_price')}
                  </label>
                  <Controller
                    name='buyingPrice'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('buying_price')}
                        className='!h-12 w-full !gap-0 !rounded-r-none disabled:opacity-75'
                        name={name}
                        type='number'
                        value={value}
                        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                        disabled={!isBarcodeScanned}
                      />
                    )}
                  />
                </div>
              </div>
              <div className='flex pt-6' style={{ flexBasis: '35%' }}>
                <Controller
                  name='currencyId'
                  control={control}
                  defaultValue={'TRY'}
                  render={({ field }) => (
                    <NewProductDropdown
                      label={t('select')}
                      selectedValue={field.value}
                      submenu={filterOptions?.currencies as DropdownItem<string>[]}
                      onChange={selectedValue => field.onChange(selectedValue)}
                      customBorderColor='#B1B5BB'
                      isDisabled={!isBarcodeScanned}
                      className='disabled:opacity-75'
                      id={'currencyId'}
                    />
                  )}
                />
              </div>
            </div>
            <div className='space-between relative flex'>
              <div className='flex-grow' style={{ flexBasis: '65%' }}>
                <div className='relative w-full items-center justify-between'>
                  <label htmlFor='name' className='flex items-center disabled:opacity-75'>
                    <span className='text-red-500 text-lg px-1'> *</span> {t('selling_price')}
                  </label>
                  <Controller
                    name='sellingPrice'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('selling_price')}
                        name={name}
                        className='!h-12 w-full !gap-0 !rounded-r-none disabled:opacity-75'
                        type='number'
                        value={value}
                        onChange={e => {
                          onChange(e.target.value === '' ? '' : Number(e.target.value))
                          dispatch(
                            changeProductSellingPrice({
                              productBarcode: barcode,
                              sellingPrice: +e.target.value
                            })
                          )
                        }}
                        disabled={!isBarcodeScanned}
                      />
                    )}
                  />
                </div>
              </div>
              <div className='flex-grow pt-7' style={{ flexBasis: '35%' }}>
                <Controller
                  name='currencyId'
                  control={control}
                  render={({ field }) => (
                    <NewProductDropdown
                      label={t('select')}
                      submenu={filterOptions?.currencies as DropdownItem<string>[]}
                      selectedValue={field.value}
                      onChange={selectedValue => field.onChange(selectedValue)}
                      customBorderColor='#B1B5BB'
                      isDisabled={!isBarcodeScanned}
                    />
                  )}
                />
              </div>
            </div>
            <div className='space-between flex-1 mt-1'>
              <div className='relative w-full items-center justify-between'>
                <label htmlFor='name' className='flex mb-1 items-center disabled:opacity-75'>
                  {t('tax')}
                </label>
                <Controller
                  name='tax'
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label={t('tax')}
                      className='!gap-0 disabled:opacity-75'
                      name={name}
                      type='number'
                      value={value}
                      onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      disabled={!isBarcodeScanned}
                    />
                  )}
                />
              </div>
            </div>
            <div className='space-between flex-1 mt-1'>
              <div className='relative w-full items-center justify-between'>
                <label htmlFor='name' className='flex mb-1 items-center disabled:opacity-75'>
                  {t('critical_stock')}
                </label>
                <Controller
                  name='criticalStock'
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label={t('critical_stock')}
                      className='!gap-0 disabled:opacity-75'
                      name={name}
                      type='number'
                      value={value}
                      onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      disabled={!isBarcodeScanned}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className='border-b-2 mt-2'></div>
          <div className='space-between flex items-center gap-2 p-1'>
            <div className='space-between flex-1  gap-2 py-1'>
            <div className='relative w-full items-center justify-between'>
                <label htmlFor='name' className='flex  mb-1 items-center disabled:opacity-75'>
                  {t('firm')}
                </label>
                <Controller
                  name='firmId'
                  control={control}
                  render={({ field }) => (
                    <NewProductDropdown
                      label={t('firm')}
                      submenu={(filterOptionsFirm as unknown as DropdownItem<number>[]) || []}
                      onChange={selectedValue => handleFieldChange('firmId', selectedValue)}
                      selectedValue={field.value}
                      isDisabled={!isBarcodeScanned}
                    />
                  )}
                />
              </div>
            </div>
            <div className='space-between flex-1  gap-2 py-1'>
              <div className='relative w-full items-center justify-between'>
                <label htmlFor='name' className='flex  mb-1 items-center disabled:opacity-75'>
                  {t('brand')}
                </label>
                <Controller
                  name='brandId'
                  control={control}
                  render={({ field }) => (
                    <NewProductDropdown
                      submenu={filterOptionsBrand as unknown as DropdownItem<number>[]}
                      onChange={selectedValue => handleFieldChange('brandId', selectedValue)}
                      selectedValue={field.value }
                      srOnly={false}
                      isDisabled={!isBarcodeScanned}
                    />
                  )}
                />
              </div>
            </div>
            <div className='space-between flex-1  gap-2 py-1'>
              <div className='relative w-full items-center justify-between'>
                <label htmlFor='name' className='flex  mb-1 items-center disabled:opacity-75'>
                  {t('sub_brand')}
                </label>
                <Controller
                  name='subBrandId'
                  control={control}
                  render={({ field }) => (
                    <NewProductDropdown
                      submenu={(filterOptionsSubBrand as unknown as DropdownItem<number>[]) || []}
                      onChange={selectedValue => field.onChange(selectedValue)}
                      selectedValue={field.value === null ? '' : field.value}
                      srOnly={false}
                      isDisabled={!isBarcodeScanned}
                    />
                  )}
                />
              </div>
            </div>
            
          </div>
          <div className='border-b-2'></div>
          <div className='space-between flex items-center gap-2 p-1'>
            <div className='space-between relative flex '>
              <div className='flex-grow' style={{ flexBasis: '65%' }}>
                <div className='relative w-full items-center justify-between'>
                  <label htmlFor='name' className='flex items-center disabled:opacity-75'>
                    <span className='text-red-500 text-lg px-1 '>*</span> {t('weight_type')}
                  </label>
                  <Controller
                    name='weight'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('weight_type')}
                        className='!h-12 w-full !gap-0 !rounded-r-none disabled:opacity-75'
                        name={name}
                        type='number'
                        value={value}
                        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                        disabled={!isBarcodeScanned}
                      />
                    )}
                  />
                </div>
              </div>
              <div className='flex-grow pt-7' style={{ flexBasis: '35%' }}>
                <Controller
                  name='weightTypeId'
                  control={control}
                  defaultValue={2}
                  render={({ field }) => (
                    <NewProductDropdown
                      label={t('select')}
                      submenu={filterOptions?.weightTypes as DropdownItem<Number>[]}
                      onChange={selectedValue => field.onChange(selectedValue)}
                      selectedValue={field.value}
                      customBorderColor='#B1B5BB'
                      isDisabled={!isBarcodeScanned}
                    />
                  )}
                />
              </div>
            </div>
            <div className='space-between relative flex-1 '>
              <div className='relative w-full items-center justify-between mt-1'>
                <label htmlFor='name' className='flex  mb-1 items-center disabled:opacity-75'>
                  {t('package_type')}
                </label>
                <Controller
                  name='packageTypeId'
                  control={control}
                  render={({ field }) => (
                    <NewProductDropdown
                      submenu={filterOptions?.packageTypes as DropdownItem<Number>[]}
                      onChange={selectedValue => field.onChange(selectedValue)}
                      selectedValue={field.value}
                      srOnly={false}
                      isDisabled={!isBarcodeScanned}
                    />
                  )}
                />
              </div>
            </div>
            <div className='space-between relative flex-1'>
              <div className='relative w-full items-center justify-between mt-1'>
                <label htmlFor='name' className='flex mb-1 items-center disabled:opacity-75'>
                  {t('package_unit')}
                </label>
                <Controller
                  name='packageUnit'
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label={t('package_unit')}
                      className='!gap-0 disabled:opacity-75'
                      name={name}
                      type='number'
                      value={value}
                      onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      disabled={!isBarcodeScanned}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className='border-b-2 mt-2'></div>
          <div className='space-between flex items-end gap-2 p-1 '>
            <div className='flex-grow ' style={{ flexBasis: '45%' }}>
              <div className='relative w-full items-center justify-between'>
                <label htmlFor='name' className='flex mb-1 items-center disabled:opacity-75'>
                  {t('category') + ' 1'}
                </label>
                <Controller
                  name='cat1'
                  control={control}
                  render={({ field }) => (
                    <CategorySelect
                      isDisabled={!isBarcodeScanned}
                      className={''}
                      required={true}
                      value={field.value}
                      name='cat1'
                      externalParams={categoryQueryParams}
                      onChange={handleCategoryFilterChange}
                      label={''}
                    />
                  )}
                />
              </div>
            </div>
            <div className='flex-grow ' style={{ flexBasis: '45%' }}>
              <div className='relative w-full items-center justify-between mt-1'>
                <label htmlFor='name' className='flex items-center mb-1 disabled:opacity-75'>
                  {t('category') + ' 2'}
                </label>
                <Controller
                  name='cat2'
                  control={control}
                  render={({ field }) => (
                    <CategorySelect
                      isDisabled={!isBarcodeScanned}
                      className={''}
                      required={true}
                      value={field.value}
                      name='cat2'
                      externalParams={categoryQueryParams}
                      onChange={handleCategoryFilterChange}
                      label={''}
                    />
                  )}
                />
              </div>
            </div>
            <div className='flex-grow ' style={{ flexBasis: '45%' }}>
              <div className='relative w-full items-center justify-between'>
                <label htmlFor='name' className='flex items-center mb-1 disabled:opacity-75'>
                  {t('category') + ' 3'}
                </label>
                <Controller
                  name='cat3'
                  control={control}
                  render={({ field }) => (
                    <CategorySelect
                      isDisabled={!isBarcodeScanned}
                      className={''}
                      required={true}
                      value={field.value}
                      name='cat3'
                      externalParams={categoryQueryParams}
                      onChange={handleCategoryFilterChange}
                      label={''}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default CreateProductModal
