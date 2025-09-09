import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



export const getCoinPlan = createAsyncThunk("admin/getCoinPlan/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/coinPlan/get?start=${payload?.page}&limit=${payload?.size}`)
        return response;
    }
)
export const getAllCoinPlan = createAsyncThunk("admin/getAllCoinPlan/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/coinPlan/fetchCoinplanHistory?start=${payload?.page}&limit=${payload?.size}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`)
        return response;
    }
)
export const getUserWiseCoinPlan = createAsyncThunk("admin/getUserWiseCoinPlan/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/coinPlan/fetchCoinplanHistory?start=${payload?.page}&limit=${payload?.size}&startDate=${payload?.startDate}&endDate=${payload?.endDate}&userId=${payload?.userId}`)
        return response;
    }
)

export const addCoinPlan = createAsyncThunk("admin/addCoinPlan/add",
    async (payload) => {
        const response = await apiInstanceFetch.post(`/api/admin/coinPlan/store`, payload)
        return response;
    }
)

export const updateCoinPlan = createAsyncThunk("admin/updateCoinPlan/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/coinPlan/update`, payload)
        return response;
    }
)
export const handleIsActiveCoin = createAsyncThunk("admin/handleIsActiveCoin/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/coinPlan/handleSwitch?coinPlanId=${payload}`)
        return response;
    }
)

const coinPlanSlice = createSlice({
    name: "coinPlan",
    initialState: {
        coinPlan: [],
        allCoinPlan: [],
        totalEarnings: 0, 
        userCoinPlan: [],
        isLoading: false,
        total: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getCoinPlan.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getCoinPlan.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.coinPlan = action.payload.data;
            }
        );
        builder.addCase(
            getCoinPlan.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getAllCoinPlan.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getAllCoinPlan.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.allCoinPlan = action?.payload?.history;
                state.totalEarnings = action?.payload?.totalAdminEarnings;
                state.total = action?.payload.totalHistory;
            }
        );
        builder.addCase(
            getAllCoinPlan.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getUserWiseCoinPlan.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getUserWiseCoinPlan.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.userCoinPlan = action?.payload?.history[0]?.coinPlanPurchase;
            }
        );
        builder.addCase(
            getUserWiseCoinPlan.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            updateCoinPlan.pending,
            (state, action) => {
                state.isLoading = true;
            }
        )
        builder.addCase(
            updateCoinPlan.fulfilled,
            (state, action) => {
                state.isLoading = false;
            }
        )
    },
});

export default coinPlanSlice.reducer;
