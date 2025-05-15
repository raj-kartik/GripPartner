import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import makeApiRequest from '../../utils/ApiService';
import axios from 'axios';
import {BASE_URL} from '../../utils/api';

interface CoursePayload {
  id: number;
  studio_id: number;
}

const initialState: any = {
  loading: false,
  course: null,
  error: null,
};

export const getCourse = createAsyncThunk(
  'course/getCourse',
  async ({id, studio_id}: CoursePayload, ThunkAPI) => {
    console.log('--- studio_id in the course list ----', studio_id);

    try {
      const response: any = await makeApiRequest({
        method: 'POST',
        url: `user-course-list?id=${id}`,
        baseUrl: BASE_URL,
        data: {
          studio_id: studio_id || null,
        },
      });

      console.log('----- response.courses =======', response.courses);

      if (response?.courses) {
        return response.courses;
      } else {
        return ThunkAPI.rejectWithValue('No courses found');
      }
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.message || 'Something went wrong');
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
