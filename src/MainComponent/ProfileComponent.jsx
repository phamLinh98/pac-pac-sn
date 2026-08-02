import { useEffect, useRef, useState } from "react";

import {
  Button,
  Card,
  Image,
  Input,
  Modal,
  Popover,
  Space,
  message,
} from "antd";

import {
  CloseOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  HistoryOutlined,
  PlusOutlined,
  SaveOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { IoIosPersonAdd } from "react-icons/io";

import { FiSend } from "react-icons/fi";

import { GiChestnutLeaf } from "react-icons/gi";

import { VscShare } from "react-icons/vsc";

import { MdRemoveRedEye, MdDeleteOutline } from "react-icons/md";

import { BsSendPlus } from "react-icons/bs";

import { FaUserFriends } from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";

import { ImageStatus, ImageStatusAvatar } from "../SideComponent/ImageStatus";

import { FriendStatusContentDetailsComponent } from "./FriendStatusContentDetailsComponent";

import { LoadingComponent } from "../SideComponent/LoadingComponent";

import { NotListComponent } from "../SideComponent/NoListComponent";

import { formatTimeStamp } from "../configs/configTimeStamp";

import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo.js";

import { MyStatusAreaComponent } from "./MyStatusAreaComponent.jsx";

import { ModalComponent } from "../SideComponent/ModalComponent.jsx";

import { useFacadeMyProfileList } from "../reduxs/useFacadeMyStatusProfile.jsx";

import { checkValueInArrayGetData } from "../SideFunction/CheckValueInArray.js";

import {
  deletePostApi,
  getFriendRequestsApi,
  sendFriendRequestApi,
  updatePostApi,
  uploadPostImagesApi,
} from "../api/restApiConfig";

const { Meta } = Card;
const { TextArea } = Input;

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/8a/a9/33/8aa933d3cd8b23171598ed577c426f78.jpg";

const DEFAULT_BACKGROUND =
  "https://i.pinimg.com/1200x/80/7f/bd/807fbd1b0342fe62bc600f8ad7aa4860.jpg";

const normalizeImages = (rawImages) => {
  if (!rawImages) {
    return [];
  }

  if (Array.isArray(rawImages)) {
    return rawImages
      .flat(Infinity)
      .filter((image) => typeof image === "string" && image.trim() !== "")
      .map((image) => image.trim());
  }

  if (typeof rawImages === "string") {
    const trimmedImages = rawImages.trim();

    if (!trimmedImages) {
      return [];
    }

    try {
      const parsedImages = JSON.parse(trimmedImages);

      return normalizeImages(parsedImages);
    } catch {
      return [trimmedImages];
    }
  }

  return [];
};

const normalizeContent = (rawContent) => {
  if (!rawContent) {
    return {
      text: "",
      image: [],
    };
  }

  let parsedContent = rawContent;

  if (typeof rawContent === "string") {
    const trimmedContent = rawContent.trim();

    if (!trimmedContent) {
      return {
        text: "",
        image: [],
      };
    }

    try {
      parsedContent = JSON.parse(trimmedContent);
    } catch (error) {
      console.error("Không thể parse content của bài viết:", rawContent, error);

      return {
        text: trimmedContent,
        image: [],
      };
    }
  }

  if (
    !parsedContent ||
    typeof parsedContent !== "object" ||
    Array.isArray(parsedContent)
  ) {
    return {
      text: "",
      image: [],
    };
  }

  return {
    text: parsedContent.text ?? parsedContent.title ?? "",

    image: normalizeImages(parsedContent.image ?? parsedContent.images),
  };
};

const hasPostContent = (content) => {
  return Boolean(content.text.trim() || content.image.length > 0);
};

export const ProfileComponent = () => {
  const { id: profileIdParam } = useParams();

  const navigate = useNavigate();

  const profileUserId = Number(profileIdParam);

  const {
    listUserById,
    loading,
    refetchProfilePosts,
    addProfilePost,
  } =
    useFacadeMyProfileList(profileUserId);

  const safeListUserById = Array.isArray(listUserById)
    ? listUserById
    : Array.isArray(listUserById?.list)
      ? listUserById.list
      : Array.isArray(listUserById?.data)
        ? listUserById.data
        : [];

  const profileUser = safeListUserById.length > 0 ? safeListUserById[0] : null;

  const containerRefs = useRef([]);

  const editTextAreaRef = useRef(null);

  const imageInputRef = useRef(null);

  const token = localStorage.getItem("allow-login");

  let loginUser = {};

  try {
    loginUser = token ? (decodeJwt(token) ?? {}) : {};
  } catch (error) {
    console.error("Không thể decode JWT:", error);
  }

  const loginUserId = Number(loginUser?.id);

  const isOwnProfile =
    Number.isFinite(loginUserId) &&
    Number.isFinite(profileUserId) &&
    loginUserId === profileUserId;

  const friendIdList = Array.isArray(loginUser?.list_friend_id)
    ? loginUser.list_friend_id
    : [];

  const checkIsFriend = checkValueInArrayGetData(friendIdList, profileIdParam);

  const [addFriend, setAddFriend] = useState(false);
  const [friendRequestStatus, setFriendRequestStatus] = useState(null);
  const [friendRequestDirection, setFriendRequestDirection] = useState(null);

  const [isFollow, setIsFollow] = useState(false);

  const [openAvatar, setOpenAvatar] = useState(false);

  const [openBG, setOpenBG] = useState(false);

  const [openPostMenuId, setOpenPostMenuId] = useState(null);

  const [editingPostId, setEditingPostId] = useState(null);

  const [deletingPostId, setDeletingPostId] = useState(null);

  const [editDraft, setEditDraft] = useState({
    text: "",
    images: [],
  });

  const [originalPostImages, setOriginalPostImages] = useState([]);

  const [localPostOverrides, setLocalPostOverrides] = useState({});

  useEffect(() => {
    if (!editingPostId) {
      return;
    }

    const timer = window.setTimeout(() => {
      const textArea =
        editTextAreaRef.current?.resizableTextArea?.textArea ??
        editTextAreaRef.current?.input ??
        null;

      if (!textArea) {
        return;
      }

      textArea.focus();

      const endPosition = textArea.value.length;

      textArea.setSelectionRange(endPosition, endPosition);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [editingPostId]);

  useEffect(() => {
    return () => {
      Object.values(localPostOverrides).forEach((post) => {
        post.imageItems?.forEach((imageItem) => {
          if (imageItem.isLocal && imageItem.url?.startsWith("blob:")) {
            URL.revokeObjectURL(imageItem.url);
          }
        });
      });
    };
  }, [localPostOverrides]);

  const normalizeFriendRequestStatus = (payload) => {
    const resultCandidate = payload?.result ?? payload;
    const firstResult = Array.isArray(resultCandidate)
      ? resultCandidate[0]
      : resultCandidate;

    const rawStatus = firstResult?.status ?? payload?.status ?? null;

    if (typeof rawStatus !== "string") {
      return null;
    }

    const normalizedStatus = rawStatus.trim().toLowerCase();

    if (normalizedStatus === "pendind") {
      return "pending";
    }

    return normalizedStatus;
  };

  useEffect(() => {
    if (
      !Number.isFinite(loginUserId) ||
      !Number.isFinite(profileUserId) ||
      loginUserId === profileUserId
    ) {
      setFriendRequestStatus(null);
      setFriendRequestDirection(null);
      setAddFriend(false);
      return undefined;
    }

    let isActive = true;

    const fetchFriendRequestStatus = async () => {
      try {
        const response = await getFriendRequestsApi(loginUserId);
        const payload = await response.json().catch(() => []);
        const requestList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.result)
            ? payload.result
            : [];

        const relation = requestList.find((request) => {
          const senderId = Number(request?.sender_id);
          const receiverId = Number(request?.receiver_id);

          return (
            (senderId === loginUserId && receiverId === profileUserId) ||
            (senderId === profileUserId && receiverId === loginUserId)
          );
        });

        if (!isActive) {
          return;
        }

        const status = normalizeFriendRequestStatus(relation);
        const direction = relation
          ? Number(relation.sender_id) === loginUserId
            ? "outgoing"
            : "incoming"
          : null;

        setFriendRequestStatus(status);
        setFriendRequestDirection(direction);
        setAddFriend(status === "pending" && direction === "outgoing");
      } catch (error) {
        if (isActive) {
          console.error("Không thể tải trạng thái kết bạn:", error);
          setFriendRequestStatus(null);
          setFriendRequestDirection(null);
          setAddFriend(false);
        }
      }
    };

    fetchFriendRequestStatus();
    window.addEventListener(
      "friend-request-updated",
      fetchFriendRequestStatus
    );

    return () => {
      isActive = false;
      window.removeEventListener(
        "friend-request-updated",
        fetchFriendRequestStatus
      );
    };
  }, [loginUserId, profileUserId]);

  const clickToAddFriend = async () => {
    if (!Number.isFinite(loginUserId) || !Number.isFinite(profileUserId)) {
      message.error("Không thể xác định người dùng để gửi lời mời kết bạn.");
      return;
    }

    if (loginUserId === profileUserId) {
      message.info("Bạn không thể gửi lời mời kết bạn cho chính mình.");
      return;
    }

    if (
      addFriend ||
      (friendRequestStatus === "pending" &&
        friendRequestDirection !== "incoming") ||
      friendRequestStatus === "accepted"
    ) {
      return;
    }

    try {
      const response = await sendFriendRequestApi(loginUserId, profileUserId);
      const payload = await response.json().catch(() => null);
      const requestStatus = normalizeFriendRequestStatus(payload);

      if (requestStatus === "accepted") {
        setFriendRequestStatus("accepted");
        setFriendRequestDirection(null);
        setAddFriend(false);
        window.dispatchEvent(new Event("friend-request-updated"));
      } else if (requestStatus === "pending" || requestStatus === "waiting") {
        setFriendRequestStatus("pending");
        setFriendRequestDirection("outgoing");
        setAddFriend(true);
      } else {
        setFriendRequestStatus(null);
        setFriendRequestDirection(null);
        setAddFriend(false);
      }

      message.success(payload?.message || "Đã gửi lời mời kết bạn.");
    } catch (error) {
      setAddFriend(false);
      setFriendRequestStatus(null);
      setFriendRequestDirection(null);
      message.error(
        error instanceof Error
          ? error.message
          : "Không thể gửi lời mời kết bạn."
      );
    }
  };

  const clickToFollow = () => {
    setIsFollow((previousValue) => !previousValue);
  };

  const handleProfilePostCreated = (payload) => {
    const post = payload?.post ?? payload;

    if (!post || typeof post !== "object") {
      return;
    }

    const postUserId = Number(post.user_id ?? loginUserId);

    addProfilePost({
      ...profileUser,
      ...post,
      user_id: Number.isFinite(postUserId)
        ? postUserId
        : post.user_id,
      name: post.name ?? profileUser?.name ?? loginUser?.name,
      user_name:
        post.user_name ?? profileUser?.name ?? loginUser?.name,
      avatar: post.avatar ?? profileUser?.avatar ?? loginUser?.avatar,
    });
  };

  const showModalAvatar = () => {
    setOpenAvatar(true);
  };

  const hideModalAvatar = () => {
    setOpenAvatar(false);
  };

  const showModalBG = () => {
    setOpenBG(true);
  };

  const hideModalBG = () => {
    setOpenBG(false);
  };

  const closePostMenu = () => {
    setOpenPostMenuId(null);
  };

  const handleViewPostHistory = (item) => {
    closePostMenu();

    navigate(`/post-history/${item.id}`);
  };

  const createExistingImageItems = (images) => {
    return images.map((imageUrl, index) => ({
      id: `existing-${index}-${imageUrl}`,
      url: imageUrl,
      file: null,
      isLocal: false,
    }));
  };

  const handleEditPost = (item, content) => {
    closePostMenu();

    const savedOverride = localPostOverrides[item.id];

    const currentText = savedOverride?.text ?? content.text ?? "";

    const currentImageItems =
      savedOverride?.imageItems ?? createExistingImageItems(content.image);

    setOriginalPostImages(Array.isArray(content.image) ? content.image : []);

    setEditingPostId(item.id);

    setEditDraft({
      text: currentText,

      images: currentImageItems.map((imageItem) => ({
        ...imageItem,
      })),
    });
  };

  const handleDraftTextChange = (event) => {
    const nextText = event.target.value;

    setEditDraft((previousDraft) => ({
      ...previousDraft,
      text: nextText,
    }));
  };

  const handleOpenImagePicker = () => {
    imageInputRef.current?.click();
  };

  const handleAddImages = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    const newImageItems = validFiles.map((file, index) => ({
      id: `local-${Date.now()}-${index}-${file.name}`,
      url: URL.createObjectURL(file),
      file,
      isLocal: true,
    }));

    setEditDraft((previousDraft) => ({
      ...previousDraft,

      images: [...previousDraft.images, ...newImageItems],
    }));

    event.target.value = "";
  };

  const handleRemoveDraftImage = (imageId) => {
    setEditDraft((previousDraft) => {
      const removedImage = previousDraft.images.find(
        (imageItem) => imageItem.id === imageId,
      );

      if (removedImage?.isLocal && removedImage.url?.startsWith("blob:")) {
        URL.revokeObjectURL(removedImage.url);
      }

      return {
        ...previousDraft,

        images: previousDraft.images.filter(
          (imageItem) => imageItem.id !== imageId,
        ),
      };
    });
  };

  const handleCancelEdit = () => {
    editDraft.images.forEach((imageItem) => {
      const alreadySaved = localPostOverrides[editingPostId]?.imageItems?.some(
        (savedImage) => savedImage.url === imageItem.url,
      );

      if (
        imageItem.isLocal &&
        !alreadySaved &&
        imageItem.url?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imageItem.url);
      }
    });

    setEditingPostId(null);

    setOriginalPostImages([]);

    setEditDraft({
      text: "",
      images: [],
    });
  };

  const handleSaveEditOnUI = async (postId) => {
    try {
      const localImages = editDraft.images.filter(
        (image) => image.isLocal && image.file,
      );

      const existingImages = editDraft.images.filter((image) => !image.isLocal);

      let uploadedImageKeys = [];

      if (localImages.length > 0) {
        const filesToUpload = localImages.map((image) => image.file);

        uploadedImageKeys = await uploadPostImagesApi(
          filesToUpload,
          loginUserId,
        );
      }

      const keptExistingKeys = existingImages.map((image) => image.url);

      const allImageKeys = [...keptExistingKeys, ...uploadedImageKeys];

      const imagesToDelete = originalPostImages.filter(
        (originalKey) => !keptExistingKeys.includes(originalKey),
      );

      await updatePostApi({
        postId,

        content: {
          text: editDraft.text,

          image: allImageKeys,
        },

        filesToUpload: [],

        imagesToDelete,
      });

      setLocalPostOverrides((previousOverrides) => ({
        ...previousOverrides,

        [postId]: {
          text: editDraft.text,

          imageItems: editDraft.images.map((imageItem) => ({
            ...imageItem,
          })),
        },
      }));

      setEditingPostId(null);

      setOriginalPostImages([]);

      setEditDraft({
        text: "",
        images: [],
      });

      await refetchProfilePosts?.();

      message.success("Cập nhật bài viết thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật bài viết:", error);

      message.error(error?.message || "Cập nhật bài viết thất bại!");
    }
  };

  const handleDeletePost = (item) => {
    closePostMenu();

    const postId = Number(item?.id);

    if (!Number.isFinite(postId) || postId <= 0) {
      message.error("ID bài viết không hợp lệ.");

      return;
    }

    const postOwnerId = Number(item?.user_id);

    if (!Number.isFinite(loginUserId) || loginUserId !== postOwnerId) {
      message.error("Bạn không có quyền xóa bài viết này.");

      return;
    }

    Modal.confirm({
      title: "Xóa bài viết.",

      content:
        "Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.",

      okText: "Xóa",

      cancelText: "Hủy",

      okType: "danger",

      centered: true,

      onOk: async () => {
        try {
          setDeletingPostId(postId);

          await deletePostApi(postId);

          setLocalPostOverrides((previousOverrides) => {
            const nextOverrides = {
              ...previousOverrides,
            };

            delete nextOverrides[postId];

            return nextOverrides;
          });

          if (editingPostId === postId) {
            setEditingPostId(null);

            setOriginalPostImages([]);

            setEditDraft({
              text: "",
              images: [],
            });
          }

          await refetchProfilePosts?.();

          message.success("Xóa bài viết thành công!");
        } catch (error) {
          console.error("Lỗi xóa bài viết:", error);

          message.error(error?.message || "Xóa bài viết thất bại!");

          throw error;
        } finally {
          setDeletingPostId(null);
        }
      },
    });
  };

  const handleHidePost = (item) => {
    closePostMenu();

    console.log("Ẩn bài viết:", item.id);
  };

  const normalizedPostList = safeListUserById
    .map((item) => ({
      ...item,

      normalizedContent: normalizeContent(item?.content),
    }))
    .filter((item) => hasPostContent(item.normalizedContent));

  return (
    <>
      <div
        style={{
          width: "100%",
          position: "relative",
        }}
      >
        <Card
          hoverable
          style={{
            width: "100%",
          }}
          cover={
            <Image
              style={{
                height: "230px",
                objectFit: "cover",
              }}
              alt="Ảnh bìa"
              src={
                profileUser?.background ||
                profileUser?.background_image ||
                DEFAULT_BACKGROUND
              }
              preview
            />
          }
        >
          <Meta
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <LoadingComponent />
                  ) : profileUser ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "5px",
                      }}
                    >
                      <ImageStatusAvatar
                        active
                        size={64}
                        icon={<UserOutlined />}
                        image={profileUser.avatar || DEFAULT_AVATAR}
                        style={{
                          width: "64px",
                          height: "64px",
                          border: "5px solid #0000FF",
                          borderRadius: "50%",
                          boxSizing: "border-box",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      />

                      <span
                        style={{
                          marginLeft: "10px",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {profileUser.name ||
                          profileUser.user_name ||
                          "Người dùng"}
                      </span>

                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "12px",
                          color: "gray",
                        }}
                      >
                          ({profileUser.list_friend_id?.length ?? 0} bạn bè)
                      </span>

                      {isOwnProfile && (
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            marginLeft: "5px",
                            flexWrap: "wrap",
                          }}
                        >
                          <Button onClick={showModalAvatar}>Thay avatar</Button>

                          <Button onClick={showModalBG}>Thay ảnh bìa</Button>

                          <ModalComponent
                            open={openAvatar}
                            hideModal={hideModalAvatar}
                            id={loginUserId}
                          />

                          <ModalComponent
                            open={openBG}
                            hideModal={hideModalBG}
                            id={loginUserId}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>Người dùng không tồn tại</span>
                  )}
                </div>

                {!loading && profileUser && !isOwnProfile && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    {checkIsFriend || friendRequestStatus === "accepted" ? (
                      <Button
                        icon={<FaUserFriends />}
                        onClick={clickToAddFriend}
                      >
                        Bạn bè
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        icon={
                          friendRequestStatus === "pending" &&
                          friendRequestDirection === "incoming"
                            ? <FaUserFriends />
                            : friendRequestStatus === "pending"
                              ? <BsSendPlus />
                              : <IoIosPersonAdd />
                        }
                        onClick={clickToAddFriend}
                      >
                        {friendRequestStatus === "pending" &&
                        friendRequestDirection === "incoming"
                          ? "Đồng ý kết bạn"
                          : friendRequestStatus === "pending"
                            ? "Đã gửi lời mời kết bạn"
                            : "Kết bạn"}
                      </Button>
                    )}

                    <Button
                      type="primary"
                      icon={<MdRemoveRedEye />}
                      onClick={clickToFollow}
                    >
                      {isFollow ? "Đã theo dõi" : "Theo dõi"}
                    </Button>

                    <Button type="dashed" icon={<FiSend />}>
                      Nhắn tin
                    </Button>
                  </div>
                )}
              </div>
            }
            description=""
          />
        </Card>
      </div>

      {isOwnProfile && (
        <div
          style={{
            paddingTop: "1%",
          }}
        >
          <MyStatusAreaComponent onPostCreated={handleProfilePostCreated} />
        </div>
      )}

      {loading ? (
        <LoadingComponent />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            paddingTop: "1%",
          }}
        >
          {normalizedPostList.length === 0 ? (
            <NotListComponent description="Người dùng chưa có bài viết nào" />
          ) : (
            normalizedPostList.map((item, index) => {
              const originalContent = item.normalizedContent;

              const savedOverride = localPostOverrides[item.id];

              const displayContent = savedOverride
                ? {
                    text: savedOverride.text,

                    image: savedOverride.imageItems.map(
                      (imageItem) => imageItem.url,
                    ),
                  }
                : originalContent;

              const ownerName = item.name || item.user_name || "Người dùng";

              const postOwnerId = Number(item.user_id);

              const isOwnPost =
                Number.isFinite(loginUserId) &&
                Number.isFinite(postOwnerId) &&
                loginUserId === postOwnerId;

              const postKey = item.id ?? `${item.user_id}-${index}`;

              const isEditing = editingPostId === item.id;

              const displayedImages = isEditing
                ? editDraft.images
                : displayContent.image.map((imageUrl, imageIndex) => ({
                    id: `display-${imageIndex}-${imageUrl}`,
                    url: imageUrl,
                    file: null,
                    isLocal: false,
                  }));

              return (
                <Card
                  key={postKey}
                  title={
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <ImageStatus
                          active
                          width="26px"
                          height="25px"
                          image={item.avatar || DEFAULT_AVATAR}
                          style={{
                            width: "26px",
                            height: "25px",
                            borderRadius: "5px",
                            border: "3px solid #0000FF",
                            boxSizing: "border-box",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        />

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              color: "blue",
                              fontWeight: 500,
                            }}
                          >
                            {isOwnPost ? "Bạn" : ownerName}
                          </span>

                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "gray",
                              paddingLeft: "6px",
                            }}
                          >
                            {item.created_at
                              ? `đã đăng tải bài viết (${formatTimeStamp(
                                  item.created_at,
                                )})`
                              : "đã đăng tải bài viết"}
                          </span>
                        </div>
                      </div>

                      {!isEditing && (
                        <Popover
                          placement="bottomRight"
                          trigger="click"
                          arrow
                          open={openPostMenuId === postKey}
                          onOpenChange={(open) => {
                            setOpenPostMenuId(open ? postKey : null);
                          }}
                          title={
                            <span
                              style={{
                                fontWeight: 600,
                              }}
                            >
                              Tùy chọn bài viết
                            </span>
                          }
                          content={
                            <div
                              style={{
                                width: "220px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                              }}
                            >
                              <Button
                                type="text"
                                block
                                icon={<HistoryOutlined />}
                                onClick={() => handleViewPostHistory(item)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                }}
                              >
                                Xem lịch sử bài viết
                              </Button>

                              {isOwnPost && (
                                <Button
                                  type="text"
                                  block
                                  icon={<EditOutlined />}
                                  onClick={() =>
                                    handleEditPost(item, displayContent)
                                  }
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  Chỉnh sửa bài viết
                                </Button>
                              )}

                              <Button
                                type="text"
                                block
                                icon={<EyeInvisibleOutlined />}
                                onClick={() => handleHidePost(item)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                }}
                              >
                                Ẩn bài viết
                              </Button>

                              {isOwnPost && (
                                <Button
                                  type="text"
                                  block
                                  danger
                                  icon={<MdDeleteOutline />}
                                  loading={deletingPostId === Number(item.id)}
                                  disabled={deletingPostId !== null}
                                  onClick={() => handleDeletePost(item)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  Xóa bài viết
                                </Button>
                              )}
                            </div>
                          }
                        >
                          <Button
                            type="text"
                            shape="circle"
                            aria-label="Mở tùy chọn bài viết"
                            icon={
                              <UnorderedListOutlined
                                style={{
                                  fontSize: "18px",
                                }}
                              />
                            }
                            style={{
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          />
                        </Popover>
                      )}
                    </div>
                  }
                  size="small"
                >
                  {isEditing ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <TextArea
                        ref={editTextAreaRef}
                        value={editDraft.text}
                        onChange={handleDraftTextChange}
                        autoSize={{
                          minRows: 2,
                          maxRows: 8,
                        }}
                        placeholder="Nhập nội dung bài viết..."
                        maxLength={5000}
                        showCount
                      />
                    </div>
                  ) : (
                    displayContent.text && <p>{displayContent.text}</p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {displayedImages.length > 0 && (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          overflowX: "hidden",
                        }}
                      >
                        <div
                          ref={(element) => {
                            containerRefs.current[index] = element;
                          }}
                          style={{
                            display: "flex",
                            gap: "8px",
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            paddingTop: isEditing ? "8px" : 0,
                          }}
                        >
                          {displayedImages.map((imageItem, imageIndex) => (
                            <div
                              key={imageItem.id}
                              style={{
                                position: "relative",
                                display: "inline-block",
                                flexShrink: 0,
                                marginRight: "5px",
                                marginBottom: "5px",
                              }}
                            >
                              <ImageStatus
                                image={imageItem.url}
                                width={150}
                                height={250}
                                preview={!isEditing}
                              />

                              {isEditing && (
                                <Button
                                  danger
                                  type="primary"
                                  shape="circle"
                                  size="small"
                                  aria-label={`Xóa ảnh ${imageIndex + 1}`}
                                  icon={<CloseOutlined />}
                                  onClick={() =>
                                    handleRemoveDraftImage(imageItem.id)
                                  }
                                  style={{
                                    position: "absolute",
                                    top: "6px",
                                    right: "6px",
                                    zIndex: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.35)",
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isEditing ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "8px",
                          paddingTop: "4px",
                        }}
                      >
                        <div>
                          <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAddImages}
                            style={{
                              display: "none",
                            }}
                          />

                          <Button
                            icon={<PlusOutlined />}
                            onClick={handleOpenImagePicker}
                          >
                            Thêm ảnh
                          </Button>
                        </div>

                        <Space>
                          <Button onClick={handleCancelEdit}>Hủy</Button>

                          <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            disabled={
                              !editDraft.text.trim() &&
                              editDraft.images.length === 0
                            }
                            onClick={() => handleSaveEditOnUI(item.id)}
                          >
                            Lưu thay đổi
                          </Button>
                        </Space>
                      </div>
                    ) : (
                      <Space
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          style={{
                            color: item.likestatus ? "red" : "#000000",
                            backgroundColor: "#FFFFFF",
                            border: `1px solid ${
                              item.likestatus ? "red" : "#D9D9D9"
                            }`,
                          }}
                        >
                          <GiChestnutLeaf
                            style={{
                              color: item.likestatus ? "red" : "#000000",
                            }}
                          />
                          <span>{item.like ?? 0}</span>
                          Like
                        </Button>

                        <FriendStatusContentDetailsComponent
                          comment_count={item.comment ?? 0}
                          title={displayContent.text}
                          like={item.like ?? 0}
                          shared={item.shared ?? 0}
                          image={displayContent.image}
                          postId={item.id}
                          likeStatus={Boolean(item.likestatus)}
                        />

                        <Button>
                          <VscShare />
                          <span>{item.shared ?? 0}</span>
                          Share
                        </Button>
                      </Space>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </>
  );
};
