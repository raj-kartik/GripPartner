import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import makeApiRequest from '../../utils/ApiService';

const initialState: any = {
    loading: false,
    retreat: null,
    error: null,
};

export const getRetreat = createAsyncThunk(
    'retreat/getRetreat',
    async (id: string, { rejectWithValue }) => {
        try {
            const response: any = await makeApiRequest({
                method: "GET",
                url: `user-retreat-list?user_id=${id}`
            })

            if (response?.data) {
                return response?.data;
            } else {
                return rejectWithValue(response?.message || 'Failed to fetch retreats');
            }
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Something went wrong');
        }
    }
);

const retreatSlice = createSlice({
    name: 'retreat',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRetreat.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error when fetching starts
            })
            .addCase(getRetreat.fulfilled, (state, action) => {
                state.loading = false;
                state.retreat = action.payload;
            })
            .addCase(getRetreat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store the error message
            });
    },
});

export default retreatSlice.reducer;
