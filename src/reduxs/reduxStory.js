import { createSlice } from "@reduxjs/toolkit";

export const Story = createSlice({
    name: "Story",
    initialState: { story: [], errorStory: '', loadingStory: false },
    reducers: {
        getStory: (state, action) => {
            state.story = action.payload;
            state.loadingStory = false;
        },
        logError: (state, action) => {
            state.errorStory = action.payload;
            state.loadingStory = false;
        },
        eventLoading: (state) => {
            state.loadingStory = true;
        }
    }
})

export const { getStory, logError, eventLoading } = Story.actions;
export default Story.reducer;