import { RegisterDataType } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'

const defaultInitialState: { terms: Pick<RegisterDataType, 'acceptEmail' | 'clarificationText' | 'explicitConsent'> } ={
    terms: {
      explicitConsent: false,
      clarificationText: false,
      acceptEmail: false
    }
  }

export const termsSlice = createSlice({
  name: 'terms',
  initialState: defaultInitialState,
  reducers:{
    setTerms: (state, action) => {
        state.terms = action.payload
    },
  }
})

export const { setTerms } = termsSlice.actions
export default termsSlice.reducer

