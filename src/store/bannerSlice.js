import { apiInstanceFetch, isLoading } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const getBanner = createAsyncThunk(
  "admin/banner/getAll",
  async (payload) => {
    return apiInstanceFetch.get(`/admin/banner/getBanner`);
  }
);

export const createBanner = createAsyncThunk(
  "admin/banner/create",
  async (payload) => {
    return axios.post("/admin/banner/createBanner", payload);
  }
);

export const deleteBanner = createAsyncThunk(
  "admin/banner/delete",
  async (payload) => {
    return axios.delete(`/admin/banner/deleteBanner?bannerId=${payload}`);
  }
);

export const activeBanner = createAsyncThunk(
  "admin/banner/isActive",
  async (payload) => {
    return axios.patch(`/admin/banner/isActive?bannerId=${payload}`);
  }
);

export const updateBanner = createAsyncThunk(
  "admin/banner/updateBanner",
  async (payload) => {
    return axios.patch(
      `/admin/banner/updateBanner?bannerId=${payload?.id}`,
      payload?.formData
    );
  }
);

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    banner: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBanner.pending, (state, action) => {
      state.isSkeleton = true;
      state.isLoading = true
    });
    builder.addCase(
      getBanner.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.banner = action.payload.data;
        state.isLoading = false

      }
    );
    builder.addCase(getBanner.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(
      createBanner.pending,
      (state, action) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      createBanner.fulfilled,
      (state, action) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.banner.unshift(action?.payload?.data?.data);

          setToast("success", "Banner Add Successfully");
        }
      }
    );
    builder.addCase(createBanner.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(
      deleteBanner.pending,
      (state, action) => {
        state.isLoading = true;
      }
    );

    builder.addCase(deleteBanner.fulfilled, (state, action) => {
      if (action?.payload?.data?.status) {
        state.banner = state.banner.filter(
          (banner) => banner?._id !== action?.meta?.arg
        );
        setToast("success", "Banner Delete Successfully");
      }
      state.isLoading = false;
    });

    builder.addCase(deleteBanner.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(
      activeBanner.pending,
      (state, action) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      activeBanner.fulfilled,
      (state, action) => {
        if (action?.payload?.data?.status) {
          const updatedBanner = action.payload.data.data;
          const bannerIndex = state.banner.findIndex(
            (banner) => banner?._id === updatedBanner?._id
          );
          if (bannerIndex !== -1) {
            state.banner[bannerIndex].isActive = updatedBanner.isActive;
          }
          setToast("success", "Banner Status Update Successfully");
        }
        state.isLoading = false;
      }
    );

    builder.addCase(activeBanner.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(updateBanner.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateBanner.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.data.status === true) {
        const bannerIndex = state.banner.findIndex(
          (banner) => banner?._id === action?.payload?.data?.data?._id
        );
        if (bannerIndex !== -1) {
          state.banner[bannerIndex] = {
            ...state.banner[bannerIndex],
            ...action.payload.data.data,
          };
        }
        setToast("success", `Banner Updated Successfully`);
      }
    });

    builder.addCase(updateBanner.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default bannerSlice.reducer;
