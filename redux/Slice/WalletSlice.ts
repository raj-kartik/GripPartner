import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {GET_WALLET_BALANCE} from '../../utils/api';
import makeApiRequest from '../../utils/ApiService';
// import {GET_WALLET_BALANCE} from '../../../utils/API/api';
// import makeApiRequest from '../../../utils/API/apiServices';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

export const getWalletBalance = createAsyncThunk<
  any,
  void,
  {rejectValue: {message: string}}
>('wallet/getWalletBalance', async (user_id, {rejectWithValue}) => {
  // console.log("=== user id ===",user_id);

  try {
    const response: any = await makeApiRequest({
      url: GET_WALLET_BALANCE,
      method: 'POST',
      data: {user_id},
    });

    // console.log(' === response in the wallet === ', response);

    return response;
  } catch (error: any) {
    rejectWithValue({message: error.message});
  }
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getWalletBalance.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getWalletBalance.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default walletSlice.reducer;
