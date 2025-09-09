import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



export const getCurrency = createAsyncThunk("admin/getCurrency/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/currency/fetchCurrency?start=${payload?.page}&limit=${payload?.size}`)
        return response.data;
    }
)

export const addCurrency = createAsyncThunk("admin/addCurrency/add",
    async (payload) => {
        const response = await apiInstanceFetch.post(`/api/admin/currency/create`, payload)
        return response;
    }
)

export const updateCurrency = createAsyncThunk("admin/updateCurrency/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/currency/update`,payload)
        return response;
    }
)
export const handleDefaultCurrency = createAsyncThunk("admin/handleDefaultCurrency/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/currency/setdefault?currencyId=${payload}`)
        return response;
    }
)

export const deleteCurrency = createAsyncThunk("admin/deleteCurrency/delete",
    async (payload) => {
        const response = await apiInstanceFetch.delete(`/api/admin/currency/delete?currencyId=${payload}`)
        return response;
    }
)
const currencySlice = createSlice({
    name: "currency",
    initialState: {
        currency: [],
        dailyReward: [],
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getCurrency.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getCurrency.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.currency = action.payload;
            }
        );
        builder.addCase(
            getCurrency.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            handleDefaultCurrency.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            handleDefaultCurrency.fulfilled,
            (state, action) => {
                // state.isLoading = false;
            }
        );
        builder.addCase(
            handleDefaultCurrency.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
    },
});

export default currencySlice.reducer;
