import { getApi } from "../api/restApiConfig.js";
import { eventLoading, getListByUserId, logError } from "./reduxListByUserId";

// Redux thunk cho list status 
export const getListByUserIdThunk = (userId) => {
    return async (dispatch) => {
        dispatch(eventLoading(true));
        try {
            const data = await getApi(`/list/${userId}`);
            const response = await data.json();
            dispatch(getListByUserId(response));
            dispatch(eventLoading(false));

        } catch (error) {
            dispatch(logError(error.message))
        }
    }
};