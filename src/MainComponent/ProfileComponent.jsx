import {
  useRef,
  useState,
} from "react";
import {
  Button,
  Card,
  Image,
  Popover,
  Space,
} from "antd";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  HistoryOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { IoIosPersonAdd } from "react-icons/io";
import { FiSend } from "react-icons/fi";
import { GiChestnutLeaf } from "react-icons/gi";
import { VscShare } from "react-icons/vsc";
import { MdRemoveRedEye } from "react-icons/md";
import { BsSendPlus } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ImageStatus,
  ImageStatusAvatar,
} from "../SideComponent/ImageStatus";
import { FriendStatusContentDetailsComponent } from "./FriendStatusContentDetailsComponent";
import { LoadingComponent } from "../SideComponent/LoadingComponent";
import { NotListComponent } from "../SideComponent/NoListComponent";
import { formatTimeStamp } from "../configs/configTimeStamp";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo.js";
import { MyStatusAreaComponent } from "./MyStatusAreaComponent.jsx";
import { ModalComponent } from "../SideComponent/ModalComponent.jsx";
import { useFacadeMyProfileList } from "../reduxs/useFacadeMyStatusProfile.jsx";
import { checkValueInArrayGetData } from "../SideFunction/CheckValueInArray.js";

const { Meta } = Card;

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
      .filter(
        (image) =>
          typeof image === "string" &&
          image.trim() !== ""
      )
      .map((image) => image.trim());
  }

  if (typeof rawImages === "string") {
    const trimmedImages =
      rawImages.trim();

    if (!trimmedImages) {
      return [];
    }

    try {
      const parsedImages =
        JSON.parse(trimmedImages);

      return normalizeImages(
        parsedImages
      );
    } catch {
      return [trimmedImages];
    }
  }

  return [];
};

const normalizeContent = (
  rawContent
) => {
  if (!rawContent) {
    return {
      text: "",
      image: [],
    };
  }

  let parsedContent = rawContent;

  if (
    typeof rawContent === "string"
  ) {
    const trimmedContent =
      rawContent.trim();

    if (!trimmedContent) {
      return {
        text: "",
        image: [],
      };
    }

    try {
      parsedContent = JSON.parse(
        trimmedContent
      );
    } catch (error) {
      console.error(
        "Không thể parse content của bài viết:",
        rawContent,
        error
      );

      return {
        text: trimmedContent,
        image: [],
      };
    }
  }

  if (
    !parsedContent ||
    typeof parsedContent !==
      "object" ||
    Array.isArray(parsedContent)
  ) {
    return {
      text: "",
      image: [],
    };
  }

  return {
    text:
      parsedContent.text ??
      parsedContent.title ??
      "",
    image: normalizeImages(
      parsedContent.image ??
        parsedContent.images
    ),
  };
};

const hasPostContent = (content) => {
  return Boolean(
    content.text.trim() ||
      content.image.length > 0
  );
};

