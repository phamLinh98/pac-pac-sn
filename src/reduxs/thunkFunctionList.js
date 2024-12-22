import { getListStatus, logError } from "./reduxListStatus";
import { getStory } from "./reduxStory";

// Redux thunk cho list status 
export const getListThunkFunction = () => {
    return async (dispatch) => {
        //dispatch(eventLoading());
        try {
            const data = await fetch('http://localhost:4000/list');
            const response = await data.json();
            dispatch(getListStatus(response));

        } catch (error) {
            dispatch(logError(error))
        }
    }
};