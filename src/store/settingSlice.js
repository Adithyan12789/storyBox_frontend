import axios from "axios";
import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



export const getSetting = createAsyncThunk("admin/getSetting/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/setting/fetchSettingByAdmin`)
        return response.data;
    }
)
export const updateSetting = createAsyncThunk("admin/updateSetting/update",
    async (payload) => {
        console.log("payload>>>>",payload);
        const response = await apiInstanceFetch.put(`/api/admin/setting/updateSetting?settingId=${payload?.settingId}`, payload)
        return response;
    }
)
export const handleSwitchUpdate = createAsyncThunk("admin/handleSwitchUpdate/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/setting/handleSwitch?settingId=${payload?.settingId}&type=${payload?.type}`)
        return response;
    }
)

export const getReportSetting = createAsyncThunk(
    "api/admin/reportReason/get",
    async (payload) => {
      return apiInstanceFetch.get(`/api/admin/reportReason/get`);
    }
  );

  export const createReportSetting = createAsyncThunk(
    "api/admin/reportReason/store",
    async (payload) => {
        return apiInstanceFetch.post(`/api/admin/reportReason/store`, payload);
    }
);

export const deleteReportSetting = createAsyncThunk(
    "api/admin/reportReason/delete",
    async (payload) => {
        return apiInstanceFetch.delete(
            `/api/admin/reportReason/delete?reportReasonId=${payload}`
        );
    }
);

export const updateReportSetting = createAsyncThunk(
    "api/admin/reportReason/update",
    async (payload) => {
        return apiInstanceFetch.put(
            `/api/admin/reportReason/update?reportReasonId=${payload?.reportReasonId}`,
            payload.data
        );
    }
);

export const saveToggle = createAsyncThunk("admin/setting/handleStorageSwitch", async (payload) => {
    const response = await apiInstanceFetch.put(`/api/admin/setting/handleStorageSwitch?settingId=${payload?.settingId}&type=${payload?.type}`)
    console.log('response', response);
    
    return response;
})

// handleSwitch   settingId ,type
const settingSlice = createSlice({
    name: "setting",
    initialState: {
        setting: [],
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getSetting.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getSetting.fulfilled,
            (state, action) => {
                // console.log("actiop", action);

                state.isLoading = false;
                state.setting = action.payload;
            }
        );
        builder.addCase(
            getSetting.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getReportSetting.pending,
            (state, action) => {
              state.isLoading = true;
            }
          );
      
          builder.addCase(
            getReportSetting.fulfilled,
            (state, action) => {
              state.isLoading = false;
              state.settingData = action.payload.data;
            }
          );
      
          builder.addCase(
            getReportSetting.rejected,
            (state, action) => {
              state.isLoading = false;
            }
          )
          builder.addCase(
            updateSetting.pending,
            (state, action) => {
                state.isLoading = true;
            }
          );
            builder.addCase(
                updateSetting.fulfilled,
                (state, action) => {
                    // console.log(action)
                    state.isLoading = false;
                    // if (action.payload.status) {
                    //     setToast("success", action.payload.message);
                    // }
                }
            );

            builder.addCase(
                handleSwitchUpdate.pending,
                (state, action) => {
                    state.isLoading = true;
                }
            );
            builder.addCase(
                handleSwitchUpdate.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                }
            )
            builder.addCase(createReportSetting.pending, (state, action) => {
                state.isLoading = true;
            })
            builder.addCase(createReportSetting.fulfilled, (state, action) => {
                state.isLoading = false;
            });
            builder.addCase(createReportSetting.rejected, (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            });
            builder.addCase(deleteReportSetting.pending, (state, action) => {
                state.isLoading = true;
            })
            builder.addCase(deleteReportSetting.fulfilled, (state, action) => {
                state.isLoading = false;
            });
            builder.addCase(deleteReportSetting.rejected, (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            });
            builder.addCase(updateReportSetting.pending, (state, action) => {
                state.isLoading = true;
            })
            builder.addCase(updateReportSetting.fulfilled, (state, action) => {
                state.isLoading = false;
            });
            builder.addCase(updateReportSetting.rejected, (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            });
             builder.addCase(saveToggle.pending, (state, action) => {
                state.isLoading = true;
            })
            builder.addCase(saveToggle.fulfilled, (state, action) => {
                state.isLoading = false;
            });
            builder.addCase(saveToggle.rejected, (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            });

    },
});

export default settingSlice.reducer;
