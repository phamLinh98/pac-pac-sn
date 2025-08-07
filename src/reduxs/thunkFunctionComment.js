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
        } catch (error) {
            console.log('error', error);
            dispatch(logError(error.message || 'Không thể tải bình luận'));
        } finally {
            dispatch(eventLoading(false));
        }
    }
};