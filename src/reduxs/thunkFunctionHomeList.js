import { getApi } from "../api/restApiConfig";

import {
  getListStatus,
  eventLoading,
  logError,
} from "./reduxListStatus";

export const getHomeListThunkFunction = (id) => {
  return async (dispatch) => {
    dispatch(eventLoading(true));

    try {
      const response =
        await getApi(`/list/${id}`);
      if (!response.ok) {
        throw new Error(
          `Không thể tải bảng tin: ${response.status}`
        );
      }

      const data =
        await response.json();

      dispatch(
        getListStatus(data)
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
