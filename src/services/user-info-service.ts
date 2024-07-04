import fetchServer from '@/lib/fetch-server'
import { UserInfoType } from '@/lib/types'

type ApiResponse = {
  success: boolean
  message: string
  data: UserInfoType | null
}

const userInfoService = async (): Promise<ApiResponse> => {
  try {
    const response = await fetchServer('/auth/user-info')
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

export default userInfoService
