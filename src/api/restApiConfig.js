import { envConfig } from "../configs/envConfig";

/*
 * =========================================================
 * Helpers
 * =========================================================
 */

const readErrorResponse = async (response) => {
  const contentType =
    response.headers.get("content-type");

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    try {
      const errorData =
        await response.json();

      return (
        errorData?.message ||
        errorData?.error ||
        JSON.stringify(errorData)
      );
    } catch {
      return `HTTP error: ${response.status}`;
    }
  }

  try {
    return await response.text();
  } catch {
    return `HTTP error: ${response.status}`;
  }
};

/**
 * Gọi refresh token.
 *
 * Backend hiện tại của bạn đang sử dụng route:
 * /refesh-token
 *
 * Chú ý: tên này đang bị thiếu chữ "r"
 * nhưng phải giữ nguyên nếu backend cũng đang dùng tên đó.
 */
const refreshAccessToken = async () => {
  const refreshResponse = await fetch(
    `${envConfig.host}/refesh-token`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
    }
  );

  if (!refreshResponse.ok) {
    const errorMessage =
      await readErrorResponse(
        refreshResponse
      );

    throw new Error(
      errorMessage ||
        "Refresh token failed"
    );
  }

  return refreshResponse;
};

/**
 * Kiểm tra status xác thực.
 */
const isAuthenticationError = (
  response
) => {
  return (
    response.status === 401 ||
    response.status === 402
  );
};

/*
 * =========================================================
 * Common GET API
 * =========================================================
 */

export const getApi = async (
  route
) => {
  try {
    const url =
      `${envConfig.host}${route}`;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
    };

    let response = await fetch(
      url,
      requestOptions
    );

    if (
      !response.ok &&
      isAuthenticationError(response)
    ) {
      await refreshAccessToken();

      /*
       * Thực hiện lại request ban đầu
       * sau khi refresh thành công.
       */
      response = await fetch(
        url,
        requestOptions
      );
    }

    if (!response.ok) {
      const errorMessage =
        await readErrorResponse(
          response
        );

      throw new Error(
        errorMessage ||
          `Request failed: ${response.status}`
      );
    }

    return response;
  } catch (error) {
    console.error(
      "GET API error:",
      error
    );

    throw error;
  }
};

/*
 * =========================================================
 * Authentication
 * =========================================================
 */

export const loginByEmailAndPassword =
  async (email, password) => {
    try {
      const url =
        `${envConfig.host}/login`;

      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage =
          await readErrorResponse(
            response
          );

        throw new Error(
          errorMessage ||
            `Đăng nhập thất bại: ${response.status}`
        );
      }

      const responseData =
        await response.json();

      if (!responseData?.token) {
        throw new Error(
          "Backend không trả về access token."
        );
      }

      localStorage.setItem(
        "allow-login",
        responseData.token
      );

      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Đăng nhập thất bại.",
      };
    }
  };

export const refeshTokenWhenExpired =
  async (route) => {
    try {
      const url =
        `${envConfig.host}${route}`;

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        credentials: "include",
      };

      let response = await fetch(
        url,
        requestOptions
      );

      if (
        !response.ok &&
        isAuthenticationError(response)
      ) {
        await refreshAccessToken();

        response = await fetch(
          url,
          requestOptions
        );
      }

      if (!response.ok) {
        const errorMessage =
          await readErrorResponse(
            response
          );

        throw new Error(
          errorMessage ||
            `HTTP error: ${response.status}`
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Refresh token request error:",
        error
      );

      throw error;
    }
  };

export const logoutClearToken =
  async (route) => {
    try {
      const url =
        `${envConfig.host}${route}`;

      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorMessage =
          await readErrorResponse(
            response
          );

        throw new Error(
          errorMessage ||
            `Đăng xuất thất bại: ${response.status}`
        );
      }

      localStorage.removeItem(
        "allow-login"
      );

      return response;
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      throw error;
    }
  };

/*
 * =========================================================
 * User
 * =========================================================
 */

