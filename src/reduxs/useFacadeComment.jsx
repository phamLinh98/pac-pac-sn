import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommentThunkFunction } from "./thunkFunctionComment";

export const useFacadeComment = (listId) => {
    const { listComment, error, loading } = useSelector(state => state.reduxComment);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCommentThunkFunction(listId));
    }, [dispatch]);
    return {
        listComment,
        error,
        loading
    }
}