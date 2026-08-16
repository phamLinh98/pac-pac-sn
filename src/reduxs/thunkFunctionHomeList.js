import { getApi } from "../api/restApiConfig";

import {
  getListStatus,
  eventLoading,
  logError,
} from "./reduxListStatus";

export const getHomeListThunkFunction = (id, { reset = false } = {}) => {
  return async (dispatch, getState) => {
    const feed = getState().reduxListStatus;
    if (feed.loading || (!reset && !feed.hasMore)) return;
    dispatch(eventLoading(true));

    try {
      const response =
        await getApi(
          `/list/${id}?limit=10${!reset && feed.nextCursor ? `&cursor=${encodeURIComponent(feed.nextCursor)}` : ""}`
        );
      if (!response.ok) {
        throw new Error(
          `Không thể tải bảng tin: ${response.status}`
        );
      }

      const data =
        await response.json();

      dispatch(
        getListStatus({
          items: Array.isArray(data?.items) ? data.items : [],
          nextCursor: data?.nextCursor ?? null,
          hasMore: Boolean(data?.hasMore),
          reset,
        })
      );
    } catch (error) {
      console.error(
        "getHomeListThunkFunction error:",
        error
      );

      dispatch(
        logError(
          error instanceof Error
            ? error.message
            : "Không thể tải bảng tin"
        )
      );
    } finally {
      dispatch(
        eventLoading(false)
      );
    }
  };
};
