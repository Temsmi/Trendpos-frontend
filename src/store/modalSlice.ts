import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ModalInfo {
  id: string
  isOpen: boolean
  data?: {
    [key: string]: any
  }
}

interface ModalState {
  [x: string]: any
  modals: ModalInfo[],
  isClickOutsideEnabled: boolean
}

const initialState: ModalState = {
  modals: [],
  isClickOutsideEnabled: true
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ id: string; barcode?: string }>) => {
      // Find the modal by ID
      const index = state.modals.findIndex(modal => modal.id === action.payload.id)
      if (index !== -1) {
        // Set isOpen to true and include the barcode in the modal's data if provided
        state.modals[index].isOpen = true
        if (action.payload.barcode) {
          state.modals[index].data = { ...state.modals[index].data, barcode: action.payload.barcode }
        }
      } else {
        // Push new modal object including barcode if provided
        state.modals.push({
          ...action.payload,
          isOpen: true,
          data: action.payload.barcode ? { barcode: action.payload.barcode } : {}
        })
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      // Instead of finding the index and setting isOpen to false,
      // filter the array to remove the modal with the matching id
      const filteredModals = state.modals.filter(modal => modal.id !== action.payload)
      // Update the state with the filtered modals array
      state.modals = filteredModals
    },
    setIsClickOutsideEnabled: (state, action: PayloadAction<boolean>) => {
      state.isClickOutsideEnabled = action.payload
    }
  }
})

export const { openModal, closeModal, setIsClickOutsideEnabled} = modalSlice.actions

export default modalSlice.reducer
