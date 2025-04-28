import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_URL, POST_ADD_TO_CART_LIST } from '../../utils/api';

interface CartState {
  loading: boolean;
  error: string | null;
  message: string | null;
  data: any | null; // Replace `any` with a more specific type for cart data if known
}

const initialState: CartState = {
  loading: false,
  error: null,
  message: null,
  data: null,
};

export const addToCart = createAsyncThunk<any, void, { rejectValue: { message: string } }>(
  'cart/addToCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('guestCartToken');
      const response = await axios.post(
        `${DEFAULT_URL}${POST_ADD_TO_CART_LIST}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    //   console.log("**** add to cart fetch in controllers *****",response?.data);
      

      return response?.data?.data;
    } catch (error: any) {
      console.error('Error fetching cart details:', error);
      return rejectWithValue({ message: error.response?.data?.message || 'An error occurred' });
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addToCart.pending, state => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;
        state.message = 'Add to Cart fetched successfully';
        state.data = action.payload;

        // console.log("==== cart to add action payload ====",action.payload);
        
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Add to Cart unsuccessful';
        state.data = null;
      });
  },
});

export default cartSlice.reducer;