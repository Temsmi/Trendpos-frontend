import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ProductType } from '@/lib/types'
import fetchClient from '@/lib/fetch-client'
import useCustomToast from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'


export interface CustomerState {
  id: number
  currencyId: string
  cart: ProductType[]
  totalAmount: number
  totalQuantity: number
  paidAmount: number
  discountTotalAmount: number
}

interface PaymentInfo {
  paymentMethodId: number;
  cashAmount?: number;
  cardAmount?: number;
  creditAmount?: number;
}

export interface Customers {
  customers: CustomerState[]
  activeCustomerId: number
}

interface RootState {
  customers: {
    customers: CustomerState[]
    activeCustomerId: number
  }
}

const defaultInitialState: Customers = {
  customers: [
    {
      id: 0,
      currencyId: 'TRY',
      cart: [],
      totalAmount: 0,
      totalQuantity: 0,
      paidAmount: 0,
      discountTotalAmount: 0
    },
    {
      id: 1,
      currencyId: 'TRY',
      cart: [],
      totalAmount: 0,
      totalQuantity: 0,
      paidAmount: 0,
      discountTotalAmount: 0
    },
    {
      id: 2,
      currencyId: 'TRY',
      cart: [],
      totalAmount: 0,
      totalQuantity: 0,
      paidAmount: 0,
      discountTotalAmount: 0
    },
    {
      id: 3,
      currencyId: 'TRY',
      cart: [],
      totalAmount: 0,
      totalQuantity: 0,
      paidAmount: 0,
      discountTotalAmount: 0
    },
    {
      id: 4,
      currencyId: 'TRY',
      cart: [],
      totalAmount: 0,
      totalQuantity: 0,
      paidAmount: 0,
      discountTotalAmount: 0
    }
  ],
  activeCustomerId: 0
}
export const customersSlice = createSlice({
  name: 'customers',
  initialState: defaultInitialState,
  reducers: {
    addInitialStateFromLocalStorage: (state, action: PayloadAction<Customers>) => {
      state.customers = action.payload.customers
      state.activeCustomerId = action.payload.activeCustomerId
    },
    addProduct: (state, action: PayloadAction<ProductType>) => {
      state.customers.forEach(customer => {
        if (customer.id === state.activeCustomerId) {
          if (customer.cart.find(product => product.barcode === action.payload.barcode)) {
            customer.cart.forEach(product => {
              if (product.barcode === action.payload.barcode) {
                product.quantity += action.payload.weightType === 'TERAZİ' ? action.payload.quantity : 1
                customer.totalQuantity += action.payload.weightType === 'TERAZİ' ? action.payload.quantity : 1
                customer.totalAmount = Number(
                  (
                    customer.totalAmount +
                    action.payload.sellingPrice * (action.payload.weightType === 'TERAZİ' ? action.payload.quantity : 1)
                  ).toFixed(2)
                )
                localStorage.setItem('customers', JSON.stringify(state))
                return
              }
            })
            return
          }
          customer.cart.push(action.payload)
          customer.totalQuantity += action.payload.weightType === 'TERAZİ' ? action.payload.quantity : 1
          customer.totalAmount = Number(
            (
              customer.totalAmount +
              action.payload.sellingPrice * (action.payload.weightType === 'TERAZİ' ? action.payload.quantity : 1)
            ).toFixed(2)
          )
          localStorage.setItem('customers', JSON.stringify(state))
          return
        }
      })
    },
    changeProductName:(state, action: PayloadAction<{ productBarcode: string; name:string }>)=>{
      state.customers.forEach(customer => {
        if (customer.id === state.activeCustomerId) {
          customer.cart.forEach(product => {
            if (product.barcode === action.payload.productBarcode) {
              product.name= action.payload.name
              localStorage.setItem('customers', JSON.stringify(state))
              return
            }
          })
        }
      })
    },
    changeActiveCustomer: (state, action: PayloadAction<number>) => {
      state.activeCustomerId = action.payload
      localStorage.setItem('customers', JSON.stringify(state))
    },
    changeProductQuantity: (state, action: PayloadAction<{ productBarcode: string; quantity: number }>) => {
      state.customers.forEach(customer => {
        if (customer.id === state.activeCustomerId) {
          customer.cart.forEach(product => {
            if (product.barcode === action.payload.productBarcode) {
              const difference = action.payload.quantity - product.quantity
              product.quantity = action.payload.quantity
              customer.totalQuantity += difference
              customer.totalAmount = Number((customer.totalAmount + difference * product.sellingPrice).toFixed(2))
              localStorage.setItem('customers', JSON.stringify(state))
              return
            }
          })
        }
      })
    },
    changePaidAmount: (state, action: PayloadAction<number>) => {
      state.customers.forEach(customer => {
        if (customer.id === state.activeCustomerId) {
          customer.paidAmount = action.payload
          return
        }
      })
      localStorage.setItem('customers', JSON.stringify(state))
    },
    changeCurrency: (state, action: PayloadAction<string>) => {
      state.customers.forEach(customer => {
        if (customer.id === state.activeCustomerId) {
          customer.currencyId = action.payload
          return
        }
      })
      localStorage.setItem('customers', JSON.stringify(state))
    },
    changeDiscountTotalAmount: (state, action: PayloadAction<number>) => {
      state.customers.forEach(customer => {
        if (customer.id === state.activeCustomerId) {
          customer.discountTotalAmount = action.payload
          return
        }
      })
      localStorage.setItem('customers', JSON.stringify(state))
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.customers.forEach(customer => {
        if (customer.id === state.activeCustomerId) {
          customer.cart = customer.cart.filter(product => {
            if (product.barcode === action.payload) {
              // Sildiğimiz ürünün fiyatını toplam fiyattan çıkar
              customer.totalAmount -= product.quantity * product.sellingPrice
              customer.totalQuantity -= product.quantity
              return false // Ürünü filtreleme, yani silme
            }
            return true // Diğer ürünleri koru
          })
        }
      })
      localStorage.setItem('customers', JSON.stringify(state))
    },

    deleteCustomer: state => {
      state.customers.forEach(customer => {
        if (customer.id === state.activeCustomerId) {
          customer.cart = []
          customer.totalQuantity = 0
          customer.totalAmount = 0
          customer.paidAmount = 0
          customer.currencyId = 'TRY'
          customer.discountTotalAmount = 0
        }
      })
      localStorage.setItem('customers', JSON.stringify(state))
    },
    changeProductSellingPrice: (state, action: PayloadAction<{ productBarcode: string; sellingPrice: number }>) => {
      state.customers.forEach(customer => {
        if (customer.id === state.activeCustomerId) {
          customer.cart.forEach(product => {
            if (product.barcode === action.payload.productBarcode) {
              product.sellingPrice = action.payload.sellingPrice
              customer.totalAmount = Number((product.quantity * product.sellingPrice).toFixed(2))
              localStorage.setItem('customers', JSON.stringify(state))
              return
            }
          })
        }
      })
    }
  }
})

