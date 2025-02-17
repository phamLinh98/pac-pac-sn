import { createSlice } from "@reduxjs/toolkit";

export const FriendListOnline = createSlice({
    name: "FriendListOnline",
    initialState: { friendListOnline: [], error: '', loading: false },
    reducers: {
        getFriendListOnline: (state, action) => {
            state.friendListOnline = action.payload;
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