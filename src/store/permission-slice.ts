import { PermissionModalType } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'

const defaultInitialState: { permissions: PermissionModalType } = {
  permissions: {
    cari: false,
    create_product: false,
    sales: false,
    sales_report: false,
    stock_report: false,
    update_product: false
  }
}

export const permissionSlice = createSlice({
  name: 'permissions',
  initialState: defaultInitialState,
  reducers: {
    setPermission: (state, action) => {
      state.permissions = action.payload
    }
  }
})

export const { setPermission } = permissionSlice.actions
export default permissionSlice.reducer
