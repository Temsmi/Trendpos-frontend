import React from 'react'

type ReportSummaryProps = {
  title: string
  value: number | undefined
}

const ReportSummary = ({ title, value }: ReportSummaryProps) => {
  return (
    <div className='flex items-center border-b border-gray-200 py-2'>
      <span className='font-semibold mx-3'>{title}</span>
      <span>{value ? value.valueOf() : 0}</span>
    </div>
  )
}


type PaymentSummaryProps = {
  title: string
  amount: number | undefined
  quantity: number | undefined
}

const PaymentSummary = ({ title, amount, quantity }: PaymentSummaryProps) => {
  return (
    <div className='flex items-center border-b border-gray-200 py-2'>
      <span className='font-semibold mx-3'>{title}</span>
      <span>{quantity ? quantity : 0} / {amount ? amount : 0}</span>
    </div>
  )
}

export { ReportSummary, PaymentSummary }