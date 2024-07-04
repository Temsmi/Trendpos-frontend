import { configureStore } from '@reduxjs/toolkit'
import customersReducer from '@/store/customersStore'
import modalSlice from '@/store/modalSlice'
import fastSalesSlice from '@/store/fastSalesSlice'
import currentAccountSlice from '@/store/current-account-slice'
import productDetailReducer from '@/store/productDetail'
import termsSliceReducer  from '@/store/terms-slice'
import permissionSlice from '@/store/permission-slice'

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    modal: modalSlice,
    fastSalesSlice: fastSalesSlice,
    currentAccount: currentAccountSlice,
    productDetail: productDetailReducer,
    terms: termsSliceReducer,
    permissions:permissionSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
