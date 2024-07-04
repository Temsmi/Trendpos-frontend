import fetchClient from '@/lib/fetch-client'
import { RootState } from '@/lib/store'
import { PageData } from '@/lib/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface FastSalesState {
  pages: PageData[]
  currentPage: number
  loading: boolean
  error: string | null
  fetchedPages: any[] // API'den çekilen verileri saklamak için yeni alan
}

const initialState: FastSalesState = {
  pages: [],
  currentPage: 1,
  loading: false,
  error: null,
  fetchedPages: [] // Başlangıçta boş bir dizi
}


export const addPage = createAsyncThunk(
  'fastSales/addPage',
  async (page: { name: string; barcode: string; branchId: number }, thunkAPI) => {
    try {
      const response = await fetchClient('/quicksale/header', {
        method: 'POST',
        data: page
      })

      if (!response.ok) {
        throw new Error('Failed to create page')
      }
      
      const data = await response.json()

      return { success: true, message: data.message, data }
    } catch (error) {
      let errorMessage = 'Failed to add barcode'
      if (error instanceof Response) {
        const errorData = await error.json()
        errorMessage = errorData.message || errorMessage
      }
      return thunkAPI.rejectWithValue({ success: false, message: errorMessage })
    }
  }
)
export const changePageName = createAsyncThunk(
  'fastSales/changePageName',
  async (page: { id: number; name: string;  }, thunkAPI) => {
    try {
      const response = await fetchClient(`/quicksale/header`, {
        method: 'PUT',
        data: page
      })
      if (!response.ok) {
        throw new Error('Failed to update page name')
      }
      const data = await response.json()
      return { success: true, message: data.message, data }
    } catch (error) {
      let errorMessage = 'Failed to add barcode'
      if (error instanceof Response) {
        const errorData = await error.json()
        errorMessage = errorData.message || errorMessage
      }
      return thunkAPI.rejectWithValue({ success: false, message: errorMessage })
    }
  }
)
export const deletePage = createAsyncThunk(
  'quickales/deletePage',
  async (page: { barcode: string; quickSaleHeaderId: number }, thunkAPI) => {
    try {
      const response = await fetchClient(`/quicksale/header/${page.quickSaleHeaderId}`, {
        method: 'DELETE',
        data: page
      })
      if (!response.ok) {
        throw new Error('Failed to update page name')
      }
      const data = await response.json()
      return { success: true, message: data.message, data }
    } catch (error) {
      let errorMessage = 'Failed to add barcode'
      if (error instanceof Response) {
        const errorData = await error.json()
        errorMessage = errorData.message || errorMessage
      }
      return thunkAPI.rejectWithValue({ success: false, message: errorMessage })
    }
  }
)
export const addBarcode = createAsyncThunk(
  'fastSales/addBarcode',
  async (
    barcodes: { barcode:string;  quickSaleHeaderId: number; quickSaleHeaderName: string },
    thunkAPI
  ) => {
    try {
      const response = await fetchClient('/quicksale/product', {
        method: 'POST',
        data: barcodes
      })
      if (!response.ok) {
        throw new Error('Failed to create page')
      }
      const data = await response.json()
      return { success: true, message: data.message, data }
    } catch (error) {
      let errorMessage = 'Failed to add barcode'
      if (error instanceof Response) {
        const errorData = await error.json()
        errorMessage = errorData.message || errorMessage
      }
      return thunkAPI.rejectWithValue({ success: false, message: errorMessage })
    }
  }
)

export const deleteBarcode = createAsyncThunk(
  'quickales/deleteBarkod',
  async (page: { barcode: string; quickSaleHeaderId: number }, thunkAPI) => {
    try {
      const response = await fetchClient(`/quicksale/product?&barcode=${page.barcode}`, {
        method: 'DELETE',
        data: page
      })
      if (!response.ok) {
        throw new Error('Failed to update page name')
      }
      const data = await response.json()
      return { success: true, message: data.message, data }
    } catch (error) {
      let errorMessage = 'Failed to add barcode'
      if (error instanceof Response) {
        const errorData = await error.json()
        errorMessage = errorData.message || errorMessage
      }
      return thunkAPI.rejectWithValue({ success: false, message: errorMessage })
    }
  }
)

export const fastSalesSlice = createSlice({
  name: 'fastSales',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
  }
})

export const selectPageData = (state: RootState) => state.fastSalesSlice.currentPage

export default fastSalesSlice.reducer
