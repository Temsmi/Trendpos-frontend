import { createSlice } from '@reduxjs/toolkit'

export type State = {
  branchId: number
  customerId: number
  paymentId: number
  fullName: string
  transactId: number
  salesTransactionId: number
}

const defaultInitialState: State = {
  branchId: 0,
  customerId: 0,
  paymentId: 0,
  transactId: 0,
  salesTransactionId: 0,
  fullName: ''
}

export const currentAccountSlice = createSlice({
  name: 'current-account',
  initialState: defaultInitialState,
  reducers:{
    setBranchId: (state, action) => {
        state.branchId = action.payload
    },
    setCustomerId: (state, action) => {
        state.customerId = action.payload
    },
    setPaymentId: (state, action) => {
        state.paymentId = action.payload
    },
    setFullName: (state, action) => {
        state.fullName=action.payload
    },
    setTransactId: (state, action) => {
        state.transactId=action.payload
    },
    setSalesTransactionId: (state, action) => {
        state.salesTransactionId=action.payload
    }
  }
})

export const { setBranchId, setCustomerId, setPaymentId, setFullName, setTransactId, setSalesTransactionId } = currentAccountSlice.actions
export default currentAccountSlice.reducer

