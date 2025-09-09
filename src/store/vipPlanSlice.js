import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



export const getVipPlan = createAsyncThunk("admin/getCoinPlan/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/vipPlan/retriveVipPlan?start=${payload?.page}&limit=${payload?.size}`)
        return response.data;
    }
)
export const getAllVipPlan = createAsyncThunk("admin/getAllVipPlan/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/vipPlan/fetchVipPlanHistory?start=${payload?.page}&limit=${payload?.size}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`)
        return response;
    }
)
export const getUserWiseVipPlan = createAsyncThunk("admin/getUserWiseVipPlan/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/vipPlan/fetchVipPlanHistory?start=${payload?.page}&limit=${payload?.size}&startDate=${payload?.startDate}&endDate=${payload?.endDate}&userId=${payload?.userId}`)
        return response;
    }
)

export const addVipPlan = createAsyncThunk("admin/addVipPlan/add",
    async (payload) => {
        const response = await apiInstanceFetch.post(`/api/admin/vipPlan/storeVipPlan`, payload)
        return response;
    }
)

export const updateVipPlan = createAsyncThunk("admin/updateVipPlan/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/vipPlan/updateVipPlan`, payload)
        return response;
    }
)
export const handleIsActiveVipCoin = createAsyncThunk("admin/handleIsActiveVipCoin/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/vipPlan/isActiveOrNot?vipPlanId=${payload}`)
        return response;
    }
)

const vipPlanSlice = createSlice({
    name: "vipPlan",
    initialState: {
        vipPlan: [],
        vipAllPlan: [],
        userVipPlan:[],
        totalEarnings: 0,
        dailyReward: [],
        isLoading: false,
        total: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getVipPlan.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getVipPlan.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.vipPlan = action.payload;
            }
        );
        builder.addCase(
            getVipPlan.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getAllVipPlan.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getAllVipPlan.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.vipAllPlan = action?.payload?.history;
                state.totalEarnings = action?.payload?.totalAdminEarnings
                state.total = action?.payload.totalHistory;
            }
        );
        builder.addCase(
            getAllVipPlan.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getUserWiseVipPlan.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getUserWiseVipPlan.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.userVipPlan = action?.payload?.history;
            }
        );
        builder.addCase(
            getUserWiseVipPlan.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            updateVipPlan.pending,
            (state, action) => {
                state.isLoading = true
            }
        )
        builder.addCase(
            updateVipPlan.fulfilled,
            (state, action) => {
                state.isLoading = false
            }
        )
        builder.addCase(
            addVipPlan.pending,
            (state, action) => {
                state.isLoading = true
            }
        )
        builder.addCase(
            addVipPlan.fulfilled,
            (state, action) => {
                state.isLoading = false
            }
        )
    },
});

export default vipPlanSlice.reducer;
