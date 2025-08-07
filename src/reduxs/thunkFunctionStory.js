import { getApi } from "../api/restApiConfig";
import { getStory, eventLoading, logError } from "./reduxStory";

// Redux thunk cho story
export const getStoryThunkFunction = () => async (dispatch) => {
    dispatch(eventLoading(true));
    try {
        const data = await getApi('/story')
        const response = await data.json();
        dispatch(getStory(response)); // { type: name.reducers["getStory"], payload: response });
    } catch (error) {
        console.log('error', error);
        dispatch(logError(error.message || 'Lỗi truy vấn story'));
    } finally {
        dispatch(eventLoading(false));
    }
}