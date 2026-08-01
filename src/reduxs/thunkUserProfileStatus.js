import { getApiListUserStatus } from "../api/restApiConfig";
import {
  getListByUserId,
  eventLoading,
  logError,
} from "./reduxUserFriendInProfile";

const isPlainObject = (value) => {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
};

const firstObject = (...values) => {
  return values.find((value) => isPlainObject(value));
};

const firstArray = (...values) => {
  return values.find((value) => Array.isArray(value));
};

const getFirstUser = (payload) => {
  const data = payload?.data;
  const result = payload?.result;

  const directUser = firstObject(
    payload?.user,
    payload?.profileUser,
    payload?.profile,
    data?.user,
    data?.profileUser,
    data?.profile,
    result?.user,
    result?.profileUser,
    result?.profile,
  );

  if (directUser) {
    return directUser;
  }

  const userList = firstArray(
    payload?.user,
    payload?.users,
    data?.user,
    data?.users,
    result?.user,
    result?.users,
    payload,
    data,
    result,
  );

  if (userList) {
    return userList.find((item) => isPlainObject(item)) ?? null;
  }

  return isPlainObject(payload) ? payload : null;
};

const getPostList = (payload) => {
  return (
    firstArray(
      payload?.posts,
      payload?.postList,
      payload?.list,
      payload?.data?.posts,
      payload?.data?.postList,
      payload?.data?.list,
      payload?.result?.posts,
      payload?.result?.postList,
      payload?.result?.list,
      payload,
      payload?.data,
      payload?.result,
    ) ?? []
  );
};

const getJson = async (route) => {
  const response = await getApiListUserStatus(route);

  return response.json();
};

// Redux thunk cho list status
export const getThunkMyProfileList = (userId) => {
  return async (dispatch) => {
    dispatch(eventLoading(true));
    try {
      const [userResult, postResult] = await Promise.allSettled([
        getJson(`/user/${userId}`),
        getJson(`/list/${userId}`),
      ]);

      let profileUser =
        userResult.status === "fulfilled"
          ? getFirstUser(userResult.value)
          : null;

      let profilePosts =
        postResult.status === "fulfilled" ? getPostList(postResult.value) : [];

      if (!profileUser) {
        const fallbackPayload = await getJson(`/list-user/${userId}`);

        profileUser = getFirstUser(fallbackPayload);

        if (profilePosts.length === 0) {
          profilePosts = getPostList(fallbackPayload);
        }
      }

      if (!profileUser) {
        throw new Error("Người dùng không tồn tại");
      }

      dispatch(
        getListByUserId({
          user: profileUser,
          posts: profilePosts,
        }),
      );
    } catch (error) {
      console.log("error", error);
      dispatch(logError(error.message || "Không thể tải danh sách"));
    } finally {
      dispatch(eventLoading(false));
    }
  };
};
