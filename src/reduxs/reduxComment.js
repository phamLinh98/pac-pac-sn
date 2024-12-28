import { createSlice } from "@reduxjs/toolkit";

export const Comment = createSlice({
    name: "Comment",
    initialState: { listComment: [], error: '', loading: false },
    reducers: {
        getCommentStatus: (state, action) => {
            state.listComment = action.payload;
            state.loading = false;
        },
        logError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        eventLoading: (state) => {
            state.loading = true;
        }
    }
})

export const { getCommentStatus, logError, eventLoading } = Comment.actions;
export default Comment.reducer;