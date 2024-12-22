import { getStory, logError } from "./reduxStory";

// Redux thunk cho story
export const getStoryThunkFunction = () => async (dispatch) => {
    try {
        const data = await fetch('http://localhost:4000/story');
        const response = await data.json();
        dispatch(getStory(response));
    } catch (error) {
        dispatch(logError(error));
    }
}