export const updateUserImageApi =
  async (avatarURL, id) => {
    try {
      const url =
        `${envConfig.host}/user/${id}`;

      const response = await fetch(
        url,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            avatar: avatarURL,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorMessage =
          await readErrorResponse(
            response
          );

        throw new Error(
          errorMessage ||
            `Cập nhật ảnh thất bại: ${response.status}`
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Update user image error:",
        error
      );

      throw error;
    }
  };

export const getProfileMediaApi = async () => {
  const response = await getApi('/profile-media');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const updateProfileImageApi = async ({ imageType, file, imageKey }) => {
  const formData = new FormData();
  formData.append('imageType', imageType);
  if (file instanceof File) formData.append('image', file);
  if (imageKey) formData.append('imageKey', imageKey);

  const requestOptions = { method: 'PUT', credentials: 'include', body: formData };
  let response = await fetch(`${envConfig.host}/profile-image`, requestOptions);
  if (!response.ok && isAuthenticationError(response)) {
    await refreshAccessToken();
    response = await fetch(`${envConfig.host}/profile-image`, requestOptions);
  }
  if (!response.ok) throw new Error(await readErrorResponse(response));
  return response.json();
};

export const createNewUser =
  async (info) => {
    try {
      const url =
        `${envConfig.host}/register`;

      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: info.name,
            email: info.email,
            password: info.password,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorMessage =
          await readErrorResponse(
            response
          );

        throw new Error(
          errorMessage ||
            `Đăng ký thất bại: ${response.status}`
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Create user error:",
        error
      );

      throw error;
    }
  };

export const sendFriendRequestApi =
  async (userIdFirst, userIdSecond) => {
    try {
      const url =
        `${envConfig.host}/send-friend-request`;

      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userIdFirst,
            userIdSecond,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorMessage =
          await readErrorResponse(
            response
          );

        throw new Error(
          errorMessage ||
            `Không thể gửi lời mời kết bạn: ${response.status}`
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Send friend request error:",
        error
      );

      throw error;
    }
  };

export const getFriendRequestsApi =
  async (userId) => {
    return getApi(`/send-friend/${userId}`);
  };

export const searchUsersApi = async (keyword) => {
  const normalizedKeyword = String(keyword ?? "").trim();

  if (!normalizedKeyword) {
    return [];
  }

  const response = await getApi(
    `/search-user?q=${encodeURIComponent(normalizedKeyword)}`
  );

  const payload = await response.json().catch(() => []);
  return Array.isArray(payload) ? payload : [];
};

export const cancelFriendshipApi = async (friendId) => {
  const url = `${envConfig.host}/friendship/${friendId}`;
  const requestOptions = {
    method: "DELETE",
    credentials: "include",
  };

  let response = await fetch(url, requestOptions);

  if (!response.ok && isAuthenticationError(response)) {
    await refreshAccessToken();
    response = await fetch(url, requestOptions);
  }

  if (!response.ok) {
    throw new Error(
      (await readErrorResponse(response)) ||
        `Không thể hủy kết bạn: ${response.status}`
    );
  }

  return response.json();
};

export const cancelFriendRequestApi = async (receiverId) => {
  const url = `${envConfig.host}/friend-request/${receiverId}`;
  const requestOptions = {
    method: "DELETE",
    credentials: "include",
  };

  let response = await fetch(url, requestOptions);

  if (!response.ok && isAuthenticationError(response)) {
    await refreshAccessToken();
    response = await fetch(url, requestOptions);
  }

  if (!response.ok) {
    throw new Error(
      (await readErrorResponse(response)) ||
        `Không thể hủy yêu cầu kết bạn: ${response.status}`
    );
  }

  return response.json();
};

export const createStoryApi = async (file) => {
  if (!(file instanceof File)) {
    throw new Error("Ảnh story không hợp lệ.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const requestOptions = {
    method: "POST",
    credentials: "include",
    body: formData,
  };

  let response = await fetch(`${envConfig.host}/story`, requestOptions);

  if (!response.ok && isAuthenticationError(response)) {
    await refreshAccessToken();
    response = await fetch(`${envConfig.host}/story`, requestOptions);
  }

  if (!response.ok) {
    throw new Error(await readErrorResponse(response));
  }

  return response.json();
};

export const deleteStoryApi = async (storyId) => {
  const response = await fetch(`${envConfig.host}/story/${storyId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readErrorResponse(response));
  }

  return response.json();
};

export const deleteExpiredStoriesApi = async () => {
  const response = await fetch(`${envConfig.host}/story/expired`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readErrorResponse(response));
  }

  return response.json();
};

/*
 * =========================================================
 * Profile status
 * =========================================================
 */

export const getApiListUserStatus =
  async (route) => {
    try {
      const url =
        `${envConfig.host}${route}`;

      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type":
            "application/json",
        },
        credentials: "include",
      };

      let response = await fetch(
        url,
        requestOptions
      );

      if (
        !response.ok &&
        isAuthenticationError(response)
      ) {
        await refreshAccessToken();

        /*
         * Gọi lại request lấy profile.
         */
        response = await fetch(
          url,
          requestOptions
        );
      }

      if (!response.ok) {
        const errorMessage =
          await readErrorResponse(
            response
          );

        throw new Error(
          errorMessage ||
            `Không thể tải profile: ${response.status}`
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Profile API error:",
        error
      );

      throw error;
    }
  };

/*
 * =========================================================
 * Comment
 * =========================================================
 */

export const addComment = async (
  content,
  userId,
  listId
) => {
  if (
    !content ||
    !userId ||
    !listId
  ) {
    throw new Error(
      "Missing required parameters: content, userId, or listId"
    );
  }

  try {
    const url =
      `${envConfig.host}/add-comment/${userId}/${listId}`;

    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          content,
        }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorMessage =
        await readErrorResponse(
          response
        );

      throw new Error(
        errorMessage ||
          `Thêm bình luận thất bại: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(
      "Failed to add comment:",
      error
    );

    throw error;
  }
};

/*
 * =========================================================
 * Comment notifications
 * =========================================================
 */

const notificationMutation = async (route) => {
  const url = `${envConfig.host}${route}`;
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  let response = await fetch(url, requestOptions);
  if (!response.ok && isAuthenticationError(response)) {
    await refreshAccessToken();
    response = await fetch(url, requestOptions);
  }
  if (!response.ok) {
    throw new Error(
      (await readErrorResponse(response)) ||
      `Cập nhật thông báo thất bại: ${response.status}`
    );
  }
  return response.json();
};

export const getCommentNotificationsApi = async (limit = 30) => {
  const response = await getApi(`/notifications/comments?limit=${limit}`);
  return response.json();
};

export const markNotificationAsReadApi = (notificationId) =>
  notificationMutation(`/notifications/${notificationId}/read`);

export const markAllCommentNotificationsAsReadApi = () =>
  notificationMutation('/notifications/read-all');

/*
 * =========================================================
 * Chat
 * =========================================================
 */

const chatRequest = async (route, { method = 'GET', body } = {}) => {
  if (method === 'GET') {
    const response = await getApi(route);
    return response.json();
  }

  const url = `${envConfig.host}${route}`;
  const requestOptions = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  };
  let response = await fetch(url, requestOptions);
  if (!response.ok && isAuthenticationError(response)) {
    await refreshAccessToken();
    response = await fetch(url, requestOptions);
  }
  if (!response.ok) {
    throw new Error((await readErrorResponse(response)) || `Chat API lỗi: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
};

export const getChatsApi = () => chatRequest('/chats');
export const createDirectChatApi = (userId) => chatRequest('/chats/direct', { method: 'POST', body: { userId } });
export const createGroupChatApi = (name, memberIds) => chatRequest('/chats/group', { method: 'POST', body: { name, memberIds } });
export const getChatMessagesApi = (chatId) => chatRequest(`/chats/${chatId}/messages?limit=100`);
export const sendChatMessageApi = (chatId, chatMessage) => chatRequest(`/chats/${chatId}/messages`, { method: 'POST', body: { message: chatMessage } });
export const sendChatImageApi = async (chatId, file, caption = '') => {
  const formData = new FormData();
  formData.append('image', file);
  if (caption) formData.append('caption', caption);
  const url = `${envConfig.host}/chats/${chatId}/images`;
  const options = { method: 'POST', credentials: 'include', body: formData };
  let response = await fetch(url, options);
  if (!response.ok && isAuthenticationError(response)) {
    await refreshAccessToken();
    response = await fetch(url, options);
  }
  if (!response.ok) {
    throw new Error((await readErrorResponse(response)) || `Gửi ảnh thất bại: ${response.status}`);
  }
  return response.json();
};
export const markChatReadApi = (chatId, messageId) => chatRequest(`/chats/${chatId}/read`, { method: 'PATCH', body: { messageId } });
export const addChatMembersApi = (chatId, memberIds) => chatRequest(`/chats/${chatId}/members`, { method: 'POST', body: { memberIds } });
export const leaveChatGroupApi = (chatId) => chatRequest(`/chats/${chatId}/members/me`, { method: 'DELETE' });
export const getFriendsApi = async (userId) => {
  const response = await getApi(`/list-friend/${userId}`);
  return response.json();
};

export const togglePostLikeApi = (postId) =>
  chatRequest(`/posts/${postId}/like`, { method: 'POST' });

export const sharePostApi = (postId, text = '') =>
  chatRequest(`/posts/${postId}/share`, { method: 'POST', body: { text } });

/*
 * =========================================================
 * Upload post images
 * =========================================================
 */

export const uploadPostImagesApi =
  async (files, userId) => {
    if (
      !Array.isArray(files) ||
      files.length === 0
    ) {
      return [];
    }

    const normalizedUserId =
      Number(userId);

    if (
      !Number.isFinite(
        normalizedUserId
      ) ||
      normalizedUserId <= 0
    ) {
      throw new Error(
        "userId không hợp lệ."
      );
    }

    const formData =
      new FormData();

    files.forEach((file) => {
      if (file instanceof File) {
        formData.append(
          "images",
          file
        );
      }
    });

    formData.append(
      "userId",
      String(normalizedUserId)
    );

    const url =
      `${envConfig.host}/upload-post-images`;

    const requestOptions = {
      method: "POST",
      body: formData,
      credentials: "include",
    };

    let response = await fetch(
      url,
      requestOptions
    );

    if (
      !response.ok &&
      isAuthenticationError(response)
    ) {
      await refreshAccessToken();

      response = await fetch(
        url,
        requestOptions
      );
    }

    /*
     * Không tự set Content-Type.
     * Browser cần tự tạo multipart boundary.
     */
    if (!response.ok) {
      const errorMessage =
        await readErrorResponse(
          response
        );

      throw new Error(
        errorMessage ||
          `Upload ảnh thất bại: ${response.status}`
      );
    }

    const responseData =
      await response.json();

    if (
      !Array.isArray(
        responseData.imageKeys
      )
    ) {
      throw new Error(
        "Backend không trả về imageKeys hợp lệ."
      );
    }

    return responseData.imageKeys
      .filter(
        (key) =>
          typeof key ===
            "string" &&
          key.trim() !== ""
      )
      .map((key) => key.trim());
  };

/*
 * =========================================================
 * Add post
 * =========================================================
 */

export const addPostApi = async ({
  userId,
  content,
}) => {
  const normalizedUserId =
    Number(userId);

  if (
    !Number.isFinite(
      normalizedUserId
    ) ||
    normalizedUserId <= 0
  ) {
    throw new Error(
      "userId không hợp lệ."
    );
  }

  if (
    !content ||
    typeof content !==
      "object" ||
    Array.isArray(content)
  ) {
    throw new Error(
      "content không hợp lệ."
    );
  }

  const normalizedContent = {
    text:
      typeof content.text ===
      "string"
        ? content.text.trim()
        : "",

    image: Array.isArray(
      content.image
    )
      ? content.image
          .filter(
            (key) =>
              typeof key ===
                "string" &&
              key.trim() !== ""
          )
          .map((key) =>
            key.trim()
          )
      : [],
  };

  if (
    !normalizedContent.text &&
    normalizedContent.image
      .length === 0
  ) {
    throw new Error(
      "Bài viết phải có nội dung hoặc hình ảnh."
    );
  }

  const url =
    `${envConfig.host}/add-post`;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      userId:
        normalizedUserId,
      content:
        normalizedContent,
    }),
  };

  let response = await fetch(
    url,
    requestOptions
  );

  if (
    !response.ok &&
    isAuthenticationError(response)
  ) {
    await refreshAccessToken();

    response = await fetch(
      url,
      requestOptions
    );
  }

  if (!response.ok) {
    const errorMessage =
      await readErrorResponse(
        response
      );

    throw new Error(
      errorMessage ||
        `Đăng bài thất bại: ${response.status}`
    );
  }

  return response.json();
};

/*
 * =========================================================
 * Update post
 * =========================================================
 */

export const updatePostApi = async ({
  postId,
  content,
  filesToUpload = [],
  imagesToDelete = [],
}) => {
  const normalizedPostId =
    Number(postId);

  if (
    !Number.isFinite(
      normalizedPostId
    ) ||
    normalizedPostId <= 0
  ) {
    throw new Error(
      "postId không hợp lệ."
    );
  }

  if (
    !content ||
    typeof content !==
      "object" ||
    Array.isArray(content)
  ) {
    throw new Error(
      "content không hợp lệ."
    );
  }

  const normalizedContent = {
    text:
      typeof content.text ===
      "string"
        ? content.text.trim()
        : "",

    image: Array.isArray(
      content.image
    )
      ? content.image
          .filter(
            (key) =>
              typeof key ===
                "string" &&
              key.trim() !== ""
          )
          .map((key) =>
            key.trim()
          )
      : [],
  };

  if (
    !normalizedContent.text &&
    normalizedContent.image
      .length === 0 &&
    filesToUpload.length === 0
  ) {
    throw new Error(
      "Bài viết phải có nội dung hoặc hình ảnh."
    );
  }

  const formData =
    new FormData();

  formData.append(
    "text",
    normalizedContent.text
  );

  /*
   * Các object key của ảnh đang được giữ lại.
   */
  formData.append(
    "existingImages",
    JSON.stringify(
      normalizedContent.image
    )
  );

  /*
   * Các object key của ảnh cần xóa.
   */
  formData.append(
    "oldImageKeys",
    JSON.stringify(
      Array.isArray(
        imagesToDelete
      )
        ? imagesToDelete
            .filter(
              (key) =>
                typeof key ===
                  "string" &&
                key.trim() !== ""
            )
            .map((key) =>
              key.trim()
            )
        : []
    )
  );

  /*
   * File ảnh mới.
   */
  if (
    Array.isArray(
      filesToUpload
    )
  ) {
    filesToUpload.forEach(
      (file) => {
        if (
          file instanceof File
        ) {
          formData.append(
            "images",
            file
          );
        }
      }
    );
  }

  console.log(
    "updatePostApi FormData:",
    {
      postId:
        normalizedPostId,

      text:
        normalizedContent.text.substring(
          0,
          50
        ),

      existingImages:
        normalizedContent.image,

      imagesToDelete,

      filesToUpload:
        filesToUpload.length,
    }
  );

  const url =
    `${envConfig.host}/update-post/${normalizedPostId}`;

  const requestOptions = {
    method: "PUT",
    credentials: "include",
    body: formData,
  };

  let response = await fetch(
    url,
    requestOptions
  );

  if (
    !response.ok &&
    isAuthenticationError(response)
  ) {
    await refreshAccessToken();

    /*
     * FormData hiện tại có thể được sử dụng lại
     * trong fetch retry trên browser.
     */
    response = await fetch(
      url,
      requestOptions
    );
  }

  if (!response.ok) {
    const errorMessage =
      await readErrorResponse(
        response
      );

    throw new Error(
      errorMessage ||
        `Cập nhật bài thất bại: ${response.status}`
    );
  }

  return response.json();
};

/*
 * =========================================================
 * Delete post
 * =========================================================
 */

/**
 * Xóa bài viết.
 *
 * Backend route:
 *
 * DELETE /delete-post/:id
 *
 * Backend nên thực hiện:
 * 1. Kiểm tra bài viết tồn tại.
 * 2. Kiểm tra người đăng nhập có quyền xóa.
 * 3. Xóa dữ liệu bài viết trong DB.
 * 4. Xóa các ảnh tương ứng trong Neon Storage.
 */
export const deletePostApi = async (
  postId
) => {
  const normalizedPostId =
    Number(postId);

  if (
    !Number.isFinite(
      normalizedPostId
    ) ||
    normalizedPostId <= 0
  ) {
    throw new Error(
      "postId không hợp lệ."
    );
  }

  const url =
    `${envConfig.host}/delete-post/${normalizedPostId}`;

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type":
        "application/json",
    },
    credentials: "include",
  };

  let response = await fetch(
    url,
    requestOptions
  );

  /*
   * Nếu access token hết hạn:
   * - gọi refresh token
   * - thực hiện lại DELETE
   */
  if (
    !response.ok &&
    isAuthenticationError(response)
  ) {
    await refreshAccessToken();

    response = await fetch(
      url,
      requestOptions
    );
  }

  if (!response.ok) {
    const errorMessage =
      await readErrorResponse(
        response
      );

    throw new Error(
      errorMessage ||
        `Xóa bài viết thất bại: ${response.status}`
    );
  }

  /*
   * Một số DELETE API trả về:
   * - JSON body
   * - hoặc 204 No Content
   *
   * Hỗ trợ cả hai trường hợp.
   */
  if (
    response.status === 204
  ) {
    return {
      success: true,
      postId:
        normalizedPostId,
    };
  }

  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    const responseData =
      await response.json();

    return {
      success: true,
      postId:
        normalizedPostId,
      ...responseData,
    };
  }

  return {
    success: true,
    postId:
      normalizedPostId,
  };
};
