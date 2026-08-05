import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getThunkFriendList } from "./thunkFriendListOnline";

export const useFacadeFriendListOnline = (userId) => {
    const { listFriendListOnline, error, loading } = useSelector(state => state.reduxFriends);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getThunkFriendList(userId));
    }, [userId, dispatch]);

    return {
        listFriendListOnline,
        error,
        loading
    }
}
