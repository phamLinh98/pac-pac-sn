import { getApiListUserStatus } from "../api/restApiConfig";
import {
  getListByUserId,
  eventLoading,
  logError,
} from "./reduxUserFriendInProfile";

// Redux thunk cho list status
export const getThunkMyProfileList = (userId) => {
  return async (dispatch) => {
    dispatch(eventLoading(true));
    try {
      const data = await getApiListUserStatus(`/list-user/${userId}`);
      const response = await data.json();
      dispatch(getListByUserId(response));
    } catch (error) {
      console.log("error", error);
      dispatch(logError(error.message || "Không thể tải danh sách"));
    } finally {
      dispatch(eventLoading(false));
    }
  };
};
