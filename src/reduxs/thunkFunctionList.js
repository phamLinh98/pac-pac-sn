import { getApi } from "../api/restApiConfig";

import {
  getListByUserId,
  eventLoading,
  logError,
} from "./reduxListByUserId";

export const getListThunkFunction = (id) => {
  return async (dispatch) => {
    dispatch(eventLoading(true));

    try {
      const response =
        await getApi(`/list/${id}`);

      if (!response.ok) {
        throw new Error(
          `Không thể tải dữ liệu: ${response.status}`
        );
      }

      const data =
        await response.json();

      dispatch(
        getListByUserId(data)
      );
    } catch (error) {
      console.error(
        "getListThunkFunction error:",
        error
      );

      dispatch(
        logError(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu"
        )
      );
    } finally {
      dispatch(
        eventLoading(false)
      );
    }
  };
};
