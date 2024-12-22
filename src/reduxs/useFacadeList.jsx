import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListThunkFunction } from "./thunkFunctionList";

export const useFacadeList = () => {
    const { list, error, loading } = useSelector(state => state.reduxListStatus);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getListThunkFunction());
    }, [dispatch]);
    return {
        list,
        error,
        loading
    }
}