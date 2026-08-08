import { useRef } from 'react';
import {
  Button,
  Card,
  Space,
  Popover,
} from 'antd';
import {
  UnorderedListOutlined,
  HistoryOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { VscShare } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

import { ImageStatus } from '../SideComponent/ImageStatus';
import { LoadingComponent } from '../SideComponent/LoadingComponent';
import { NotListComponent } from '../SideComponent/NoListComponent';
import { FriendStatusContentDetailsComponent } from './FriendStatusContentDetailsComponent';
import { useFacadeHomeList } from '../reduxs/useFacadeHomeList';
import { formatTimeStamp } from '../configs/configTimeStamp';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo';
import { PostLikeButton } from '../SideComponent/PostLikeButton';

export const FriendStatusListComponent = () => {
  const token = localStorage.getItem('allow-login');
  const tokenData = decodeJwt(token);

  const currentUserId = Number(tokenData?.id);

  const idToNumber =
    Number.isFinite(currentUserId) &&
    currentUserId > 0
      ? currentUserId
      : null;

  const {
    list,
    error,
    loading,
    hasLoaded,
  } = useFacadeHomeList(idToNumber);

  const safeList = Array.isArray(list)
    ? list
    : Array.isArray(list?.list)
      ? list.list
      : Array.isArray(list?.data)
        ? list.data
        : [];

  const containerRefs = useRef([]);
  const navigate = useNavigate();

  const isInitialLoading =
    Boolean(idToNumber) &&
    (
      loading ||
      !hasLoaded
    );

  const handleNavigate = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleViewPostHistory = (item) => {
    console.log(
      'Xem lịch sử bài viết:',
      item.id
    );

    navigate(`/post-history/${item.id}`);
  };

  const handleHidePost = (item) => {
    console.log(
      'Ẩn bài viết:',
      item.id
    );

    // Gọi API ẩn bài viết tại đây
  };

  const getPostContent = (item) => {
    let content = item?.content;

    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (parseError) {
        console.error(
          'Không thể parse content:',
          parseError
        );

        return {
          title: 'Không có nội dung',
          image: [],
        };
      }
    }

    if (
      content &&
      typeof content === 'object' &&
      !Array.isArray(content)
    ) {
      const rawImages =
        content.image ??
        content.images;

      const images = Array.isArray(rawImages)
        ? rawImages
        : typeof rawImages === 'string' &&
            rawImages.trim()
          ? [rawImages]
          : [];

      return {
        title:
          content.text ||
          'Không có nội dung',
        image: images,
      };
    }

    return {
      title: 'Không có nội dung',
      image: [],
    };
  };

  if (!idToNumber) {
    return (
      <NotListComponent
        description="Không xác định được người dùng"
      />
    );
  }

  if (isInitialLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <NotListComponent
        description={error}
      />
    );
  }

  if (safeList.length === 0) {
    return (
      <NotListComponent
        description="Bảng tin chưa có bài đăng nào"
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      }}
    >
      {safeList.map((item, index) => {
        const content =
          getPostContent(item);

        const ownerName =
          item.user_name ||
          item.name ||
          'Người dùng';

        const createdAt =
          item.created_at ||
          item.createdAt;

        const images =
          content.image || [];

        return (
          <Card
            key={item.id ?? index}
            title={
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent:
                    'space-between',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
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
                      'https://i.pinimg.com/736x/8a/a9/33/8aa933d3cd8b23171598ed577c426f78.jpg'
                    }
                    style={{
                      borderRadius: '5px',
                      border:
                        '3px solid #0000FF',
                      boxSizing:
                        'border-box',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      flexShrink: 0,
                    }}
                  />

                  <div
                    style={{
                      minWidth: 0,
                      display: 'flex',
                      alignItems:
                        'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleNavigate(
                          item.user_id
                        )
                      }
                      style={{
                        padding: 0,
                        border: 0,
                        background:
                          'transparent',
                        color: 'blue',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      {item.user_id !==
                      idToNumber
                        ? ownerName
                        : 'Bạn'}
                    </button>

                    <span
                      style={{
                        fontSize:
                          '0.7rem',
                        color: 'gray',
                        paddingLeft:
                          '6px',
                      }}
                    >
                      {createdAt
                        ? `đã đăng tải bài viết (${formatTimeStamp(
                            createdAt
                          )})`
                        : 'đã đăng tải bài viết'}
                    </span>
                  </div>
                </div>

                <Popover
                  placement="bottomRight"
                  trigger="click"
                  arrow
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
                        width: '210px',
                        display: 'flex',
                        flexDirection:
                          'column',
                        gap: '6px',
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
                            'flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'flex-start',
                          textAlign:
                            'left',
                        }}
                      >
                        Xem lịch sử bài viết
                      </Button>

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
                            'flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'flex-start',
                          textAlign:
                            'left',
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
                    icon={
                      <UnorderedListOutlined
                        style={{
                          fontSize:
                            '18px',
                        }}
                      />
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                    }}
                  />
                </Popover>
              </div>
            }
            size="small"
            style={{
              order:
                item.user_id ===
                idToNumber
                  ? -1
                  : 0,
            }}
          >
            <p>{content.title}</p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  overflowX: 'hidden',
                }}
              >
                <div
                  ref={(element) => {
                    containerRefs.current[
                      index
                    ] = element;
                  }}
                  style={{
                    display: 'flex',
                    gap: '5px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    scrollbarWidth:
                      'none',
                    msOverflowStyle:
                      'none',
                  }}
                >
                  {images.map(
                    (
                      imageUrl,
                      imageIndex
                    ) => (
                      <div
                        key={`${item.id}-${imageIndex}`}
                        style={{
                          display:
                            'inline-block',
                          marginRight:
                            '5px',
                          marginBottom:
                            '5px',
                          padding: 0,
                        }}
                      >
                        <ImageStatus
                          image={
                            imageUrl ||
                            'https://i.pinimg.com/736x/8a/a9/33/8aa933d3cd8b23171598ed577c426f78.jpg'
                          }
                          width={150}
                          height={250}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              <Space
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  justifyContent:
                    'flex-end',
                }}
              >
                <PostLikeButton postId={item.id} initialCount={item.like} initialLiked={item.likestatus} />

                <FriendStatusContentDetailsComponent
                  comment_count={
                    item.comment ?? 0
                  }
                  title={content.title}
                  like={item.like ?? 0}
                  shared={
                    item.shared ?? 0
                  }
                  image={images}
                  postId={item.id}
                  likeStatus={Boolean(
                    item.likestatus
                  )}
                />

                <Button>
                  <VscShare />

                  <span>
                    {item.shared ?? 0}
                  </span>

                  Share
                </Button>
              </Space>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
