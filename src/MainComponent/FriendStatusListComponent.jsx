import { useRef } from 'react';
import { Button, Card, Space } from 'antd';
import { VscShare } from 'react-icons/vsc';
import { GiChestnutLeaf } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

import { ImageStatus } from '../SideComponent/ImageStatus';
import { LoadingComponent } from '../SideComponent/LoadingComponent';
import { NotListComponent } from '../SideComponent/NoListComponent';
import { FriendStatusContentDetailsComponent } from './FriendStatusContentDetailsComponent';
import { useFacadeList } from '../reduxs/useFacadeList';
import { formatTimeStamp } from '../configs/configTimeStamp';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo';

export const FriendStatusListComponent = () => {
  const token = localStorage.getItem('allow-login');
  const tokenData = decodeJwt(token);

  const currentUserId = Number(tokenData?.id);

  const idToNumber =
    Number.isFinite(currentUserId) && currentUserId > 0
      ? currentUserId
      : null;

  const {
    list,
    error,
    loading,
    hasLoaded,
  } = useFacadeList(idToNumber);

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
      const images = Array.isArray(content.image)
        ? content.image
        : typeof content.image === 'string' &&
            content.image.trim()
          ? [content.image]
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
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
                    alignItems: 'center',
                    justifyContent:
                      'center',
                  }}
                />

                <span>
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
                    }}
                  >
                    {item.user_id !==
                    idToNumber
                      ? ownerName
                      : 'Bạn'}
                  </button>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'gray',
                      paddingLeft: '0.8%',
                    }}
                  >
                    {createdAt
                      ? `đã đăng tải bài viết (${formatTimeStamp(
                          createdAt
                        )})`
                      : 'đã đăng tải bài viết'}
                  </span>
                </span>
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
                <Button
                  style={{
                    color: item.likestatus
                      ? 'red'
                      : '#595959',
                    backgroundColor: 'white',
                    border: `1px solid ${
                      item.likestatus
                        ? 'red'
                        : '#d9d9d9'
                    }`,
                  }}
                >
                  <GiChestnutLeaf
                    style={{
                      color: item.likestatus
                        ? 'red'
                        : '#595959',
                    }}
                  />

                  <span>{item.like ?? 0}</span>
                  <span>Like</span>
                </Button>

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
