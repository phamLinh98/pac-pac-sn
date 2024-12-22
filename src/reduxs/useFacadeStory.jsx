import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getStoryThunkFunction } from "./thunkFunctionStory";

export const useFacadeStory = () => {
    const { story, errorStory, loadingStory } = useSelector(state => state.reduxStory);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getStoryThunkFunction());
    }, [dispatch])

    return {
        story,
        errorStory,
        loadingStory
    }
}