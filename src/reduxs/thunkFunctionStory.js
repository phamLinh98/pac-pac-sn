import { getApi } from "../api/restApiConfig";
import { logError } from "./reduxListStatus";
import { getStory } from "./reduxStory";

// Redux thunk cho story
export const getStoryThunkFunction = () => async (dispatch) => {
    try {
        const data = await getApi('/story')
        const response = await data.json();
        dispatch(getStory(response));
    } catch (error) {
        dispatch(logError('Loi truy van story'));
    }
}