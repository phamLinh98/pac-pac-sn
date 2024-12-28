import { getApi } from "../api/restApiConfig";
import { getCommentStatus } from "./reduxComment";

// Redux thunk cho list status 
export const getCommentThunkFunction = (listId) => {
    return async (dispatch) => {
        //dispatch(eventLoading());
        try {
            const data = await getApi(`/comment/${listId}`);
            const response = await data.json();
            dispatch(getCommentStatus(response));

        } catch (error) {
            dispatch(logError(error))
        }
    }
};