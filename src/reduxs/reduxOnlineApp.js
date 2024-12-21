import { createSlice } from "@reduxjs/toolkit";

export const OnlineAppSlice = createSlice({
    name: "OnlineAppSlice",
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
        eventLoading: (state, action) => {
            state.loading = true;
        }
    }
})

export const { getListStatus, logError, eventLoading } = OnlineAppSlice.actions;
export default OnlineAppSlice.reducer;