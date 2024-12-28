import { configureStore } from "@reduxjs/toolkit";
import reduxList from '../reduxs/reduxListStatus';
import reduxStory from '../reduxs/reduxStory';
import reduxComment from '../reduxs/reduxComment';

export const store = configureStore({
    reducer: {
        reduxListStatus: reduxList, // store for List
        reduxStory: reduxStory ,// store for story
        reduxComment: reduxComment // // store for story
    }
})