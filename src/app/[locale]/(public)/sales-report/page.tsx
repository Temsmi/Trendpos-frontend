'use client'

import SalesPagination from '@/components/pagination'
import { ReportTable } from '@/components/report-table'
import { createColumnHelper } from '@tanstack/react-table'
import { ReportSummary, PaymentSummary } from '@/components/report-summary'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { CategorySelect } from '@/components/category-select'
import Input from '@/components/input/input'
import { PersonnelSelect } from '@/components/personnel-select-sales-report'
import fetchClient from '@/lib/fetch-client'
import { useTranslations } from 'next-intl'

type Sale = {
  transactionId: number
  barcode: string
  name: string
  quantity: number
  weightType: string
  cat1: string
  cat2: string
  cat3: string | null
  saleDate: Date
  unitPrice: number
  buyingPrice: number
  totalAmount: number
  profit: number
  paymentType: string
  currency: string
}

type SaleSummary = {
  totalQuantity: number
  totalSales: number
  totalAmount: number
  totalProfit: number
  totalCashSales: number
  totalCashAmount: number
  totalCardSales: number
  totalCardAmount: number
  totalQuantityOfScale: number
}

interface CategoryQueryParamsType {
  languageId: string
  cat1: string
  cat2: string
  cat3: string
}

interface Personnel {
  userId: string | null
  firstName: string | null
}

const columnHelper = createColumnHelper<Sale>()

const columnTypes = [
  'numeric', // transactionId
  'string', // barcode
  'string', // name
  'numeric', // quantity
  'string', // weightType
  'string', // cat1
  'string', // cat2
  'string', // cat3
  'string', // saleDate
  'numeric', // unitPrice
  'numeric', // buyingPrice
  'string', // currency
  'string', // paymentType
  'numeric', // totalAmount
  'numeric' // profit
]

