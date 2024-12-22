import { configureStore } from "@reduxjs/toolkit";
import reduxList from '../reduxs/reduxListStatus';
import reduxStory from '../reduxs/reduxStory';

export const store = configureStore({
    reducer: {
        reduxListStatus: reduxList,
        reduxStory: reduxStory
    }
})