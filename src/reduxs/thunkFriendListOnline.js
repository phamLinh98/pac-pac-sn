import { getApi } from "../api/restApiConfig";
import {getFriendListOnline} from './reduxFriendListOnline';

// Redux thunk cho list status 
export const getThunkFriendList = (userId) => {
    return async (dispatch) => {
        try {
            const data = await getApi(`/user/${userId}`);
            const response = await data.json();
            dispatch(getFriendListOnline(response));
            dispatch(eventLoading(false));
        } catch (error) {
            console.log('error', error);
        }
    }
};