import currency from '@/services/currency-service'
import { Data } from '@/services/currency-service'
import React from 'react'
import { BiSolidUpArrow, BiSolidDownArrow, BiTrendingUp, BiArrowToRight } from 'react-icons/bi'

const getData = async () => {
  try {
    const response = await currency()
    return response
  } catch (error) {
    console.error('Error fetching currency data:', error)
  }
}

async function CurrencyLine() {
  const currencyData = await getData()
  return (
    <div className='flex h-16 w-full items-center justify-between gap-8 bg-[#f6f6f6] px-16 text-sm text-[#474747]'>
      <ul className='flex h-full w-full scroll-m-1 items-center gap-16 overflow-auto scrollbar-thin'>
        {currencyData?.data?.map((item: Data) => (
          <li key={item.fromCurrency + item.toCurrency} className='flex items-center justify-center gap-2.5'>
            <div className='flex items-center gap-1'>
              {item.exchangeRate > 0 ? (
                <BiSolidUpArrow className='text-[#77B93B]' />
              ) : item.exchangeRate < 0 ? (
                <BiSolidDownArrow className='text-red-500' />
              ) : (
                <BiArrowToRight className='text-gray-500' />
              )}

              <span className='whitespace-nowrap font-medium uppercase'>{item.fromCurrency} - {item.toCurrency}</span>
            </div>
            <div className='flex items-center gap-1'>
              <span className='font-medium uppercase'>{item.value.toFixed(2)}</span>
              {item.exchangeRate > 0 ? (
                <span className='font-medium uppercase text-[#77B93B]'>%{item.exchangeRate}</span>
              ) : item.exchangeRate < 0 ? (
                <span className='font-medium uppercase text-[#FF1000]'>%{item.exchangeRate}</span>
              ) : (
                <span className='font-medium uppercase text-[#999999]'>%{item.exchangeRate}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className='flex items-center gap-2'>
        <span className='flex h-10 w-10 items-center justify-center rounded-full border border-[#474747]/50'>
          <BiTrendingUp className='text-2xl text-[#474747]' />
        </span>
      </div>
    </div>
  )
}

export default CurrencyLine
