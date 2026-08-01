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

const normalizeId = (value) => {
  const normalizedValue = Number(value);

  return Number.isFinite(normalizedValue) ? normalizedValue : null;
};

const isSameUserId = (value, userId) => {
  return normalizeId(value) === normalizeId(userId);
};

const isUserLikeRecord = (value) => {
  if (!isPlainObject(value)) {
    return false;
  }

  return Boolean(
    value.name ||
      value.user_name ||
      value.email ||
      value.avatar ||
      value.background ||
      value.background_image ||
      Array.isArray(value.list_friend_id),
  );
};

const findUserById = (values, userId) => {
  return values
    .filter(isUserLikeRecord)
    .find((item) => {
      if (item.name || item.email || item.namecode) {
        return isSameUserId(item.id, userId);
      }

      return isSameUserId(item.user_id, userId);
    });
};

const getFirstUser = (payload, userId) => {
  const data = payload?.data;
  const result = payload?.result;

  const directUserCandidates = [
    payload?.user,
    payload?.profileUser,
    payload?.profile,
    data?.user,
    data?.profileUser,
    data?.profile,
    result?.user,
    result?.profileUser,
    result?.profile,
  ];

  const matchedDirectUser = findUserById(directUserCandidates, userId);

  if (matchedDirectUser) {
    return matchedDirectUser;
  }

  const directUser = firstObject(...directUserCandidates);

  if (
    directUser &&
    isUserLikeRecord(directUser) &&
    findUserById([directUser], userId)
  ) {
    return directUser;
  }

  const userListCandidates = [
    payload?.user,
    payload?.users,
    data?.user,
    data?.users,
    result?.user,
    result?.users,
    payload,
    data,
    result,
  ];

  const userList = firstArray(...userListCandidates);

  if (userList) {
    return findUserById(userList, userId) ?? null;
  }

  if (
    isUserLikeRecord(payload) &&
    findUserById([payload], userId)
  ) {
    return payload;
  }

  return null;
};

const getPostList = (payload, userId) => {
  const postList =
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
    ) ?? [];

  return postList.filter((item) => {
    if (!isPlainObject(item)) {
      return false;
    }

    const postUserId = item.user_id ?? item.userId ?? item.owner_id;

    if (postUserId === undefined || postUserId === null) {
      return true;
    }

    return isSameUserId(postUserId, userId);
  });
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
      const [profileResult, postResult] = await Promise.allSettled([
        getJson(`/list-user/${userId}`),
        getJson(`/list/${userId}`),
      ]);

      let profileUser =
        profileResult.status === "fulfilled"
          ? getFirstUser(profileResult.value, userId)
          : null;

      let profilePosts =
        postResult.status === "fulfilled"
          ? getPostList(postResult.value, userId)
          : [];

      if (profilePosts.length === 0 && profileResult.status === "fulfilled") {
        profilePosts = getPostList(profileResult.value, userId);
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
