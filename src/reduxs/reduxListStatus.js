import { createSlice } from "@reduxjs/toolkit";

export const List = createSlice({
    name: "List",
    initialState: { list: [], error: '', loading: false },
    reducers: {
        getListStatus: (state, action) => {
            state.list = action.payload;
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

export const { getListStatus, logError, eventLoading } = List.actions;
export default List.reducer;