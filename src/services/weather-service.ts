import fetchServer from '@/lib/fetch-server'
import { NotificationType, WeatherType } from '@/lib/types'

type ApiResponse = {
  success: boolean
  message: string
  data: WeatherType | null
}

type notificationServiceProps = {
  longitude: string
  latitude: string
}

const weatherService = async ({ longitude, latitude }: notificationServiceProps): Promise<ApiResponse | null> => {
  try {
    const response = await fetchServer(`/dashboard/weather?${longitude}&${latitude}`)
    if (response.ok) {
      const data = await response.json()
      return data
    }
    return { success: false, message: 'Network response was not ok', data: null }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message, data: null }
    }
    return { success: false, message: 'Unknown error', data: null }
  }
}

export default weatherService
