import { configureStore } from "@reduxjs/toolkit";
import reduxList from '../reduxs/reduxListStatus';
import reduxStory from '../reduxs/reduxStory';
import reduxComment from '../reduxs/reduxComment';
import reduxListByUserId from '../reduxs/reduxListByUserId';
import reduxFriends from '../reduxs/reduxFriendListOnline';

export const store = configureStore({
    reducer: {
        reduxListStatus: reduxList, // store for List
        reduxListByUserId: reduxListByUserId,
        reduxStory: reduxStory ,// store for story
        reduxComment: reduxComment, // // store for story
        reduxFriends: reduxFriends // store for friend
    }
})