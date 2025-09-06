import { getApi } from "../api/restApiConfig";
import { eventLoading, getListStatus } from "./reduxListStatus";
import { logError } from "./reduxStory";

// Redux thunk cho list status 
export const getListThunkFunction = (id) => {
    return async (dispatch) => {
        dispatch(eventLoading(true));
        try {
            const data = await getApi(`/list/${id}`);
            const response = await data.json();
            dispatch(getListStatus(response));
        } catch (error) {
            console.log('error', error);
            dispatch(logError(error.message || 'Không thể tải dữ liệu'));
        } finally {
            dispatch(eventLoading(false));
        }
    }
};