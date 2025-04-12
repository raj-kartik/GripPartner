import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import makeApiRequest from '../../utils/ApiService';
import { GET_COURSE_LIST } from '../../utils/api';

interface Course {
  lat: number;
  long: number;
  listOf: 'course-list' | 'trainer-list' | 'retreat-list';
}

interface CourseState {
  loading: boolean;
  error: string | null;
  data: {
    course: any[];
    trainer: any[];
    retreat: any[];
  };
}

const initialState: CourseState = {
  loading: false,
  error: null,
  data: {
    course: [],
    trainer: [],
    retreat: [],
  },
};

export const featureList = createAsyncThunk(
  'drawer/featureList',
  async ({ lat, long, listOf }: Course, { rejectWithValue }) => {
    try {
      const response: any = await makeApiRequest({
        method: 'GET',
        url: GET_COURSE_LIST(lat, long, listOf),
        data: {},
      });

      // console.log("==== response in the feature list ===",response?.data);
      
      return { data: response.data, listOf };
    } catch (error: any) {
      console.error('Error in featureList', error);
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

const featureSlice = createSlice({
  name: 'featureList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(featureList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        featureList.fulfilled,
        (state, action: PayloadAction<{ data: any[]; listOf: string }>) => {
          state.loading = false;
          state.error = null;

          // Update the specific key based on listOf
          if (action.payload.listOf === 'course-list') {
            state.data.course = action.payload.data;
          } else if (action.payload.listOf === 'trainer-list') {
            state.data.trainer = action.payload.data;
          } else if (action.payload.listOf === 'retreat-list') {
            state.data.retreat = action.payload.data;
          }
        }
      )
      .addCase(featureList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default featureSlice.reducer;
