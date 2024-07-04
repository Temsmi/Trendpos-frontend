import fetchServer from '@/lib/fetch-server'

type ApiResponse = {
  errorText?: string
  data: Data[] | null
}

export type Data = {
  fromCurrency: string
  toCurrency: string
  value: number
  exchangeRate: number
}

const currency = async (): Promise<ApiResponse | null> => {
  try {
    const response = await fetchServer('/dashboard/google-currency')
    if (response.ok) {
      const data = await response.json()
      return data
    }
    return { errorText: 'Network response was not ok', data: null }
  } catch (error) {
    if (error instanceof Error) {
      return { errorText: error.message, data: null }
    }
    return { errorText: 'Unknown error', data: null }
  }
}

export default currency
