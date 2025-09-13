import axios from "axios";
import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getFilmList = createAsyncThunk(
  "admin/getFilmList/get",
  async (payload) => {
    const response = await apiInstanceFetch.get(
      `/api/admin/movieSeries/fetchAllMediaContent?start=${payload?.page}&limit=${payload?.size}`
    );

    console.log("response", response);
    return response;
  }
);

export const getFilmListVideo = createAsyncThunk(
  "admin/getFilmListVideo/get",
  async (payload) => {
    const response = await apiInstanceFetch.get(
      `/api/admin/shortVideo/retrieveMovieSeriesVideoData?start=${payload?.start}&limit=${payload?.limit}&movieSeriesId=${payload?.movieSeriesId}`
    );
    return response;
  }
);

export const addFilmList = createAsyncThunk(
  "admin/addFilmList/add",
  async (payload) => {
    const response = await apiInstanceFetch.post(
      `/api/admin/movieSeries/createContent`,
      payload
    );
    return response;
  }
);
export const uploadImage = createAsyncThunk(
  "admin/uploadImage/add",
  async (payload) => {
    console.log("payloaddd", payload);

    // console.log("payloaddd",payload)
    const response = await axios.post(`/api/admin/file/upload-file`, payload);
    return response;
  }
);

export const editFilmList = createAsyncThunk(
  "admin/editFilmList/update",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/movieSeries/updateContent`,
      payload
    );
    return response;
  }
);
export const filmListActive = createAsyncThunk(
  "admin/filmListActive/update",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/movieSeries/toggleActiveStatus?movieWebseriesId=${payload}`
    );
    return response;
  }
);
export const filmListBanner = createAsyncThunk(
  "admin/filmListBanner/update",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/movieSeries/toggleAutoAnimateBanner?movieWebseriesId=${payload}`
    );
    return response;
  }
);
export const filmListTrending = createAsyncThunk(
  "admin/filmListTrending/update",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/movieSeries/toggleTrendingStatus?movieWebseriesId=${payload}`
    );
    return response;
  }
);

export const deleteFilmCategory = createAsyncThunk(
  "admin/deleteFilmCategory/delete",
  async (payload) => {
    const response = await apiInstanceFetch.delete(
      `/api/admin/category/deleteCategory?categoryId=${payload}`
    );
    return response;
  }
);

export const deleteFilm = createAsyncThunk(
  "api/admin/movieSeries/removeMovieSeries",
  async (payload) => {
    return await apiInstanceFetch.delete(
      `/api/admin/movieSeries/removeMovieSeries?movieWebseriesId=${payload}`
    );
  }
);

export const deleteShortVideo = createAsyncThunk(
  "api/admin/shortVideo/removeShortMedia",
  async (payload) => {
    return await apiInstanceFetch.delete(
      `/api/admin/shortVideo/removeShortMedia?start=${payload.start}&limit=${payload.limit}&shortVideoId=${payload.shortVideoId}&movieSeriesId=${payload.movieSeriesId}`
    );
  }
);

// API function for updating episode position
export const updateEpisodePosition = createAsyncThunk(
  "api/admin/shortVideo/editShortVideo",
  async (payload) => {
    const { movieSeriesId, shortVideoId, newEpisodePosition } = payload;
    const response = await apiInstanceFetch.patch(
      `/api/admin/shortVideo/editShortVideo?movieSeriesId=${movieSeriesId}&shortVideoId=${shortVideoId}&newEpisodePosition=${newEpisodePosition}`
    );
    return response;
  }
);

// Batch update multiple episodes positions
export const reorderEpisodes = createAsyncThunk(
  "api/admin/shortVideo/editShortVideo",
  async (payload) => {
    const { movieSeriesId, episodes } = payload;

    // Call the API for each episode that needs position update
    const updatePromises = episodes.map((episode) =>
      apiInstanceFetch.patch(
        `/api/admin/shortVideo/editShortVideo?movieSeriesId=${movieSeriesId}&shortVideoId=${episode._id}`,
        { newEpisodePosition: episode.episodeNumber }
      )
    );

    const responses = await Promise.all(updatePromises);

    return {
      status: true,
      message: "Episodes reordered successfully",
      data: episodes,
      responses,
    };
  }
);

const filmListSlice = createSlice({
  name: "filmsList",
  initialState: {
    filmsList: [],
    filmListVideo: [],
    totalUser: 0,
    dailyReward: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFilmList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getFilmList.fulfilled, (state, action) => {
      // console.log("actiop", action);
      state.isLoading = false;
      state.filmsList = action?.payload.data;
      state.totalUser = action?.payload.total;
    });
    builder.addCase(getFilmList.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });
    builder.addCase(getFilmListVideo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getFilmListVideo.fulfilled, (state, action) => {
      // console.log("actiop", action);
      state.isLoading = false;
      state.filmListVideo = action?.payload.data;
      state.totalUser = action?.payload?.total;
    });
    builder.addCase(getFilmListVideo.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });
    builder.addCase(editFilmList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(editFilmList.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(addFilmList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(addFilmList.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deleteFilm.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteFilm.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deleteShortVideo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteShortVideo.fulfilled, (state, action) => {
      console.log("actiop", action);
      if (action.payload.status) {
        state.isLoading = false;
        state.filmListVideo = action?.payload.videos;
        setToast("success", action.payload?.message);
      } else {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    });
    builder.addCase(deleteShortVideo.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });
    builder.addCase(updateEpisodePosition.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateEpisodePosition.fulfilled, (state, action) => {
      // state.isLoading = false;
      if (action.payload.status) {
        setToast("success", "Episode position updated successfully");
        // manually update the state
        // state.filmListVideo = action.payload.;
      } else {
        setToast("error", action.payload?.message);
      }
    });
    builder.addCase(updateEpisodePosition.rejected, (state, action) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
    });
    // builder.addCase(reorderEpisodes.pending, (state, action) => {
    //     state.isLoading = true;
    // });
    // builder.addCase(reorderEpisodes.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     if (action.payload.status) {
    //         setToast("success", action.payload?.message);
    //         // Update the local state with reordered episodes
    //         state.filmListVideo = action.payload.data;
    //     } else {
    //         setToast("error", action.payload?.message);
    //     }
    // });
    // builder.addCase(reorderEpisodes.rejected, (state, action) => {
    //   state.isLoading = false;
    //   setToast("error", action.payload?.message);
    // });
  },
});

export default filmListSlice.reducer;
