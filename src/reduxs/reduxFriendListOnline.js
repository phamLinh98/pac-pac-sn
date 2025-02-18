import { createSlice } from "@reduxjs/toolkit";

export const FriendListOnline = createSlice({
    name: "FriendListOnline",
    initialState: { listFriendListOnline: [], error: '', loading: false },  // Changed name here
    reducers: {
        getFriendListOnline: (state, action) => {
            state.listFriendListOnline = action.payload; // Use the new name here
            state.loading = false;
        },
        logError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        eventLoading: (state,action) => {
            state.loading = action.payload;
        }
    }
})

export const { getFriendListOnline, logError, eventLoading } = FriendListOnline.actions;
export default FriendListOnline.reducer;