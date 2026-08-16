import { createSlice } from "@reduxjs/toolkit";

export const List = createSlice({
    name: "List",
    initialState: {
        list: [], error: '', loading: false, hasLoaded: false,
        nextCursor: null, hasMore: true,
    },
    reducers: {
        getListStatus: (state, action) => {
            const { items = [], nextCursor = null, hasMore = false, reset = false } = action.payload ?? {};
            const current = reset ? [] : state.list;
            const knownIds = new Set(current.map((item) => item.id));
            state.list = [...current, ...items.filter((item) => !knownIds.has(item.id))];
            state.nextCursor = nextCursor;
            state.hasMore = hasMore;
            state.loading = false;
            state.hasLoaded = true;
            state.error = "";
        },
        addListStatus: (state, action) => {
            if (!Array.isArray(state.list)) {
                state.list = [];
            }

            state.list.unshift(action.payload);
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
            if (action.payload === true && !state.hasLoaded) {
                state.hasLoaded = false;
                state.error = "";
            }
        }
    }
})

export const { getListStatus, addListStatus, logError, eventLoading } = List.actions;
export default List.reducer;
