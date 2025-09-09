import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const getDialogDataGet = typeof window !== 'undefined' && localStorage.getItem("dialog")
const getDialogData = getDialogDataGet && JSON.parse(getDialogDataGet)



const dialogSlice = createSlice({
    name: "dialogue",
    initialState : {
        dialogue: getDialogData?.dialogue || false,
        dialogueType: getDialogData?.dialogueType || "",
        dialogueData: getDialogData?.dialogueData || null,
        alertBox: false,
        isLoading: false,
    },
    reducers: {
        setDialogInitialState: (state, action) => {
            return { ...state, ...action.payload };
        },
        openDialog(state, action) {
            
            
            state.dialogue = true;
            state.dialogueType = action.payload.type || "";
            state.dialogueData = action.payload.data || null;
        },
        closeDialog(state) {
            state.dialogue = false;
            state.dialogueType = "";
            state.dialogueData = null;
            localStorage.removeItem("dialogue");
        },
        openAlert(state) {
            state.alertBox = true;
        },
        closeAlert(state) {
            state.alertBox = false;
        },
        loaderOn(state) {
            state.isLoading = true;
        },
        loaderOff(state) {
            state.isLoading = false;
        },
    },
});
export default dialogSlice.reducer;
export const {
    openDialog,
    closeDialog,
    openAlert,
    closeAlert,
    loaderOn,
    loaderOff,
    setDialogInitialState,
} = dialogSlice.actions;
