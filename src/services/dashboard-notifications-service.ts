import fetchServer from '@/lib/fetch-server'
import { NotificationType } from '@/lib/types'

type ApiResponse = {
  success: boolean
  message: string
  data: NotificationType[]
}

type notificationServiceProps = {
  notificationSource: string
}

const notificationService = async ({ notificationSource }: notificationServiceProps): Promise<ApiResponse | null> => {
  try {
    const response = await fetchServer(`/dashboard/notifications?source=${notificationSource}`)
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

export default notificationService
