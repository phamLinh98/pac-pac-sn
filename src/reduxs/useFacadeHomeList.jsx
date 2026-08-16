import { useCallback, useEffect } from "react";
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
    hasMore,
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
      getHomeListThunkFunction(id, { reset: true })
    );
  }, [dispatch, id]);

  const loadMore = useCallback(() => {
    if (Number.isFinite(id) && id > 0 && hasMore && !loading) {
      dispatch(getHomeListThunkFunction(id));
    }
  }, [dispatch, hasMore, id, loading]);

  return {
    list,
    error,
    loading,
    hasLoaded,
    hasMore,
    loadMore,
  };
};
