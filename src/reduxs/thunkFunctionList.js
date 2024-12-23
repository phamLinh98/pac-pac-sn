import { getApi } from "../api/restApiConfig";
import { getListStatus } from "./reduxListStatus";
import { logError } from "./reduxStory";

// Redux thunk cho list status 
export const getListThunkFunction = () => {
    return async (dispatch) => {
        //dispatch(eventLoading());
        try {
            const data = await getApi('/list');
            const response = await data.json();
            dispatch(getListStatus(response));

        } catch (error) {
            dispatch(logError(error))
        }
    }
};