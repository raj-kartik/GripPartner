import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {BASE_URL, POST_TRAINER_LIST} from '@utils/api';
import makeApiRequest from '@utils/ApiService';

const initialState = {
  loading: false,
  error: null,
  data: [],
  message: '',
};

export const trainerList = createAsyncThunk(
  'trainer/trainerList',
  async (id: string, {rejectWithValue}) => {
    try {
      const response: any = await makeApiRequest({
        method: 'POST',
        baseUrl: BASE_URL,
        url: POST_TRAINER_LIST,
        data: {
          trainer_id: id,
        },
      });

      console.log("---- Trainer List Response: ", response);
      

      if (response?.status == 'success') {
        // console.log('Trainer List fetched successfully', response?.data);
        return response?.trainers || [];
      }
      // console.log("Trainer List Response: ", response);
    } catch (error: any) {
      console.error('Error fetching trainer list: ', error);
    }
  },
);

const trainerSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(trainerList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trainerList.fulfilled, (state, action:any) => {

        console.log("---- Trainer List Fulfilled: ", action.payload);
        
        state.loading = false;
        state.data = action.payload || [];
        state.message = action.payload?.message || '';
      })
      .addCase(trainerList.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {} = trainerSlice.actions;

export default trainerSlice.reducer;