export const ProfileComponent = () => {
  const {
    id: profileIdParam,
  } = useParams();

  const navigate = useNavigate();

  const profileUserId = Number(
    profileIdParam
  );

  const {
    listUserById,
    loading,
  } = useFacadeMyProfileList(
    profileUserId
  );

  const safeListUserById =
    Array.isArray(listUserById)
      ? listUserById
      : Array.isArray(
            listUserById?.list
          )
        ? listUserById.list
        : Array.isArray(
              listUserById?.data
            )
          ? listUserById.data
          : [];

  const profileUser =
    safeListUserById.length > 0
      ? safeListUserById[0]
      : null;

  const containerRefs = useRef([]);

  const token =
    localStorage.getItem(
      "allow-login"
    );

  let loginUser = {};

  try {
    loginUser = token
      ? decodeJwt(token) ?? {}
      : {};
  } catch (error) {
    console.error(
      "Không thể decode JWT:",
      error
    );
  }

  const loginUserId = Number(
    loginUser?.id
  );

  const isOwnProfile =
    Number.isFinite(loginUserId) &&
    Number.isFinite(profileUserId) &&
    loginUserId === profileUserId;

  const friendIdList = Array.isArray(
    loginUser?.list_friend_id
  )
    ? loginUser.list_friend_id
    : [];

  const checkIsFriend =
    checkValueInArrayGetData(
      friendIdList,
      profileIdParam
    );

  const [addFriend, setAddFriend] =
    useState(false);

  const [isFollow, setIsFollow] =
    useState(false);

  const [openAvatar, setOpenAvatar] =
    useState(false);

  const [openBG, setOpenBG] =
    useState(false);

  const [openPostMenuId, setOpenPostMenuId] =
    useState(null);

  const clickToAddFriend = () => {
    setAddFriend(
      (previousValue) =>
        !previousValue
    );
  };

  const clickToFollow = () => {
    setIsFollow(
      (previousValue) =>
        !previousValue
    );
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

  const handleViewPostHistory = (
    item
  ) => {
    closePostMenu();

    console.log(
      "Xem lịch sử bài viết:",
      item.id
    );

    navigate(
      `/post-history/${item.id}`
    );
  };

  const handleEditPost = (item) => {
    closePostMenu();

    console.log(
      "Chỉnh sửa bài viết:",
      item.id
    );

    navigate(`/post/edit/${item.id}`);
  };

  const handleHidePost = (item) => {
    closePostMenu();

    console.log(
      "Ẩn bài viết:",
      item.id
    );

    /*
     * Gọi API ẩn bài viết ở đây.
     *
     * Ví dụ:
     *
     * await hidePostAPI(item.id);
     *
     * Sau khi thành công:
     * - fetch lại danh sách bài viết
     * hoặc
     * - xóa bài viết khỏi Redux state
     */
  };

  const normalizedPostList =
    safeListUserById
      .map((item) => ({
        ...item,
        normalizedContent:
          normalizeContent(
            item?.content
          ),
      }))
      .filter((item) =>
        hasPostContent(
          item.normalizedContent
        )
      );

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
                  justifyContent:
                    "space-between",
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
                        display:
                          "flex",
                        alignItems:
                          "center",
                        flexWrap:
                          "wrap",
                        gap: "5px",
                      }}
                    >
                      <ImageStatusAvatar
                        active
                        size={64}
                        icon={
                          <UserOutlined />
                        }
                        image={
                          profileUser.avatar ||
                          DEFAULT_AVATAR
                        }
                        style={{
                          width:
                            "64px",
                          height:
                            "64px",
                          border:
                            "5px solid #0000FF",
                          borderRadius:
                            "50%",
                          boxSizing:
                            "border-box",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          overflow:
                            "hidden",
                        }}
                      />

                      <span
                        style={{
                          marginLeft:
                            "10px",
                          fontWeight:
                            "bold",
                          fontSize:
                            "16px",
                        }}
                      >
                        {profileUser.name ||
                          profileUser.user_name ||
                          "Người dùng"}
                      </span>

                      <span
                        style={{
                          marginLeft:
                            "10px",
                          fontSize:
                            "12px",
                          color:
                            "gray",
                        }}
                      >
                        (
                        {profileUser.friends ??
                          0}{" "}
                        bạn bè)
                      </span>

                      {isOwnProfile && (
                        <div
                          style={{
                            display:
                              "flex",
                            gap: "5px",
                            marginLeft:
                              "5px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <Button
                            onClick={
                              showModalAvatar
                            }
                          >
                            Thay avatar
                          </Button>

                          <Button
                            onClick={
                              showModalBG
                            }
                          >
                            Thay ảnh bìa
                          </Button>

                          <ModalComponent
                            open={
                              openAvatar
                            }
                            hideModal={
                              hideModalAvatar
                            }
                            id={
                              loginUserId
                            }
                          />

                          <ModalComponent
                            open={openBG}
                            hideModal={
                              hideModalBG
                            }
                            id={
                              loginUserId
                            }
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>
                      Người dùng không tồn
                      tại
                    </span>
                  )}
                </div>

                {!loading &&
                  profileUser &&
                  !isOwnProfile && (
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "center",
                        alignItems:
                          "center",
                        flexWrap:
                          "wrap",
                        gap: "10px",
                      }}
                    >
                      {checkIsFriend ? (
                        <Button
                          icon={
                            <FaUserFriends />
                          }
                          onClick={
                            clickToAddFriend
                          }
                        >
                          Bạn bè
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          icon={
                            addFriend ? (
                              <BsSendPlus />
                            ) : (
                              <IoIosPersonAdd />
                            )
                          }
                          onClick={
                            clickToAddFriend
                          }
                        >
                          {addFriend
                            ? "Đã gửi lời mời"
                            : "Kết bạn"}
                        </Button>
                      )}

                      <Button
                        type="primary"
                        icon={
                          <MdRemoveRedEye />
                        }
                        onClick={
                          clickToFollow
                        }
                      >
                        {isFollow
                          ? "Đã theo dõi"
                          : "Theo dõi"}
                      </Button>

                      <Button
                        type="dashed"
                        icon={
                          <FiSend />
                        }
                      >
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
          <MyStatusAreaComponent />
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
          {safeListUserById.length ===
          0 ? (
            <NotListComponent description="Người dùng không tồn tại" />
          ) : normalizedPostList.length ===
            0 ? (
            <NotListComponent description="Người dùng chưa có bài viết nào" />
          ) : (
            normalizedPostList.map(
              (item, index) => {
                const content =
                  item.normalizedContent;

                const ownerName =
                  item.name ||
                  item.user_name ||
                  "Người dùng";

                const postOwnerId =
                  Number(item.user_id);

                const isOwnPost =
                  Number.isFinite(
                    loginUserId
                  ) &&
                  Number.isFinite(
                    postOwnerId
                  ) &&
                  loginUserId ===
                    postOwnerId;

                const postKey =
                  item.id ??
                  `${item.user_id}-${index}`;

                return (
                  <Card
                    key={postKey}
                    title={
                      <div
                        style={{
                          width:
                            "100%",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "5px",
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <ImageStatus
                            active
                            width="26px"
                            height="25px"
                            image={
                              item.avatar ||
                              DEFAULT_AVATAR
                            }
                            style={{
                              width:
                                "26px",
                              height:
                                "25px",
                              borderRadius:
                                "5px",
                              border:
                                "3px solid #0000FF",
                              boxSizing:
                                "border-box",
                              overflow:
                                "hidden",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              flexShrink: 0,
                            }}
                          />

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              flexWrap:
                                "wrap",
                              minWidth: 0,
                            }}
                          >
                            <span
                              style={{
                                textDecoration:
                                  "none",
                                color:
                                  "blue",
                                fontWeight:
                                  500,
                              }}
                            >
                              {isOwnPost
                                ? "Bạn"
                                : ownerName}
                            </span>

                            <span
                              style={{
                                fontSize:
                                  "0.7rem",
                                color:
                                  "gray",
                                paddingLeft:
                                  "6px",
                              }}
                            >
                              {item.created_at
                                ? `đã đăng tải bài viết (${formatTimeStamp(
                                    item.created_at
                                  )})`
                                : "đã đăng tải bài viết"}
                            </span>
                          </div>
                        </div>

                        <Popover
                          placement="bottomRight"
                          trigger="click"
                          arrow
                          open={
                            openPostMenuId ===
                            postKey
                          }
                          onOpenChange={(
                            open
                          ) => {
                            setOpenPostMenuId(
                              open
                                ? postKey
                                : null
                            );
                          }}
                          title={
                            <span
                              style={{
                                fontWeight:
                                  600,
                              }}
                            >
                              Tùy chọn bài viết
                            </span>
                          }
                          content={
                            <div
                              style={{
                                width:
                                  "220px",
                                display:
                                  "flex",
                                flexDirection:
                                  "column",
                                gap: "5px",
                              }}
                            >
                              <Button
                                type="text"
                                block
                                icon={
                                  <HistoryOutlined />
                                }
                                onClick={() =>
                                  handleViewPostHistory(
                                    item
                                  )
                                }
                                style={{
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "flex-start",
                                  textAlign:
                                    "left",
                                }}
                              >
                                Xem lịch sử bài viết
                              </Button>

                              {isOwnPost && (
                                <Button
                                  type="text"
                                  block
                                  icon={
                                    <EditOutlined />
                                  }
                                  onClick={() =>
                                    handleEditPost(
                                      item
                                    )
                                  }
                                  style={{
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "flex-start",
                                    textAlign:
                                      "left",
                                  }}
                                >
                                  Chỉnh sửa bài viết
                                </Button>
                              )}

                              <Button
                                type="text"
                                block
                                icon={
                                  <EyeInvisibleOutlined />
                                }
                                onClick={() =>
                                  handleHidePost(
                                    item
                                  )
                                }
                                style={{
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "flex-start",
                                  textAlign:
                                    "left",
                                }}
                              >
                                Ẩn bài viết
                              </Button>
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
                                  fontSize:
                                    "18px",
                                }}
                              />
                            }
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();
                            }}
                            style={{
                              flexShrink: 0,
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                            }}
                          />
                        </Popover>
                      </div>
                    }
                    size="small"
                  >
                    {content.text && (
                      <div>
                        <p>
                          {content.text}
                        </p>
                      </div>
                    )}

                    <div
                      style={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap: "2px",
                      }}
                    >
                      {content.image
                        .length > 0 && (
                        <div
                          style={{
                            position:
                              "relative",
                            width:
                              "100%",
                            overflowX:
                              "hidden",
                          }}
                        >
                          <div
                            ref={(
                              element
                            ) => {
                              containerRefs.current[
                                index
                              ] =
                                element;
                            }}
                            style={{
                              display:
                                "flex",
                              gap: "5px",
                              overflowX:
                                "auto",
                              whiteSpace:
                                "nowrap",
                              scrollbarWidth:
                                "none",
                              msOverflowStyle:
                                "none",
                            }}
                          >
                            {content.image.map(
                              (
                                imageUrl,
                                imageIndex
                              ) => (
                                <div
                                  key={`${item.id}-${imageIndex}`}
                                  style={{
                                    display:
                                      "inline-block",
                                    flexShrink: 0,
                                    marginRight:
                                      "5px",
                                    marginBottom:
                                      "5px",
                                    padding: 0,
                                  }}
                                >
                                  <ImageStatus
                                    image={
                                      imageUrl
                                    }
                                    width={
                                      150
                                    }
                                    height={
                                      250
                                    }
                                    preview
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      <Space
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display:
                            "flex",
                          justifyContent:
                            "flex-end",
                        }}
                      >
                        <Button
                          style={{
                            color:
                              item.likestatus
                                ? "red"
                                : "#000000",
                            backgroundColor:
                              "#FFFFFF",
                            border: `1px solid ${
                              item.likestatus
                                ? "red"
                                : "#D9D9D9"
                            }`,
                          }}
                        >
                          <GiChestnutLeaf
                            style={{
                              color:
                                item.likestatus
                                  ? "red"
                                  : "#000000",
                            }}
                          />

                          <span>
                            {item.like ??
                              0}
                          </span>

                          Like
                        </Button>

                        <FriendStatusContentDetailsComponent
                          comment_count={
                            item.comment ??
                            0
                          }
                          title={
                            content.text
                          }
                          like={
                            item.like ?? 0
                          }
                          shared={
                            item.shared ??
                            0
                          }
                          image={
                            content.image
                          }
                          postId={
                            item.id
                          }
                          likeStatus={Boolean(
                            item.likestatus
                          )}
                        />

                        <Button>
                          <VscShare />

                          <span>
                            {item.shared ??
                              0}
                          </span>

                          Share
                        </Button>
                      </Space>
                    </div>
                  </Card>
                );
              }
            )
          )}
        </div>
      )}
    </>
  );
};
