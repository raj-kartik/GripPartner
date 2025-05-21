import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import makeApiRequest from '../../utils/ApiService';
import {
  BASE_URL,
  NOTIFICATION_LIST,
  NOTIFICATION_READ_LIST,
} from '../../utils/api';

const initialState: any = {
  loading: false,
  error: null,
  notification: [],
  read: [],
  updates: [],
  unread: [],
};

export const getNotificaiton = createAsyncThunk(
  'notification/getNotificaiton',
  async ({id, notiType}: any) => {
    try {
      const endpoint: string = notiType == 'read' ? NOTIFICATION_READ_LIST(id) : NOTIFICATION_LIST(id);

      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        method: 'GET',
        url: endpoint,
      });

      // console.log('=== endpoint ===', endpoint);
      // console.log('=== response notification ===', response);

      if (response?.success === true) {
        return {response: response?.data, type: notiType};
      }
    } catch (err: any) {
      console.error('Error in the notification slice: ', err);
    }
  },
);

const notificationSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getNotificaiton.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotificaiton.fulfilled, (state: any, action: any) => {
        state.loading = false;
        const {response, type} = action.payload;
        // console.log("==== action payload ====",action?.payload);
        
        if (type === 'read') {
          state.read = response;
        } else if (type === 'unread') {
          state.unread = response;
        } else if (type === 'updates') {
          state.updates = response;
        } else {
          state.notification = response;
        }
      })
      .addCase(getNotificaiton.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default notificationSlice.reducer;
