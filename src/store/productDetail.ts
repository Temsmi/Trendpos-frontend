import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductDetailState {
  name: string;
}

const initialProductDetailState: ProductDetailState = {
  name: '',
};

const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState: initialProductDetailState,
  reducers: {
    setProductName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    resetProductName: (state) => {
      state.name = '';
    },
  },
});

export const { setProductName, resetProductName } = productDetailSlice.actions;
export default productDetailSlice.reducer;
