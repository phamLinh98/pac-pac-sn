import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getThunkMyProfileList } from "./thunkUserProfileStatus";
import { addListByUserId } from "./reduxUserFriendInProfile";

export const useFacadeMyProfileList = (id) => {
    const { listUserById, error, loading } = useSelector(state => state.reduxListUserByIdByProfile);
    const dispatch = useDispatch();
    const refetchProfilePosts = useCallback(() => {
        if (!Number.isFinite(id) || id <= 0) {
            return Promise.resolve();
        }

        return dispatch(getThunkMyProfileList(id));
    }, [dispatch, id]);

    const addProfilePost = useCallback((post) => {
        dispatch(addListByUserId(post));
    }, [dispatch]);

    useEffect(() => {
        refetchProfilePosts();
    }, [refetchProfilePosts]);

    return {
        listUserById,
        error,
        loading,
        refetchProfilePosts,
        addProfilePost,
    }
}
