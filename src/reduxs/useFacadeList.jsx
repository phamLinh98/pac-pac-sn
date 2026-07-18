import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListThunkFunction } from "./thunkFunctionList";

export const useFacadeList = (id) => {
  const dispatch = useDispatch();

  const {
    listUserById,
    error,
    loading,
  } = useSelector((state) => state.reduxListByUserId);

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      return;
    }

    dispatch(getListThunkFunction(id));
  }, [dispatch, id]);

  return {
    list: listUserById,
    error,
    loading,
  };
};
