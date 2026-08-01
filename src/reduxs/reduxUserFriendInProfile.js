import { createSlice } from "@reduxjs/toolkit";

export const ListUserById = createSlice({
    name: "ListByUserId",
    initialState: { listUserById: [], error: '', loading: false },
    reducers: {
        getListByUserId: (state, action) => {
            state.listUserById = action.payload;
            state.loading = false;
        },
        addListByUserId: (state, action) => {
            if (!Array.isArray(state.listUserById)) {
                state.listUserById = [];
            }

            state.listUserById.unshift(action.payload);
            state.loading = false;
            state.error = "";
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

export const { getListByUserId, addListByUserId, logError, eventLoading } = ListUserById.actions;
export default ListUserById.reducer;
