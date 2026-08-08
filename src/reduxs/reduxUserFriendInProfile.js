import { createSlice } from "@reduxjs/toolkit";

export const ListUserById = createSlice({
    name: "ListByUserId",
    initialState: {
        listUserById: [],
        error: '',
        loading: false,
        requestedUserId: null,
        loadedUserId: null,
    },
    reducers: {
        getListByUserId: (state, action) => {
            const { userId, posts } = action.payload;
            if (state.requestedUserId !== userId) {
                return;
            }
            state.listUserById = posts;
            state.loadedUserId = userId;
            state.loading = false;
            state.error = '';
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
            const { userId, error } = action.payload;
            if (state.requestedUserId !== userId) {
                return;
            }
            state.error = error;
            state.loading = false;
        },
        eventLoading: (state, action) => {
            const userId = action.payload;
            state.requestedUserId = userId;
            state.listUserById = [];
            state.loadedUserId = null;
            state.error = '';
            state.loading = true;
        }
    }
})

export const { getListByUserId, addListByUserId, logError, eventLoading } = ListUserById.actions;
export default ListUserById.reducer;
