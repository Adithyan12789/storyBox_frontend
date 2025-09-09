"use client";

import { apiInstance, apiInstanceFetch } from "../util/ApiInstance";
import { jwtDecode } from "jwt-decode";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setToast } from "../util/toastServices";
import { SetDevKey, setToken } from "../util/setAuthAxios";
import { secretKey } from "../util/config";
import axios from "axios";
import { toast } from "react-toastify";

export const signUpAdmin = createAsyncThunk(
    "/api/admin/admin/create",
    async (payload) => {
        return apiInstanceFetch.post("/api/admin/admin/create", payload);
    }
);

export const login = createAsyncThunk("/api/admin/admin/login", async (payload) => {
    const response = await axios.post("/api/admin/admin/login", payload);
    return response;
});

export const adminProfileGet = createAsyncThunk(
    "admin/adminProfileGet/profile",
    async (payload) => {
        const response = await apiInstanceFetch.get(
            `/api/admin/admin/getProfile`
        );
        return response;
    }
);

export const adminProfileUpdate = createAsyncThunk(
    "admin/admin/updateProfile",
    async (payload) => {
        const response = await apiInstanceFetch.put(
            `/api/admin/admin/updateProfile`,
            payload
        );
        return response;
    }
);

export const updateAdminPassword = createAsyncThunk(
    "admin/admin/updatePassword",
    async (payload) => {
        const response = await apiInstanceFetch.put(
            `/api/admin/admin/updatePassword`,
            payload
        );
        return response;
    }
);

export const sendEmail = createAsyncThunk(
    "admin/admin/forgotPassword",
    async (payload) => {
        return apiInstance.post(
            `/api/admin/admin/forgotPassword?email=${payload?.email}`
        );
    }
);

export const uploadImageNotification = createAsyncThunk(
    "admin/uploadImage/add",
    
    async (payload) => {
    

        // console.log("payloaddd",payload)
        const response = await axios.post(
            `/api/admin/file/upload-file`,
            payload
        );
        return response;
    }
);

export const sendNotification = createAsyncThunk(
    "admin/admin/notification",
    async (payload) => {
        
        return await axios.post("/api/admin/notification", payload);
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        isAuth: false,
        admin: {},
        isLoading: false,
    },
    reducers: {
        logoutApi(state, action) {
            localStorage.removeItem("token");
            sessionStorage.removeItem("admin");
            sessionStorage.removeItem("key");
            sessionStorage.removeItem("isAuth");
            state.admin = {};
            state.isAuth = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signUpAdmin.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(signUpAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload && action.payload?.status !== false) {
                setToast("success", "Admin sign up Successfully");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } else {
                setToast("error", action.payload?.message);
            }
        });
        builder.addCase(signUpAdmin.rejected, (state, action) => {
            state.isLoading = false;
            setToast("error", action.payload?.message);
        });

        builder.addCase(login.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            console.log("action", action);
            
            state.isLoading = false;
            if (action.payload?.data.status) {
                const token = action.payload.data.token;
                const decodedToken = jwtDecode(token);
                state.isAuth = true;

                state.admin = decodedToken;
                axios.defaults.headers.common["Authorization"] =
                    action.payload.data;
                SetDevKey(secretKey);
                localStorage.setItem("token", token);
                sessionStorage.setItem("isAuth", JSON.stringify(true));
                sessionStorage.setItem("admin_", JSON.stringify(decodedToken));
                setToast("success", "Login Successfully");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 2000);
            } else {
                setToast("error", action.payload?.data?.message);
            }
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            if (action.payload?.data?.message) {
                setToast("error", action.payload?.data?.message);
            } else {
                setToast("error", "Network Error");
            }
        });

        builder.addCase(adminProfileGet.pending, (state, action) => {
            
            state.isLoading = true;
        });
        builder.addCase(adminProfileGet.fulfilled, (state, action) => {
            state.isLoading = false;
            state.admin = action.payload.data;
        });
        builder.addCase(adminProfileGet.rejected, (state, action) => {
            state.isLoading = false;
            setToast("error", action.payload?.message);
        });

        builder.addCase(sendEmail.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(sendEmail.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status) {
                setToast("success", action?.payload?.message);
                window.location.href = "/";
            }
        });
        builder.addCase(sendEmail.rejected, (state, action) => {
            state.isLoading = false;
            setToast("error", action.payload?.message);
        });

        // builder.addCase(
        //   adminProfileUpdate.pending,
        //   (state, action) => {
        //     state.isLoading = true;
        //   }
        // );
        // builder.addCase(
        //   adminProfileUpdate.fulfilled,
        //   (state, action) => {
        //     state.isLoading = false;
        //     if (action.payload.data?.status === true) {
        //       state.admin = action.payload.data?.data;
        //       setToast("success", "Admin profile  update successfully");
        //     } else {
        //       setToast("error", action.payload.data.message);
        //     }
        //   }
        // );
        // builder.addCase(
        //   adminProfileUpdate.rejected,
        //   (state, action) => {
        //     state.isLoading = false;
        //     setToast("error", action.payload?.message);
        //   }
        // );

        builder.addCase(updateAdminPassword.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(updateAdminPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.data?.status === true) {
                state.admin = action.payload.data?.data;
                setToast("success", "Admin password update successfully");
                window.location.href = "/";
            } else {
                setToast("error", action.payload.data.message);
            }
        });
        builder.addCase(updateAdminPassword.rejected, (state, action) => {
            state.isLoading = false;
            setToast("error", action.payload?.message);
        });
        builder.addCase(adminProfileUpdate.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(adminProfileUpdate.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(adminProfileUpdate.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(sendNotification.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(sendNotification.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.data.status) {
                toast.success(action?.payload?.data?.message);
            } else {
                toast.error(action?.payload?.data?.message);
            }
        });
        builder.addCase(sendNotification.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action?.payload?.data?.message);
        });
    },
});

export default adminSlice.reducer;
export const { logoutApi } = adminSlice.actions;
