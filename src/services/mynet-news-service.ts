import { MynetNewsType } from '@/lib/types'
import fetchServer from '@/lib/fetch-server'

type ApiResponse = {
  success: boolean
  message: string
  data: MynetNewsType[]
}

const mynetnewsService = async (): Promise<ApiResponse | null> => {
  try {
    const response = await fetchServer('/dashboard/mynetnews')
    if (response.ok) {
      const data = await response.json()
      return data
    }
    return { success: false, message: 'Network response was not ok', data: [] }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message, data: [] }
    }
    return { success: false, message: 'Unknown error', data: [] }
  }
}

export default mynetnewsService
