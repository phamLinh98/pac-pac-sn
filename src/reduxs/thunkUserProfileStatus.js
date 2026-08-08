import { getApiListUserStatus } from "../api/restApiConfig";
import {
  getListByUserId,
  eventLoading,
  logError,
} from "./reduxUserFriendInProfile";

// Redux thunk cho list status
export const getThunkMyProfileList = (userId) => {
  return async (dispatch) => {
    dispatch(eventLoading(userId));
    try {
      const data = await getApiListUserStatus(`/list-user/${userId}`);
      const response = await data.json();
      dispatch(getListByUserId({ userId, posts: response }));
    } catch (error) {
      console.log("error", error);
      dispatch(logError({
        userId,
        error: error.message || "Không thể tải danh sách",
      }));
    }
  };
};
