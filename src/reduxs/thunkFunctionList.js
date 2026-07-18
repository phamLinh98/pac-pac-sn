import { getApi } from "../api/restApiConfig";
import { logError } from "./reduxStory";
import { getListByUserId, eventLoading } from "./reduxListByUserId";

// Redux thunk cho list status
export const getListThunkFunction = (id) => {
    return async (dispatch) => {
        dispatch(eventLoading(true));
        try {
            const data = await getApi(`/list/${id}`);
            const response = await data.json();
            dispatch(getListByUserId(response));
        } catch (error) {
            console.log('error', error);
            dispatch(logError(error.message || 'Không thể tải dữ liệu'));
        } finally {
            dispatch(eventLoading(false));
        }
    }
};
