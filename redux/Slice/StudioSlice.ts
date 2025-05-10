import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {BASE_URL, GET_STUDIO_LIST} from '../../utils/api';
import makeApiRequest from '../../utils/ApiService';
import {ca} from 'date-fns/locale';

const initialState: any = {
  studio: [],
  loading: false,
  error: null,
};

export const getStudioList = createAsyncThunk(
  'studio/getStudioList',
  async (id, {rejectWithValue}: any) => {
    try {
      const response: any = await makeApiRequest({
        url: GET_STUDIO_LIST,
        method: 'POST',
        baseUrl: BASE_URL,
        data: {
          user_id: id,
        },
      });

      if (response?.success == true) {
        return response?.data;
      } else {
        return rejectWithValue(response?.message || 'Failed to fetch retreats');
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  },
);

const studioSlice = createSlice({
  name: 'studio',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getStudioList.pending, state => {
        state.loading = true;
        state.error = null; // Reset error when fetching starts
      })
      .addCase(getStudioList.fulfilled, (state, action) => {
        state.loading = false;
        state.studio = action.payload;
      })
      .addCase(getStudioList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export default studioSlice.reducer;
