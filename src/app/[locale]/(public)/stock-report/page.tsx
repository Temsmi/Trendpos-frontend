'use client'

import StockPagination from '@/components/pagination'
import { ReportTable } from '@/components/report-table'
import { createColumnHelper } from '@tanstack/react-table'
import { ReportSummary } from '@/components/report-summary'
import { useEffect, useState } from 'react'
import fetchClient from '@/lib/fetch-client'
import { useTranslations } from 'next-intl'
import Input from '@/components/input/input'

type Stock = {
  barcode: string
  productName: string
  cat1: string
  cat2: string
  cat3: string
  firm: string
  brand: string
  subBrand: string
  stock: number
  buyingPrice: number
  sellingPrice: number
  tax: number
  unit: number
}

type StockSummary = {
  totalQuantity: number
  stockQuantity: number
  totalSellingPrice: number
  totalBuyingPrice: number
}

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
const columnTypes = [
  'string', //barcode
  'string', //productName
  'string', //cat1
  'string', //cat2
  'string', //cat3
  'string', //firm
  'string', //brand
  'string', // subbrand
  'string', //cat1
  'string', // cat2
  'string', //cat3
  'string', //firm
  'string', //brand
  'string', // subbrand
  'numeric', // stock
  'numeric', // buyingPrice
  'numeric', // sellingPrice
  'numeric', // tax
  'numeric' // unit
]

const StockReport = ({ params }: { params: { slug: string; branchId: number } }) => {
  const [stock, setStock] = useState<Stock[]>([])
  const [summary, setSummary] = useState<StockSummary>({
    stockQuantity: 0,
    totalBuyingPrice: 0,
    totalQuantity: 0,
    totalSellingPrice: 0
  })
  const [numberOfPages, setNumberOfPages] = useState<number>(1)
  const [page, setPage] = useState<number>(1)
  const t = useTranslations('stock-report')
  const columnHelper = createColumnHelper<Stock>()
  const columns = [
    columnHelper.accessor('barcode', {
      header: t('barcode')
    }),
    columnHelper.accessor('productName', {
      header: t('product_name')
    }),
    columnHelper.accessor('cat1', {
      header: t('category') + ' ' + 1
    }),
    columnHelper.accessor('cat2', {
      header: t('category') + ' ' + 2
    }),
    columnHelper.accessor('cat3', {
      header: t('category') + ' ' + 3
    }),
    columnHelper.accessor('firm', {
      header: t('firm')
    }),
    columnHelper.accessor('brand', {
      header: t('brand')
    }),
    columnHelper.accessor('subBrand', {
      header: t('subBrand')
    }),
    columnHelper.accessor('stock', {
      header: t('stock')
    }),
    columnHelper.accessor('buyingPrice', {
      header: t('buyingPrice')
    }),
    columnHelper.accessor('sellingPrice', {
      header: t('sellingPrice')
    }),
    columnHelper.accessor('tax', {
      header: t('tax')
    }),
    columnHelper.accessor('unit', {
      header: t('unit')
    })
  ]

  const [firm, setFirm] = useState<string>()
  const [brand, setBrand] = useState<string>()
  const [productName, setProductName] = useState<string>('') // Varsayılan değer olarak boş bir dize kullanılabilir
  const [barcode, setBarcode] = useState<string>()
  const [cat1, setCat1] = useState<string>()
  const [cat2, setCat2] = useState<string>()
  const [cat3, setCat3] = useState<string>()
  useEffect(() => {
    handlePageChange(1)
  }, [])

  const handlePageChange = async (pageNumber: number) => {
    try {
      let url = `/branch-catalog/stock?page=${pageNumber}`
      if (cat1) {
        url += `&cat1=${cat1}`
      }
      if (cat2) {
        url += `&cat2=${cat2}`
      }
      if (cat3) {
        url += `&cat3=${cat3}`
      }
      if (barcode) {
        url += `&barcode=${barcode}`
      }
      if (firm) {
        url += `&firm=${firm}`
      }
      if (brand) {
        url += `&brand=${brand}`
      }
      if (productName) {
        url += `&productName=${productName}`
      }
      const res = await fetchClient(url)
      if (!res.ok) {
        throw new Error('Failed to fetch stock data')
      }
      const resJson = await res.json()
      const { stock, totalBuyingPrice, totalQuantity, totalSellingPrice, stockQuantity, numberOfPages } =
        resJson?.data || {}
      setStock(stock || [])
      setSummary({ stockQuantity, totalBuyingPrice, totalQuantity, totalSellingPrice })
      setNumberOfPages(numberOfPages || 1)
      setPage(pageNumber)
    } catch (error) {
      console.error('Error fetching stock data:', error)
    }
  }
  return (
    <div className=' container mx-auto mb-12 mt-1'>
      <div className='w-full max-w-[1531px] rounded-3xl bg-white'>
        <div>
          <div className='flex flex-wrap gap-4 py-2 px-4'>
            <div className='flex flex-grow mt-1 gap-4'>
              <Input
                name='productName'
                label={t('product_name')}
                value={productName}
                onChange={e => setProductName(e.target.value)}
                required={false}
                srOnly={false}
              />
              <Input
                name={'Barcode'}
                label={t('barcode')}
                srOnly={false}
                value={barcode != undefined ? barcode.toString() : ''}
                onChange={e => setBarcode(e.target.value)}
              />
            </div>
            <div className='flex flex-grow mt-2 gap-4'>
              <Input
                name={'firm'}
                label={t('firm')}
                srOnly={false}
                value={firm}
                onChange={e => setFirm(e.target.value)}
              />
              <Input
                name={'brand'}
                label={t('brand')}
                srOnly={false}
                value={brand}
                onChange={e => setBrand(e.target.value)}
              />
            </div>
          </div>
          <div className='flex flex-wrap gap-4  px-4'>
            <div className='flex flex-grow mt-2 gap-4'>
              <Input
                name='cat1'
                label={t('category') + ' ' + 1}
                value={cat1}
                onChange={e => setCat1(e.target.value)}
                required={false}
                srOnly={false}
              />
              <Input
                name={'cat2'}
                label={t('category') + ' ' + 2}
                srOnly={false}
                value={cat2}
                onChange={e => setCat2(e.target.value)}
              />
              <Input
                name={'cat3'}
                label={t('category') + ' ' + 3}
                srOnly={false}
                value={cat3}
                onChange={e => setCat3(e.target.value)}
              />
            </div>
            <div className='flex-grow mt-8'>
              <button
                className='font-400 h-[100%] w-full rounded-lg bg-white p-4 py-2 text-[14px] font-bold text-black'
                style={{ border: '1px solid #e6e5e3' }}
                onClick={() => handlePageChange(page)}
                type='submit'>
                {t('report_list')}
              </button>
            </div>
          </div>
        </div>
        <div className='h-[500px] overflow-auto px-4 py-4'>
          <ReportTable data={stock} columns={columns} columnTypes={columnTypes} rowCount={20} />
        </div>
        <div>
          <div className='grid grid-cols-2 gap-4'>
            <ReportSummary title={t('totalQuantity')} value={summary.totalQuantity} />
            <ReportSummary title={t('stockQuantity')} value={summary.stockQuantity} />
            <ReportSummary title={t('totalBuyingPrice')} value={summary.totalBuyingPrice} />
            <ReportSummary title={t('totalSellingPrice')} value={summary.totalSellingPrice} />
          </div>
        </div>
        {summary.totalQuantity > 0 && (
          <StockPagination currentPage={page} totalPages={numberOfPages} onPageChange={handlePageChange} />
        )}
        <br></br>
      </div>
    </div>
  )
}

export default StockReport
