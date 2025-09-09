import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getFilmCategory = createAsyncThunk("admin/getFilmCategory/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/category/fetchCategory?start=${payload?.page}&limit=${payload?.size}`)
        return response;
    }
)
export const getFilmActiveCategory = createAsyncThunk("admin/getFilmActiveCategory/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/category/getFilmCategoryOptions`)
        return response.data;
    }
)

export const addFilmCategory = createAsyncThunk("/admin/addFilmCategory/add",
    async (payload) => {
        const response = await apiInstanceFetch.post(`/api/admin/category/createCategory`, payload)
        return response;
    }
)

export const editFilmCategory = createAsyncThunk("admin/editFilmCategory/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/category/updateCategory?categoryId=${payload?.categoryId}&name=${payload?.name}`)
        return response;
    }
)
export const filmCategoryActive = createAsyncThunk("admin/filmCategoryActive/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/category/modifyActiveState?categoryId=${payload}`)
        return response;
    }
)

// modifyActiveState


export const deleteFilmCategory = createAsyncThunk("admin/deleteFilmCategory/delete",
    async (payload) => {
        const response = await apiInstanceFetch.delete(`/api/admin/category/deleteCategory?categoryId=${payload}`)
        return response;
    }
)
const filmSlice = createSlice({
    name: "films",
    initialState: {
        filmsCategory: [],
        filmsActiveCategory:[],
        dailyReward: [],
        isLoading: false,
        total: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getFilmCategory.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getFilmCategory.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.filmsCategory = action.payload.data;
                state.total = action.payload.total;
            }
        );
        builder.addCase(
            getFilmCategory.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getFilmActiveCategory.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getFilmActiveCategory.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.filmsActiveCategory = action.payload;
            }
        );
        builder.addCase(
            getFilmActiveCategory.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            editFilmCategory.pending,
            (state, action) => {
                state.isLoading = true;
            }
        )
        builder.addCase(
            editFilmCategory.fulfilled,
            (state, action) => {
                state.isLoading = false;
            }
        )
    },
});

export default filmSlice.reducer;
