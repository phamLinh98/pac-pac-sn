import { getApi } from "../api/restApiConfig";
import { getCommentStatus, eventLoading } from "./reduxComment";

// Redux thunk cho list status 
export const getCommentThunkFunction = (listId) => {
    return async (dispatch) => {
        //dispatch(eventLoading());
        try {
            dispatch(eventLoading(true))
            const data = await getApi(`/comment/${listId}`);
            const response = await data.json();
            dispatch(getCommentStatus(response));
            dispatch(eventLoading(false))
        } catch (error) {
            dispatch(logError(error))
        }
    }
};