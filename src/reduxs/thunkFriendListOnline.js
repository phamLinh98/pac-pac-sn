import { getApi } from "../api/restApiConfig";
import {getFriendListOnline, eventLoading, logError} from './reduxFriendListOnline';

// Redux thunk cho list status 
export const getThunkFriendList = (userId) => {
    return async (dispatch) => {
        dispatch(eventLoading(true));
        try {
            const data = await getApi(`/user/${userId}`);
            const response = await data.json();
            dispatch(getFriendListOnline(response));
        } catch (error) {
            console.log('error', error);
            dispatch(logError(error.message || 'Không thể tải danh sách bạn bè'));
        } finally {
            dispatch(eventLoading(false));
        }
    }
};