export const checkoutCart = createAsyncThunk('customers/checkoutCart', async (paymentInfo:PaymentInfo ,thunkAPI) => {
  const state = thunkAPI.getState() as RootState
  const customer: CustomerState | undefined = state.customers.customers.find(
    customer => customer.id === state.customers.activeCustomerId
  )
  const payload = {
    currencyId: customer?.currencyId,
    discountTotalAmount: customer?.discountTotalAmount,
    items: customer?.cart,
    paymentTypeId: paymentInfo.paymentMethodId,
    totalAmount: customer?.totalAmount,
    totalQuantity: customer?.totalQuantity,
    cashAmount: paymentInfo.cashAmount || 0,
    cardAmount: paymentInfo.cardAmount || 0,
    creditAmount: paymentInfo.creditAmount || 0,
  }
  const toast = useCustomToast()
  try {
    const response = await fetchClient('/sales', { method: 'POST', data: payload })
    const data = await response.json()
    thunkAPI.dispatch(deleteCustomer())
    toast({
      type: 'success',
      message: data.message
    })
    return data
  } catch (error: any) {
    if (error instanceof Response) {
      error = await error.json()
    }
    toast({
      type: 'error',
      message: error.message
    })
  }
})
// Action creators are generated for each case reducer function
export const {
  addProduct,
  changeActiveCustomer,
  changeProductName,
  changeProductQuantity,
  changePaidAmount,
  changeCurrency,
  changeDiscountTotalAmount,
  deleteProduct,
  deleteCustomer,
  changeProductSellingPrice,
  addInitialStateFromLocalStorage
} = customersSlice.actions

export default customersSlice.reducer
