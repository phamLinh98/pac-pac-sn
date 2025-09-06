import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListThunkFunction } from "./thunkFunctionList";

export const useFacadeList = (id) => {
    const { list, error, loading } = useSelector(state => state.reduxListStatus);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getListThunkFunction(id));
    }, [dispatch,id]);
    return {
        list,
        error,
        loading
    }
}