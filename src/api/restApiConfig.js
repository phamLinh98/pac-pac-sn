
import { envConfig } from "../configs/envConfig";

export const getApi = async (route) => {
  try {
    const url = `${envConfig.host}${route}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 402) {
        try {
          const refreshResponse = await fetch(`${envConfig.host}/refesh-token`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            // Thực hiện lại request ban đầu sau khi refresh token thành công
            response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: 'include',
            });
          } else {
            throw new Error('Refresh token failed');
          }
        } catch (error) {
          console.log('Refresh token error:', error);
          throw error;
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
    }
    return response;
  } catch (error) {
    console.log('API error:', error);
    throw error;
  }
}

export const loginByEmailAndPassword = async (email, password) => {
  try {
    const url = `${envConfig.host}/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      await response.json();
    }
    const responseData = await response.json();
    localStorage.setItem('allow-login', responseData.token);
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

export const refeshTokenWhenExpired = async (route) => {
  try {
    const url = `${envConfig.host}${route}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 402) {
        const refreshResponse = await fetch(`${envConfig.host}/refesh-token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });
        if (refreshResponse.ok) {
          // Thực hiện lại request ban đầu sau khi refresh token thành công
          response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          });
        } else {
          throw new Error('Refresh token failed');
        }
      } else {
        throw new Error(`HTTP error! status:${response.status}`);
      }
    }
    return response;
  } catch (error) {
    console.log('error', error.message);
    throw error;
  }
}

export const logoutClearToken = async (route) => {
  try {
    const url = `${envConfig.host}${route}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    return response;
  } catch (error) {
    console.log('error', error.message);
  }
}

export const updateUserImageApi = async (avatarURL, id) => {
  try {
    const url = `${envConfig.host}/user/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: avatarURL
      }),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    return response;
  } catch (error) {
    console.log('error', error.message);
    throw error;
  }
}


export const createNewUser = async (info) => {
  try {
    const url = `${envConfig.host}/register`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: info.name,
        email: info.email,
        password: info.password
      }),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    return response;
  } catch (error) {
    console.log('error', error.message);
    throw error;
  }
}


export const getApiListUserStatus = async (route) => {
  try {
    const url = `${envConfig.host}${route}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 402) {
        try {
          const refreshResponse = await fetch(`${envConfig.host}/refesh-token`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            // Thực hiện lại request ban đầu sau khi refresh token thành công
            response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: 'include',
            });
          } else {
            throw new Error('Refresh token failed');
          }
        } catch (error) {
          console.log('Refresh token error:', error);
          throw error;
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
    }
    return response;
  } catch (error) {
    console.log('API error:', error);
    throw error;
  }
}

export const addComment = async (content, userId, listId) => {
  // Validate input parameters
  if (!content || !userId || !listId) {
    throw new Error('Missing required parameters: content, userId, or listId');
  }

  try {
    const url = `${envConfig.host}/add-comment/${userId}/${listId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get response body for more context
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw error;
  }
};

const readErrorResponse = async (
  response
) => {
  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    const errorData =
      await response.json();

    return (
      errorData.message ||
      errorData.error ||
      JSON.stringify(errorData)
    );
  }

  return response.text();
};

export const uploadPostImagesApi =
  async (files, userId) => {
    if (
      !Array.isArray(files) ||
      files.length === 0
    ) {
      return [];
    }

    if (
      !Number.isFinite(
        Number(userId)
      ) ||
      Number(userId) <= 0
    ) {
      throw new Error(
        "userId không hợp lệ."
      );
    }

    const formData =
      new FormData();

    files.forEach((file) => {
      formData.append(
        "images",
        file
      );
    });

    formData.append(
      "userId",
      String(userId)
    );

    const response = await fetch(
      `${envConfig.host}/upload-post-images`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    /*
     * Không tự set Content-Type ở đây.
     * Browser cần tự thêm multipart boundary.
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

    return responseData.imageKeys.filter(
      (key) =>
        typeof key === "string" &&
        key.trim() !== ""
    );
  };

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
      ? content.image.filter(
          (key) =>
            typeof key ===
              "string" &&
            key.trim() !== ""
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

  const response = await fetch(
    `${envConfig.host}/add-post`,
    {
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
    }
  );

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

export const updatePostApi = async ({
  postId,
  content,
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
      ? content.image.filter(
          (key) =>
            typeof key ===
              "string" &&
            key.trim() !== ""
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

  const response = await fetch(
    `${envConfig.host}/update-post/${normalizedPostId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content:
          normalizedContent,
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
        `Cập nhật bài thất bại: ${response.status}`
    );
  }

  return response.json();
};
