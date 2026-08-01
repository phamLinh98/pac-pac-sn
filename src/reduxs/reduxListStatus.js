import { createSlice } from "@reduxjs/toolkit";

export const List = createSlice({
    name: "List",
    initialState: { list: [], error: '', loading: false, hasLoaded: false },
    reducers: {
        getListStatus: (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.hasLoaded = true;
            state.error = "";
        },
        logError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.hasLoaded = true;
        },
        eventLoading: (state,action) => {
            state.loading = action.payload;
            if (action.payload === true) {
                state.hasLoaded = false;
                state.error = "";
            }
        }
    }
})

export const { getListStatus, logError, eventLoading } = List.actions;
export default List.reducer;
