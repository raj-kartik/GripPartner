import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import makeApiRequest from '../../utils/ApiService';
import { GET_BANK_LIST } from '../../utils/api';


const initialState = {
  loading: false,
  error: null,
  bank: null,
};

export const fetchTrainerBank = createAsyncThunk(
  'bank/fetchTrainerBank',
  async (user_id, thunkAPI) => {
    try {
      const reponse:any = await makeApiRequest({
        // baseUrl: process.env.REACT_APP_API_URL,
        url: GET_BANK_LIST,
        method: 'POST',
        data: {user_id},
      });

      // console.log('==== response in bank list ====', reponse);

      return reponse?.data;
    } catch (error: any) {
      thunkAPI.rejectWithValue({message: error.message});
    }
  },
);

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTrainerBank.pending, state => {
        state.loading = true;
      })
      .addCase(fetchTrainerBank.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.error = null;
        state.bank = action.payload;
      })
      .addCase(fetchTrainerBank.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default bankSlice.reducer;
