import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



export const getAdsRewardCoin = createAsyncThunk("admin/getAdsRewardCoin/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/adRewardCoin/getAdReward`)
        return response.data;
    }
)
export const getDailyRewardCoin = createAsyncThunk("admin/getDailyRewardCoin/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/dailyRewardCoin/getDailyReward`)
        return response.data;
    }
)
export const addAdsRewardCoin = createAsyncThunk("admin/addAdsRewardCoin/add",
    async (payload) => {
        const response = await apiInstanceFetch.post(`/api/admin/adRewardCoin/storeAdReward`, payload)
        return response;
    }
)
export const addDailyRewardCoin = createAsyncThunk("admin/addDailyRewardCoin/add",
    async (payload) => {
        const response = await apiInstanceFetch.post(`/api/admin/dailyRewardCoin/storeDailyReward`, payload)
        return response;
    }
)
export const editAddsRewardCoin = createAsyncThunk("admin/editAddsRewardCoin/update",
    async (payload) => {
        const data = {
            adRewardId: payload?._id,
            adLabel: payload?.adLabel,
            adDisplayInterval: payload?.adDisplayInterval,
            coinEarnedFromAd: payload?.coinEarnedFromAd
        }
        const response = await apiInstanceFetch.put(`/api/admin/adRewardCoin/updateAdReward`, data)
        return response;
    }
)

export const editDailyRewardCoin = createAsyncThunk("admin/editDailyRewardCoin/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/dailyRewardCoin/updateDailyReward`, payload)
        return response;
    }
)

export const deleteAdsReward = createAsyncThunk("admin/deleteAdsReward/delete",
    async (payload) => {
        const response = await apiInstanceFetch.delete(`/api/admin/adRewardCoin/deleteAdReward?adRewardId=${payload}`)
        return response;
    }
)
export const deleteDailyReward = createAsyncThunk("admin/deleteDailyReward/delete",
    async (payload) => {
        const response = await apiInstanceFetch.delete(`/api/admin/dailyRewardCoin/deleteDailyReward?dailyRewardCoinId=${payload}`)
        return response;
    }
)
const rewardSlice = createSlice({
    name: "adsReward",
    initialState: {
        adsReward: [],
        dailyReward: [],
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getAdsRewardCoin.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getAdsRewardCoin.fulfilled,
            (state, action) => {
                // console.log("actiop", action);

                state.isLoading = false;
                state.adsReward = action.payload;
            }
        );
        builder.addCase(
            getAdsRewardCoin.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getDailyRewardCoin.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getDailyRewardCoin.fulfilled,
            (state, action) => {
                // console.log("actiop", action);

                state.isLoading = false;
                state.dailyReward = action.payload;
            }
        );
        builder.addCase(
            getDailyRewardCoin.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            editDailyRewardCoin.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            editDailyRewardCoin.fulfilled,
            (state, action) => {
                state.isLoading = false;
            }
        );
        builder.addCase(
            editAddsRewardCoin.pending,
            (state, action) => {
                state.isLoading = true;
            }
        )
        builder.addCase(
            editAddsRewardCoin.fulfilled,
            (state, action) => {
                state.isLoading = false;
            }
        )
        builder.addCase(addAdsRewardCoin.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(addAdsRewardCoin.fulfilled, (state, action) => {
            state.isLoading = false;
        })
    },
});

export default rewardSlice.reducer;
