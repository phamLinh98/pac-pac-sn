import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import { getHomeListThunkFunction } from "./thunkFunctionHomeList";

export const useFacadeHomeList = (id) => {
  const dispatch = useDispatch();

  const {
    list,
    error,
    loading,
    hasLoaded,
  } = useSelector(
    (state) => state.reduxListStatus
  );

  useEffect(() => {
    if (
      !Number.isFinite(id) ||
      id <= 0
    ) {
      return;
    }

    dispatch(
      getHomeListThunkFunction(id)
    );
  }, [dispatch, id]);

  return {
    list,
    error,
    loading,
    hasLoaded,
  };
};
