import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import makeApiRequest from '../../utils/ApiService';
import { GET_CREATED_COUPON } from '../../utils/api';

const initialState: any = {
  loading: false,
  coupons: [],
  error: null,
};

export const getCouponTrainer = createAsyncThunk(
  'coupon/getCouponTrainer',
  async (id: number, ThunkAPI) => {
    const response: any = await makeApiRequest({
      url: GET_CREATED_COUPON,
      data: {
        created_by: id,
      },
      method: 'POST',
    });
    if (response.status === 'success') {
    //   console.log('==== response coupon trainer ===', response);
      return response.data;
    }
  },
);

const coupon = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCouponTrainer.pending, state => {
        state.loading = true;
      })
      .addCase(getCouponTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
      })
      .addCase(getCouponTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default coupon.reducer;
