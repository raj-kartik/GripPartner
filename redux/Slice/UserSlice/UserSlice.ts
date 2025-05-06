import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import makeApiRequest from '../../../utils/ApiService';
import {
  BASE_URL,
  GET_USER_DETAILS,
  POST_SIGNUP,
  TRAINER_REGISTRATION,
} from '../../../utils/api';
import axios from 'axios';
import {CustomToast} from '../../../components/Customs/CustomToast';

const initialState = {
  user: null,
  loading: true,
  error: null,
  auth: false,
};

export const userDetail = createAsyncThunk(
  'user/userDetail',
  async (_, {rejectWithValue}) => {
    try {
      const user: any = await AsyncStorage.getItem('userId');
      const userId = JSON.parse(user);

      if (!userId) {
        // console.log('No userId found. Skipping API call.');
        return rejectWithValue('User is not logged in.');
      }

      const response: any = await makeApiRequest({
        url: GET_USER_DETAILS,
        data: {user_id: userId},
        baseUrl: BASE_URL,
        method: 'POST',
      });

      // console.log("=== response in the user data ===",response);

      if (response.status) {
        return response.data; // Return user data if API call succeeds
      } else {
        return rejectWithValue('Failed to fetch user details.');
      }
    } catch (error) {
      console.error('Error in userDetail thunk:', error);
      return rejectWithValue('An unexpected error occurred.');
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async ({mobile, otp}: any, {rejectWithValue}) => {
    try {
      const response = await axios.post('https://fitwithgrip.com/api/signin', {
        phone_no: mobile,
        otp_code: otp,
      });

      console.log(
        '=== response in the verify otp ===',
        response?.data?.response,
      );

      const {status, response: data} = response?.data;
      if (status) {
        const {token, user_id} = data;
        await AsyncStorage.setItem('userId', user_id.toString());
        await AsyncStorage.setItem('token', token);
        return {user: {token, user_id}};
      } else {
        return rejectWithValue('OTP verification failed');
      }
    } catch (error) {
      console.error('Error in OTP verification:', error);
      return rejectWithValue('Something went wrong. Please try again.');
    }
  },
);

export const signUp = createAsyncThunk(
  'user/signUp',
  async (values: any, {rejectWithValue}) => {
    try {
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: TRAINER_REGISTRATION,
        data: {
          name: values.name,
          email: values.email,
          phone_no: values.phone,
          aadhar_no: values.aadharCardNumber,
        },
        method: 'POST',
      });

      if (response?.success == true) {
        await AsyncStorage.setItem(
          'userId',
          response?.response?.user_id.toString(),
        );
        await AsyncStorage.setItem('userId', response?.response?.user_id.toString());
        await AsyncStorage.setItem('token', response?.response?.token);
        return response?.response;
      } else {
        CustomToast({
          type: 'error',
          text1: 'Sign Up Failed',
          text2: response?.message,
        });
        return rejectWithValue('Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Error in sign up:', error);
      return rejectWithValue('Something went wrong. Please try again.');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.auth = false;
      AsyncStorage.clear();
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userDetail.pending, state => {
        // console.log('User detail fetch pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(userDetail.fulfilled, (state, action) => {
        // console.log('User detail fetch fulfilled:', action.payload);
        state.user = action.payload;
        state.auth = true;
        state.loading = false;
      })
      .addCase(userDetail.rejected, (state: any, action) => {
        // console.log('User detail fetch rejected:', action.payload);
        state.error = action.payload;
        state.auth = false;
        state.loading = false;
      })
      .addCase(verifyOtp.pending, state => {
        // console.log('=== verify otp pending === ');
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: any) => {
        // console.log('=== verify otp fullfilled === ');
        state.user = action.payload; // Store user data in the state
        state.auth = true; // Set auth to true after successful verification
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state: any, action: any) => {
        // console.log('=== verify otp rejected === ');
        state.loading = false;
        state.error = action.payload;
        state.auth = false;
      })
      .addCase(signUp.pending, state => {
        // console.log('=== sign up pending === ');
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: any) => {
        // console.log('=== sign up fullfilled === ');
        state.user = action.payload; // Store user data in the state
        state.auth = true; // Set auth to true after successful verification
        state.loading = false;
      })
      .addCase(signUp.rejected, (state: any, action: any) => {
        // console.log('=== sign up rejected === ');
        state.loading = false;
        state.error = action.payload;
        state.auth = false;
      });
  },
});

export const {logout} = userSlice.actions;
export default userSlice.reducer;