const SalesReport = ({ params }: { params: { slug: string; branchId: number } }) => {
  const t = useTranslations('sales-report')
  const columns = [
    columnHelper.accessor('transactionId', {
      header: t('transactionId')
    }),
    columnHelper.accessor('barcode', {
      header: t('barcode')
    }),
    columnHelper.accessor('name', {
      header: t('name')
    }),
    columnHelper.accessor('quantity', {
      header: t('quantity')
    }),
    columnHelper.accessor('weightType', {
      header: t('weightType')
    }),
    columnHelper.accessor('cat1', {
      header: t('cat1')
    }),
    columnHelper.accessor('cat2', {
      header: t('cat2')
    }),
    columnHelper.accessor('cat3', {
      header: t('cat3')
    }),
    columnHelper.accessor('saleDate', {
      header: t('saleDate')
    }),
    columnHelper.accessor('unitPrice', {
      header: t('unitPrice')
    }),
    columnHelper.accessor('buyingPrice', {
      header: t('buyingPrice')
    }),
    columnHelper.accessor('currency', {
      header: t('currency')
    }),
    columnHelper.accessor('paymentType', {
      header: t('paymentType')
    }),
    columnHelper.accessor('totalAmount', {
      header: t('totalAmount')
    }),
    columnHelper.accessor('profit', {
      header: t('profit')
    })
  ]
  const { handleSubmit, register } = useForm()
  const [sales, setSales] = useState<Sale[]>([])
  const [user, setUser] = useState<any>(null)
  const [summary, setSummary] = useState<SaleSummary>({
    totalAmount: 0,
    totalProfit: 0,
    totalQuantity: 0,
    totalSales: 0,
    totalCardAmount: 0,
    totalCardSales: 0,
    totalCashAmount: 0,
    totalCashSales: 0,
    totalQuantityOfScale: 0
  })
  const [numberOfPages, setNumberOfPages] = useState<number>(1)
  const [startDate, setStartDate] = useState<string>(new Date().toISOString())
  const [endDate, setEndDate] = useState<string>(new Date().toISOString())
  const [cat1, setCat1] = useState<string>(t('all'))
  const [cat2, setCat2] = useState<string>(t('all'))
  const [cat3, setCat3] = useState<string>(t('all'))
  const [brand, setBrand] = useState<string | undefined>()
  const [subBrand, setSubBrand] = useState<string | undefined>()
  const [productName, setProductName] = useState<string | undefined>()
  const [createdUser, setCreatedUser] = useState<Personnel | undefined>({
    userId: "all",
    firstName: "All"
  })
  const [page, setPage] = useState<number>(1)
  const [categoryQueryParams, setCategoryQueryParams] = useState<CategoryQueryParamsType>({
    languageId: 'TR', // Initial languageId value
    cat1: cat1,
    cat2: cat2,
    cat3: cat3
  })
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetchClient('/auth/user-info')
        const userData = await userResponse.json()

        setUser(userData.data)

        // Set default start and end dates here
        const defaultStartDate = new Date()
        defaultStartDate.setDate(defaultStartDate.getDate() - 7) // 7 days ago
        const defaultEndDate = new Date()
        setStartDate(defaultStartDate.toISOString())
        setEndDate(defaultEndDate.toISOString())
      } catch (error) {
        console.error('Error fetching user information:', error)
      }
    }
    fetchUser()
  }, [])
  const onSubmit = async (data: any) => {
    const setPage = await handlePageChange(1)
  }

  const handlePageChange = async (pageNumber: number) => {
    try {
      const formattedStartDate = new Date(startDate).toISOString()
      let formattedEndDate = new Date(new Date(endDate).setHours(23, 59, 0, 0)).toISOString()
      let url = `/sales/report?startDate=${formattedStartDate}&endDate=${formattedEndDate}&page=${pageNumber}`

      // Conditionally add cat1, cat2, cat3, brand, subBrand, productName, and createdUser to the URL
      if (categoryQueryParams?.cat1) {
        if (categoryQueryParams?.cat1 == t('all')){
          url += `&cat1=all`
        }
        else{
          url += `&cat1=${categoryQueryParams.cat1}`
        }
      }
      if (categoryQueryParams?.cat2) {
        if (categoryQueryParams?.cat2 == t('all')){
          url += `&cat2=all`
        }
        else{
          url += `&cat2=${categoryQueryParams.cat2}`
        }
      }
      if (categoryQueryParams?.cat3) {
        if (categoryQueryParams?.cat3 == t('all')){
          url += `&cat3=all`
        }
        else{
          url += `&cat3=${categoryQueryParams.cat3}`
        }
      }
      if (brand) {
        url += `&brand=${brand}`
      }
      if (subBrand) {
        url += `&subBrand=${subBrand}`
      }
      if (productName) {
        url += `&productName=${productName}`
      }
      if (createdUser && createdUser.userId != "all") {
        url += `&createdUser=${createdUser.userId}`
      }
      const res = await fetchClient(url)
      if (!res.ok) {
        throw new Error('Failed to fetch sales data')
      }
      const resJson = await res.json()
      const {
        sales,
        totalAmount,
        totalProfit,
        totalQuantity,
        totalSales,
        numberOfPages,
        totalCashSales,
        totalCashAmount,
        totalCardSales,
        totalCardAmount,
        totalQuantityOfScale
      } = resJson?.data || {}
      setSales(sales || [])
      setSummary({
        totalAmount,
        totalProfit,
        totalQuantity,
        totalSales,
        totalCashSales,
        totalCashAmount,
        totalCardSales,
        totalCardAmount,
        totalQuantityOfScale
      })
      setNumberOfPages(numberOfPages || 1)
      setStartDate(startDate)
      setEndDate(endDate)
      setCat1(categoryQueryParams.cat1)
      setCat2(categoryQueryParams.cat2)
      setCat3(categoryQueryParams.cat3)
      setBrand(brand)
      setSubBrand(subBrand)
      setProductName(productName)
      setCreatedUser(createdUser)
      setPage(pageNumber)
    } catch (error) {
      // Handle any errors that occur during the data fetching process
      console.error('Error fetching sales data:', error)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'startDate') {
      setStartDate(value)
    } else if (name === 'endDate') {
      setEndDate(value)
    }
  }

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
    setCreatedUser(value)
  }

  const handleCategoryChange = (name: string, value: any | { value: string}) => {
    const selectedValue = value ? value.value : undefined

    if (name === 'cat1') {
      setCategoryQueryParams(prevParams => ({
        ...prevParams,
        cat1: selectedValue,
        cat2: t('all'),
        cat3: t('all')
      }))
    } else if (name === 'cat2') {
      setCategoryQueryParams(prevParams => ({
        ...prevParams,
        cat2: selectedValue,
        cat3: t('all')
      }))
    } else {
      setCategoryQueryParams(prevParams => ({
        ...prevParams,
        [name]: selectedValue
      }))
    }
  }

  return (
    <div className=' container mx-auto mb-12 mt-1'>
      <div className='w-full max-w-[1531px] rounded-3xl bg-white'>
        {/* <SalesFilter
          startDate={formatDate(startDate, true)}
          endDate={formatDate(endDate, true)}
          companyId={user.data.companyId}
          cat1={cat1}
          cat2={cat2}
          cat3={cat3}
          brand={brand}
          subBrand={subBrand}
          productName={productName}
        /> */}
        <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-12 gap-3 p-5'>
          <div className='col-span-12 flex gap-3 overflow-auto'>
            <div className='col-span-4'>
              <label style={{ fontSize: 14, color: 'gray', marginLeft: 5 }}> {t('starting_date')}</label>
              <input
                type='date'
                value={startDate}
                name='startDate'
                onChange={handleDateChange}
                className='w-full rounded-xl border border-zinc-100 bg-[#F1F1F1] p-3 text-sm font-medium outline-0 placeholder:text-neutral-400'
                onClick={e => e.currentTarget.showPicker()}
              />
            </div>
            <div className='col-span-4'>
              <label style={{ fontSize: 14, color: 'gray', marginLeft: 5 }}>{t('end_date')}</label>
              <input
                type='date'
                value={endDate}
                name='endDate'
                onChange={handleDateChange}
                className='w-full rounded-xl border border-zinc-100 bg-[#F1F1F1] p-3 text-sm font-medium outline-0 placeholder:text-neutral-400'
                onClick={e => e.currentTarget.showPicker()}
              />
            </div>
            <div className='w-full m-1'>
              <CategorySelect
                className='w-full'
                required={false}
                value={categoryQueryParams.cat1 ? categoryQueryParams.cat1 : undefined} // Use cat1 directly, ensuring it's a string or an empty string if undefined
                name='cat1'
                externalParams={categoryQueryParams}
                onChange={value => handleCategoryChange('cat1', value)}
                label={t('cat1')}
              />
            </div>
            <div className='w-full m-1'>
              <CategorySelect
                required={false}
                value={categoryQueryParams.cat2 ? categoryQueryParams.cat2 : undefined} // Use cat2 directly, ensuring it's a string or an empty string if undefined
                name='cat2'
                externalParams={categoryQueryParams}
                onChange={value => handleCategoryChange('cat2', value)}
                label={t('cat2')}
              />
            </div>
            <div className='w-full m-1'>
              <CategorySelect
                required={false}
                value={categoryQueryParams.cat3 ? categoryQueryParams.cat3 : undefined} // Use cat3 directly, ensuring it's a string or an empty string if undefined
                name='cat3'
                externalParams={categoryQueryParams}
                onChange={value => handleCategoryChange('cat3', value)}
                label={t('cat3')}
              />
            </div>
          </div>
          <div className='col-span-12 flex gap-3 overflow-auto'>
            <div className='w-full m-1'>
              <Input
                name='productName'
                label={t('product_name')}
                value={productName}
                onChange={handleProductNameChange}
                required={false}
                srOnly={false}
              />
            </div>
            <div className='w-full m-1'>
              <Input
                name='brand'
                label={t('brand')}
                value={brand}
                onChange={handleBrandChange}
                required={false}
                srOnly={false}
              />
            </div>
            <div className='w-full m-1'>
              <Input
                name='subBrand'
                label={t('sub-brand')}
                value={subBrand}
                onChange={handleSubBrandChange}
                required={false}
                srOnly={false}
              />
            </div>
            <div className='w-full m-1'>
              <PersonnelSelect
                label={t('select-user')}
                companyId={user?.companyId}
                value={createdUser}
                onChange={handlePersonnelChange}
                required={false}
              />
            </div>
            <div className='w-full mt-6'>
              <button
                className='font-400 h-[100%] w-full rounded-lg bg-white p-4 py-2 text-[14px] font-bold text-black'
                style={{ border: '1px solid #e6e5e3' }}
                type='submit'>
                {t('report_list')}
              </button>
            </div>
          </div>
        </form>
        <hr className='block h-[1px] w-full bg-[#E5E5E5]' />
        <div className='h-[500px] overflow-auto px-4 py-4'>
          <ReportTable data={sales} columns={columns} columnTypes={columnTypes} rowCount={20} />
        </div>
        <div>
          <div className='grid grid-cols-3 gap-4'>
            <ReportSummary title={t('total_sales')} value={summary.totalSales} />
            <ReportSummary title={t('total_amount')} value={summary.totalAmount} />
            <PaymentSummary
              title={t('total_cash_sales')}
              quantity={summary.totalCashSales}
              amount={summary.totalCashAmount}
            />
            <ReportSummary title={t('total_quantity')} value={summary.totalQuantity} />
            <ReportSummary title={t('total_quantity_scale')} value={summary.totalQuantityOfScale} />
            <PaymentSummary
              title={t('total_card_sales')}
              quantity={summary.totalCardSales}
              amount={summary.totalCardAmount}
            />
            <ReportSummary title={t('total_profit')} value={summary.totalProfit} />
          </div>
        </div>
        {summary.totalSales > 0 && (
          <SalesPagination currentPage={page} totalPages={numberOfPages} onPageChange={handlePageChange} />
        )}
        <br></br>
      </div>
    </div>
  )
}

export default SalesReport
