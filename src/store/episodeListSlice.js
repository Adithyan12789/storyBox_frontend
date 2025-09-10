import axios from "axios";
import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



export const getEpisodeList = createAsyncThunk("admin/getEpisodeList/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/shortVideo/fetchShortVideos?start=${payload?.page}&limit=${payload?.size}`)
        return response;
    }
)
export const getVideoDetails = createAsyncThunk("admin/getVideoDetails/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/shortVideo/getShortVideoInfo?shortVideoId=${payload}`)
        return response.data;
    }
)
export const getFilmListVideo = createAsyncThunk("admin/getFilmListVideo/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/shortVideo/retrieveMovieSeriesVideoData?start=${payload?.start}&limit=${payload?.limit}&movieSeriesId=${payload?.movieSeriesId}`)
        return response.data;
    }
)
export const getEpisodeNumber = createAsyncThunk("admin/getEpisodeNumber/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/shortVideo/validateEpisodeLock?episodeNumber=${payload}`)
        return response;
    }
)

export const addVideoList = createAsyncThunk("admin/addVideoList/add",
    async (payload) => {
        // console.log("payload>>>",payload)
        const response = await apiInstanceFetch.post(`/api/admin/shortVideo/createShortVideo`, payload)
        return response;
    }
)

export const uploadImage = createAsyncThunk("admin/uploadImage/add",
    async (payload) => {
        // console.log("payloaddd", payload)
        const response = await axios.post(`/api/admin/file/upload-file`, payload)
        return response;
    }
)
export const uploadMultipleImage = createAsyncThunk("admin/uploadImage/add",
    async (payload) => {
        // console.log("payloaddd", payload)
        const response = await axios.post(`/api/admin/file/upload_multiple_files`, payload)
        return response;
    }
)

export const editVideoList = createAsyncThunk("admin/editVideoList/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/shortVideo/updateShortVideo`, payload)
        
        return response;
    }
)

export const filmListActive = createAsyncThunk("admin/filmListActive/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/movieSeries/toggleActiveStatus?movieWebseriesId=${payload}`)
        return response;
    }
)
export const filmListBanner = createAsyncThunk("admin/filmListBanner/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/movieSeries/toggleAutoAnimateBanner?movieWebseriesId=${payload}`)
        return response;
    }
)
export const filmListTrending = createAsyncThunk("admin/filmListTrending/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/movieSeries/toggleTrendingStatus?movieWebseriesId=${payload}`)
        return response;
    }
)

export const deleteFilmCategory = createAsyncThunk("admin/deleteFilmCategory/delete",
    async (payload) => {
        const response = await apiInstanceFetch.delete(`/api/admin/category/deleteCategory?categoryId=${payload}`)
        return response;
    }
)



const episodeListSlice = createSlice({
    name: "episodeList",
    initialState: {
        episodeList: [],
        filmListVideo: [],
        getVideo: [],
        totalUser: 0,
        dailyReward: [],
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getEpisodeList.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getEpisodeList.fulfilled,
            (state, action) => {
                state.isLoading = false;
                state.episodeList = action?.payload.data;
                state.totalUser = action?.payload?.total;
            }
        );
        builder.addCase(
            getEpisodeList.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getFilmListVideo.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getFilmListVideo.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.filmListVideo = action?.payload;
                state.totalUser = action?.payload?.total;
            }
        );
        builder.addCase(
            getFilmListVideo.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getVideoDetails.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getVideoDetails.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.getVideo = action?.payload;
                // state.totalUser = action?.payload?.total;
            }
        );
        builder.addCase(
            getVideoDetails.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );

        builder.addCase(editVideoList.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(editVideoList.fulfilled, (state, action) => {

            state.isLoading = false;
            // state.filmListVideo = state.filmListVideo.map((item) =>
            //     item._id === action?.payload.data._id ? action?.payload.data : item
            // );
        });

        builder.addCase(addVideoList.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(addVideoList.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(uploadMultipleImage.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(uploadMultipleImage.fulfilled, (state, action) => {
            state.isLoading = false;
        })
    },
});

export default episodeListSlice.reducer;
