import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import makeApiRequest from '../../utils/ApiService';
import { BASE_URL, GET_REFERRAL_LIST } from '../../utils/api';


const initialState = {
  loading: false,
  error: null,
  data: null,
};

export const getReferlist = createAsyncThunk(
  'referral/getReferlist',
  async (user_id) => {
    // console.log('=== user id in the referal list ===', user_id);

    try {
      const response: any = await makeApiRequest({
        url: GET_REFERRAL_LIST,
        data: {user_id},
        method: 'POST',
        baseUrl: BASE_URL,
      });

      console.log('==== response in the refferal list ===', response?.data);

      const data = await response?.data;
      return data;
    } catch (error) {
      return error;
    }
  },
);

export const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getReferlist.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReferlist.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getReferlist.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default referralSlice.reducer;
