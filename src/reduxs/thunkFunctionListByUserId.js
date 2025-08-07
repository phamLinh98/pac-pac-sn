import { getApi } from "../api/restApiConfig";
import { eventLoading, getListByUserId, logError } from "./reduxListByUserId";

// Redux thunk cho list status 
export const getListByUserIdThunk = (userId) => {
    return async (dispatch) => {
        dispatch(eventLoading(true));
        try {
            const data = await getApi(`/list/${userId}`);
            const response = await data.json();
            dispatch(getListByUserId(response));
        } catch (error) {
            console.log('error', error);
            dispatch(logError(error.message || 'Không thể tải dữ liệu người dùng'));
        } finally {
            dispatch(eventLoading(false));
        }
    }
};