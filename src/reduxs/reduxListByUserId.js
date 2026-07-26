import { createSlice } from "@reduxjs/toolkit";

export const List = createSlice({
  name: "ListByUserId",

  initialState: {
    listUserById: [],
    error: "",
    loading: false,
    hasLoaded: false,
  },

  reducers: {
    getListByUserId: (state, action) => {
      state.listUserById = action.payload;
      state.loading = false;
      state.hasLoaded = true;
      state.error = "";
    },

    logError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.hasLoaded = true;
    },

    eventLoading: (state, action) => {
      state.loading = action.payload;

      if (action.payload === true) {
        state.hasLoaded = false;
        state.error = "";
      }
    },
  },
});

export const {
  getListByUserId,
  logError,
  eventLoading,
} = List.actions;

export default List.reducer;
