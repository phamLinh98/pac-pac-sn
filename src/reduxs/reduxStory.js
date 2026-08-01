import { createSlice } from "@reduxjs/toolkit";

export const Story = createSlice({
    name: "Story",
    initialState: { story: [], errorStory: '', loadingStory: false },
    reducers: {
        getStory: (state, action) => {
            state.story = action.payload;//123
            state.loadingStory = false;
        },
        addStory: (state, action) => {
            if (!Array.isArray(state.story)) {
                state.story = [];
            }
            state.story.unshift(action.payload);
        },
        removeStory: (state, action) => {
            state.story = Array.isArray(state.story)
                ? state.story.filter((item) => Number(item.id) !== Number(action.payload))
                : [];
        },
        logError: (state, action) => {
            state.errorStory = action.payload;
            state.loadingStory = false;
        },
        eventLoading: (state, action) => {
            state.loadingStory = action.payload;
        }
    }
})

export const { getStory, addStory, removeStory, logError, eventLoading } = Story.actions;
export default Story.reducer;
