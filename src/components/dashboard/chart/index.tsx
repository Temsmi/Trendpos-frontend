'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChartSalesDataType } from '@/lib/types'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

type ChartProps = {
  title: string | undefined
  description: string | undefined
  totalSales: string | undefined
  chartData: ChartSalesDataType[] | undefined | null
  weeks: string[] | undefined
}

const Chart: React.FC<ChartProps> = ({ title, description, totalSales, chartData, weeks }) => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  const chartOptions = {
    chart: {
      id: 'basic-bar'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        endingShape: 'flat',
        distributed: false
      }
    },
    legend: {
      horizontalAlign: 'left' as const
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: weeks || []
    }
  }

  return (
    <div className='h-full w-full rounded-xl bg-white shadow-[0px_2px_10px_5px_rgba(169,169,169,0.22)]'>
      <div className='flex items-center gap-4 p-4'>
        <h2 className='text-md font-semibold'>{title}</h2>
        <h1 className='text-2xl font-semibold'>{totalSales}₺</h1>
        <p className='text-sm text-[#4F4F4F]'>{description}</p>
      </div>
      <hr />
      <div className='p-4'>
        {isClient && chartData && (
          <ApexChart series={chartData} options={chartOptions} type='bar' width='100%' height='280px' />
        )}
      </div>
    </div>
  )
}

export default Chart
