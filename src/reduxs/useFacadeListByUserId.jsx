import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListByUserIdThunk } from "./thunkFunctionListByUserId";

export const useFacadeListByUserId = (userId) => {
    const { listUserById, error, loading } = useSelector(state => state.reduxListByUserId);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getListByUserIdThunk(userId))
    }, [userId, dispatch, getListByUserIdThunk]);
    return {
        listUserById,
        error,
        loading
    }
}