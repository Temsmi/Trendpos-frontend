type ApiResponse = {
  text?: string
  errorText?: string
}

const healthCheck = async (): Promise<ApiResponse | null> => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'health-check')
    if (!response.ok) {
      return { errorText: 'Network response was not ok' }
    }
    const textResponse = await response.text()
    return { text: textResponse }
  } catch (error) {
    if (error instanceof Error) {
      return { errorText: error.message }
    }
    return { errorText: 'Unknown error' }
  }
}

export default healthCheck
