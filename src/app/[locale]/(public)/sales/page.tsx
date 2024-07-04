import CalculatePrice from '@/components/calculate-price'
import Cashback from '@/components/cashback'
import CustomerTabMenu from '@/components/customer-tab-menu'
import BarcodeInput from '@/components/input/barcode-input'
import PaymentOptions from '@/components/button/payment'
import ShortcutsButton from '@/components/button/sales-shortcuts'
import fetchServer from '@/lib/fetch-server'
import { getTranslations } from 'next-intl/server'
import ResetCustomer from '@/components/button/reset-customer'
import FastSalesComponent from '@/components/fastSale'

const Sales = async () => {
  const filterOptionsResponse = await fetchServer('/sales/filter-options')
  const filterOptions = await filterOptionsResponse.json()
  const t = await getTranslations('sales')

  return (
      <div className='mx-auto flex h-fit w-full max-w-[1400px] rounded-3xl bg-white px-4 shadow-sm max-xl:grid max-xl:grid-cols-12'>
        <div className='relative flex w-full flex-col border-r border-[#F1F1F1] py-4 pr-2 max-xl:col-span-6'>
          <div className='relative flex w-full flex-col py-4 pr-2 max-xl:col-span-6'>
            <BarcodeInput name='barcode' label={t('scan_product_barcode')} placeholder={t('product_barcode')} />
            <CustomerTabMenu className='mt-12' />
            <ResetCustomer />
          </div>
          <div className='flex w-full h-full'>
            <div className='flex w-full items-end gap-4'>
              <FastSalesComponent />
            </div>
          </div>
        </div>
        <div className='flex w-full max-w-[475px] flex-col py-4 pl-2 max-xl:col-span-6'>
          <CalculatePrice />
          <hr className='my-5 h-px w-full bg-[#F1F1F1] xl:mb-4 xl:mt-8' />
          <Cashback currencies={filterOptions.data.currencies} />
          <hr className='my-5 h-px w-full bg-[#F1F1F1] xl:my-8' />
          <PaymentOptions paymentTypes={filterOptions.data.paymentTypes} />
          <hr className='my-5 h-px w-full bg-[#F1F1F1] xl:my-8' />
          <ShortcutsButton />
        </div>
      </div>
  )
}

export default Sales
