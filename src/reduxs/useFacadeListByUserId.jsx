import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListByUserIdThunk } from "./thunkFunctionListByUserId.js";

export const useFacadeListByUserId = (userId) => {
    const { listUserById, error, loading } = useSelector(state => state.reduxListByUserId);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getListByUserIdThunk(userId));
    }, [dispatch, userId, getListByUserIdThunk]);
    return {
        listUserById,
        error,
        loading
    }
}