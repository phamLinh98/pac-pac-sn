import { getApi } from "../api/restApiConfig";
import { getCommentStatus, eventLoading, logError } from "./reduxComment";

// Redux thunk cho list status 
export const getCommentThunkFunction = (listId) => {
    return async (dispatch) => {
        dispatch(eventLoading(true));
        try {
            const data = await getApi(`/comment/${listId}`);
            const response = await data.json();
            dispatch(getCommentStatus(response));
            dispatch(eventLoading(false));
        } catch (error) {
            console.log('error', error)
        }
    }
};