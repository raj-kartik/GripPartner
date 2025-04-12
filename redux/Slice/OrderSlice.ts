import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import { DEFAULT_URL, GET_ORDER_STATUS } from '../../utils/api';

// Define types for the order data and the Redux state
interface Order {
  created_at: string;
  customer_name: string;
  email: string;
  grand_total: number;
  order_id: number;
  status:
    | 'processing'
    | 'canceled'
    | 'completed'
    | 'pending_payment'
    | 'Order_Complete'
    | 'pending';
}

interface OrderState {
  loading: boolean;
  error: string | null;
  data: {
    pending: Order[];
    canceled: Order[];
    completed: Order[];
    processing: Order[];
    pending_payment: Order[];
  };
  message: string;
}

// Initial state for the slice
const initialState: OrderState = {
  loading: false,
  error: null,
  data: {
    pending: [],
    canceled: [],
    completed: [],
    processing: [],
    pending_payment: [],
  },
  message: '',
};

// Async thunk to fetch and filter order status
export const orderStatus = createAsyncThunk(
  'order/orderStatus',
  async (id: string, {rejectWithValue}) => {
    try {
      // Retrieve user data from AsyncStorage
      const userData = await AsyncStorage.getItem('user_data');
      const data = JSON.parse(userData || '{}');
      // const email = 'gaurav.kumar9718@gmail.com';
      const email = id;

      if (!email) {
        throw new Error('Email is missing in user data.');
      }

      // API request to fetch order status
      const response = await axios({
        method: 'POST',
        url: `${DEFAULT_URL + GET_ORDER_STATUS}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          email, // Sending payload as JSON
        },
      });

      if (response.data?.error) {
        // console.log('==== reponse in the order slice ====', response?.data);

        return rejectWithValue(
          response.data?.message || 'Error fetching order status.',
        );
      }

      // Filter the orders based on their status
      const filteredOrders = {
        pending: [] as Order[],
        canceled: [] as Order[],
        completed: [] as Order[],
        processing: [] as Order[],
        pending_payment: [] as Order[],
      };

      response.data?.data.forEach((order: Order) => {
        if (order.status === 'pending' || order.status === 'processing') {
          filteredOrders.pending.push(order);
        } else if (order.status === 'canceled') {
          filteredOrders.canceled.push(order);
        } else if (
          order.status === 'completed' ||
          order.status === 'Order_Complete'
        ) {
          filteredOrders.completed.push(order);
        } else if (order.status === 'pending_payment') {
          filteredOrders.pending_payment.push(order);
        }
      });

      return filteredOrders; // Return the filtered orders
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred.',
      );
    }
  },
);

// Slice for order status
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: state => {
      state.loading = false;
      state.error = null;
      state.data = {
        pending: [],
        canceled: [],
        completed: [],
      };
      state.message = '';
    },
  },
  extraReducers: builder => {
    builder
      // Pending state
      .addCase(orderStatus.pending, state => {
        state.loading = true;
        state.error = null;
        state.message = '';
      })
      // Fulfilled state
      .addCase(
        orderStatus.fulfilled,
        (state, action: PayloadAction<OrderState['data']>) => {
          state.loading = false;
          state.data = action.payload; // Set filtered orders
          state.message = 'Order status fetched successfully.';
        },
      )
      .addCase(orderStatus.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order status.';
      });
  },
});

// Export actions and reducer
export const {clearOrderState} = orderSlice.actions;
export default orderSlice.reducer;
