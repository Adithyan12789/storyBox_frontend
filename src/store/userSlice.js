import { apiInstance, apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllUsers = createAsyncThunk(
    "admin/getAllUsers/get",
    async (payload) => {
        return axios.get(
            `/api/admin/user/getUsersByAdmin?start=${payload?.page}&limit=${
                payload?.size
            }&startDate=${payload?.startDate}&endDate=${
                payload?.endDate
            }&search=${payload?.search || "All"}`
        );
    }
);
export const getUserInfo = createAsyncThunk(
    "admin/getUserInfo/get",
    async (payload) => {
        return apiInstanceFetch.get(
            `/api/admin/user/retriveUserProfile?userId=${payload}`
        );
    }
);
export const getUserCoinHistory = createAsyncThunk(
    "admin/getUserCoinHistory/get",
    async (payload) => {
        return apiInstanceFetch.get(
            `/api/admin/history/retrieveUserCoinTransactions?startDate=${payload?.startDate}&endDate=${payload?.endDate}&userId=${payload?.userId}`
        );
    }
);
export const getUserReferralHistory = createAsyncThunk(
    "admin/getUserReferralHistory/get",
    async (payload) => {
        return apiInstanceFetch.get(
            `/api/admin/history/retrieveUserReferralRecords?startDate=${payload?.startDate}&endDate=${payload?.endDate}&userId=${payload?.userId}`
        );
    }
);

export const getUserProfile = createAsyncThunk(
    "admin/user/getProfile?userId",
    async (payload) => {
        return apiInstanceFetch.get(
            `/admin/user/getProfile?userId=${payload?.id}`
        );
    }
);

export const getCountry = createAsyncThunk(
    "https://restcountries.com/v3.1/all",
    async () => {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        return data;
    }
);

export const deleteUser = createAsyncThunk(
    "admin/user/deleteUsers",
    async (payload) => {
        return apiInstanceFetch.delete(
            `/admin/user/deleteUsers?userId=${payload?.id}`
        );
    }
);

export const blockUser = createAsyncThunk(
    "admin/user/isBlock",
    async (payload) => {
        const response = await apiInstanceFetch.put(
            `/api/admin/user/isBlock?userId=${payload}`
        );
        return response;
    }
);
export const editUser = createAsyncThunk(
    "admin/user/editUser",
    async (payload) => {
        const response = await apiInstanceFetch.put(
            `/api/admin/user/modifyUserInfo`,
            payload
        );
        return response;
    }
);

export const blockVerifiedUser = createAsyncThunk(
    "admin/user/isBlockverifieduser",
    async (payload) => {
        return axios.patch(
            `/admin/user/isBlock?userId=${payload?.id ? payload?.id : payload}`
        );
    }
);

export const addFakeUser = createAsyncThunk(
    "admin/user/fakeUser",
    async (payload) => {
        return axios.post("admin/user/fakeUser", payload?.data);
    }
);

export const updateFakeUser = createAsyncThunk(
    "admin/user/updateUser",
    async (payload) => {
        return axios.patch(
            `/admin/user/updateUser?userId=${payload?.id}`,
            payload.data
        );
    }
);

export const userPasswordChange = createAsyncThunk(
    "admin/user/userPasswordChange",
    async (payload) => {
        return axios.patch(
            `/admin/user/userPasswordChange?userId=${payload?.id}`,
            payload.data
        );
    }
);

const userSlice = createSlice({
    name: "users",
    initialState: {
        realUserData: [],
        totalRealUser: 0,
        fakeUserData: [],
        coinHistory: [],
        referralHistory: [],
        verifiedUserData: [],
        userPostData: [],
        totalFakeUser: 0,
        totalVerifiedUser: 0,
        getUserProfileData: {},
        postData: {},
        countryData: [],
        userInfo: [],
        userInfoId: "",
        isLoading: false,
    },
    reducers: {
        // setUserInfo(state, action) {
        //   state.userInfo = action.payload;
        // },
        setUserInfoId(state, action) {
            state.userInfoId = action.payload;
        },
        setGetProfileRemove(state, action) {
            state.getUserProfileData = action.payload.data;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllUsers.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(getAllUsers.fulfilled, (state, action) => {
            if (action.payload.data.status) {
                state.realUserData = action.payload.data.user;
                state.totalRealUser = action.payload.data.totalUsers;
                state.isLoading = false;
            } else {
                setToast("error", action.payload.data.message);
                state.isLoading = false;
            }
        });

        builder.addCase(getAllUsers.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(getUserInfo.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(getUserInfo.fulfilled, (state, action) => {
            state.userInfo = action.payload?.user;
            state.isLoading = false;
        });

        builder.addCase(getUserInfo.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(getUserProfile.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.getUserProfileData = action.payload?.data;
            state.isLoading = false;
        });

        builder.addCase(getUserProfile.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(getUserCoinHistory.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(getUserCoinHistory.fulfilled, (state, action) => {
            state.coinHistory = action.payload?.data;
            state.isLoading = false;
        });

        builder.addCase(getUserCoinHistory.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(getUserReferralHistory.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(getUserReferralHistory.fulfilled, (state, action) => {
            state.referralHistory = action.payload?.data;
            state.isLoading = false;
        });

        builder.addCase(getUserReferralHistory.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(blockUser.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(blockUser.fulfilled, (state, action) => {
            state.isLoading = false;
            // console.log(action.payload)
            if (action?.payload?.status) {
                const userId = action.meta.arg;
                state.realUserData = state?.realUserData?.map((user) => {
                    if (user._id === userId) {
                        return {
                            ...user,
                            isBlock: !user.isBlock,
                        };
                    } else {
                        return user;
                    }
                });

                const toastMessage = action?.payload?.data?.data?.some(
                    (value) => value?.isBlock === true
                )
                    ? "User Blocked Successfully"
                    : "User Unblocked Successfully";

                setToast("success", toastMessage);
            } else {
                setToast("error", action.payload?.message);
            }
        });

        builder.addCase(blockUser.rejected, (state, action) => {
            state.isLoading = false;
            setToast("error", action.payload?.message);
        });

        builder.addCase(blockVerifiedUser.fulfilled, (state, action) => {
            if (action?.payload?.data?.status) {
                const userId = action.meta.arg?.id;

                state.verifiedUserData = state?.verifiedUserData?.map(
                    (userData) => {
                        if (userId?.includes(userData?._id)) {
                            const matchingUserData =
                                action.payload.data?.data?.find(
                                    (user) => user?._id === userData?._id
                                );
                            return {
                                ...userData,
                                isBlock: matchingUserData?.isBlock,
                            };
                        }
                        return userData;
                    }
                );

                const isAnyUserBlocked = action.payload.data?.data?.some(
                    (user) => user?.isBlock === true
                );

                const toastMessage = isAnyUserBlocked
                    ? "Verified User Blocked Successfully"
                    : "Verified User Unblocked Successfully";

                setToast("success", toastMessage);
            }
        });

        builder.addCase(blockVerifiedUser.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(deleteUser.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(deleteUser.fulfilled, (state, action) => {
            const deletedUserIds = action.meta.arg?.id;

            state.isLoading = false;
            state.fakeUserData = state.fakeUserData.filter(
                (user) => user?._id !== deletedUserIds
            );
            setToast("success", " User Delete Successfully");
        });

        builder.addCase(deleteUser.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(getCountry.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getCountry.fulfilled, (state, action) => {
            state.countryData = action.payload;
            state.isLoading = false;
        });

        builder.addCase(getCountry.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(addFakeUser.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(addFakeUser.fulfilled, (state, action) => {
            if (action.payload.data.status === true) {
                state.fakeUserData?.unshift(action?.payload?.data?.data);
                setToast(
                    "success",
                    `${action.payload.data?.data.userName} New User Created`
                );
            } else {
                setToast("error", action.payload.message);
            }
            state.isLoading = false;
        });

        builder.addCase(addFakeUser.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(updateFakeUser.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(updateFakeUser.fulfilled, (state, action) => {
            if (action.payload.data.status === true) {
                state.fakeUserData = state?.fakeUserData?.map((user) => {
                    if (user?._id === action.meta.arg?.id) {
                        return action.payload?.data?.data;
                    }
                    return user;
                });
                setToast(
                    "success",
                    `${action.payload.data?.data?.userName} User Updated Successfully`
                );
            }
            state.isLoading = false;
        });

        builder.addCase(updateFakeUser.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(userPasswordChange.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(userPasswordChange.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(userPasswordChange.rejected, (state, action) => {
            state.isLoading = false;
            setToast("error", action.payload?.message);
        });
        builder.addCase(editUser.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(editUser.fulfilled, (state, action) => {
            state.isLoading = false;
        });
    },
});

export default userSlice.reducer;
export const { setGetProfileRemove, setUserInfoId } = userSlice.actions;
