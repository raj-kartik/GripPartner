import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import makeApiRequest from '../../utils/ApiService';
import axios from 'axios';
import {BASE_URL} from '../../utils/api';

const initialState: any = {
  loading: false,
  course: null,
  error: null,
};

export const getCourse = createAsyncThunk(
  'course/getCourse',
  async (id, ThunkAPI) => {

    console.log("--- id in the course list ----",id);
    
    const response: any = await makeApiRequest({
      method: 'POST',
      url: `user-course-list?id=${id}`,
      baseUrl:BASE_URL
    });

    console.log("--- response in home course ---",response);
    
    if (response?.courses) {
      return response?.courses;
    }
  },
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCourse.pending, state => {
        state.loading = true;
      })
      .addCase(getCourse.fulfilled, (state, action) => {
        // console.log("===== fulfilled === " + action?.payload);
        state.loading = false;
        state.course = action.payload;
      })
      .addCase(getCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default courseSlice.reducer;
