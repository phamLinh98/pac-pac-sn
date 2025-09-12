import { createSlice } from "@reduxjs/toolkit";

export const ListUserById = createSlice({
    name: "ListByUserId",
    initialState: { listUserById: [], error: '', loading: false },
    reducers: {
        getListByUserId: (state, action) => {
            state.listUserById = action.payload;
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

export const { getListByUserId, logError, eventLoading } = ListUserById.actions;
export default ListUserById.reducer;