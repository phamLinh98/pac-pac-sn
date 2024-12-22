import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getListThunkFunction } from "./thunkFunctionOnlineApp";

export const useFacadeOnlineApp = () => {
    const { list, error, loading } = useSelector(state => state.onlineApp);
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