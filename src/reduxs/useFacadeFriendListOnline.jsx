import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendListOnlineThunk } from "./thunkFriendListOnline";

export const useFacadeFriendListOnline = (userId) => {
    const { listFriendListOnline, error, loading } = useSelector(state => state.reduxFriendListOnline);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriendListOnlineThunk(userId));
    }, [userId, dispatch, getFriendListOnlineThunk]);

    return {
        listFriendListOnline,
        error,
        loading
    }
}