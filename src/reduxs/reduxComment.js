import { createSlice } from "@reduxjs/toolkit";

export const Comment = createSlice({
    name: "Comment",
    initialState: { listComment: [], error: '', loading: false },
    reducers: {
        getCommentStatus: (state, action) => {
            state.listComment = action.payload;
            state.loading = false;
        },
        addComment: (state, action) => {
            state.listComment.unshift(action.payload); // Thêm comment mới vào đầu danh sách
            state.loading = false;
        },
        logError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        eventLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})

export const { getCommentStatus, addComment, logError, eventLoading } = Comment.actions;
export default Comment.reducer;