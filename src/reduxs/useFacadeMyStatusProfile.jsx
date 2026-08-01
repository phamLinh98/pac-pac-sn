import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getThunkMyProfileList } from "./thunkUserProfileStatus";

export const useFacadeMyProfileList = (id) => {
    const { listUserById, error, loading } = useSelector(state => state.reduxListUserByIdByProfile);
    const dispatch = useDispatch();

    const refetchProfilePosts = useCallback(() => {
        if (!Number.isFinite(id) || id <= 0) {
            return;
        }

        dispatch(getThunkMyProfileList(id));
    }, [dispatch, id]);

    //console.log("listFacadeMyProfile", listUserById);
    useEffect(() => {
        refetchProfilePosts();
    }, [refetchProfilePosts]);

    return {
        listUserById,
        error,
        loading,
        refetchProfilePosts
    }
}
