import { getApi } from "../api/restApiConfig";
import { eventLoading, getListStatus } from "./reduxListStatus";
import { logError } from "./reduxStory";

// Redux thunk cho list status 
export const getListThunkFunction = () => {
    return async (dispatch) => {
        dispatch(eventLoading(true));
        try {
            const data = await getApi('/list');
            const response = await data.json();
            dispatch(getListStatus(response));
            dispatch(eventLoading(false));

        } catch (error) {
            dispatch(logError(error))
        }
    }
};