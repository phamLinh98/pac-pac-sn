import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getStoryThunkFunction } from "./thunkFunctionStory";
import { addStory, removeStory } from "./reduxStory";
import {
    createStoryApi,
    deleteExpiredStoriesApi,
    deleteStoryApi,
} from "../api/restApiConfig";

export const useFacadeStory = () => {
    const { story, errorStory, loadingStory } = useSelector(state => state.reduxStory);
    const dispatch = useDispatch();

    const refetchStory = useCallback(() => {
        return dispatch(getStoryThunkFunction());
    }, [dispatch]);

    useEffect(() => {
        refetchStory();
    }, [refetchStory]);

    useEffect(() => {
        const activeStories = Array.isArray(story) ? story : [];
        const expirationTimes = activeStories
            .map((item) => {
                const explicitExpiration = item?.expires_at
                    ? new Date(item.expires_at).getTime()
                    : Number.NaN;

                if (Number.isFinite(explicitExpiration)) {
                    return explicitExpiration;
                }

                return new Date(item?.created_at).getTime() + 24 * 60 * 60 * 1000;
            })
            .filter(Number.isFinite);

        if (expirationTimes.length === 0) {
            return undefined;
        }

        const nextExpiration = Math.min(...expirationTimes);
        const delay = Math.max(0, nextExpiration - Date.now() + 1000);
        const timer = window.setTimeout(async () => {
            try {
                await deleteExpiredStoriesApi();
            } finally {
                refetchStory();
            }
        }, delay);

        return () => window.clearTimeout(timer);
    }, [story, refetchStory]);

    const createStory = useCallback(async (file) => {
        const payload = await createStoryApi(file);
        if (payload?.story) {
            dispatch(addStory(payload.story));
        }
        return payload;
    }, [dispatch]);

    const deleteStory = useCallback(async (storyId) => {
        const payload = await deleteStoryApi(storyId);
        dispatch(removeStory(storyId));
        return payload;
    }, [dispatch]);

    return {
        story,
        errorStory,
        loadingStory,
        createStory,
        deleteStory,
        refetchStory,
    }
}
