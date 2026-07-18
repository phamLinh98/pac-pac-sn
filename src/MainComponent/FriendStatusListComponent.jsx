import { useRef } from 'react';
import { Button, Card, Space } from 'antd';
import { VscShare } from 'react-icons/vsc';
import { ImageStatus } from '../SideComponent/ImageStatus';
import { useFacadeList } from '../reduxs/useFacadeList';
import { FriendStatusContentDetailsComponent } from './FriendStatusContentDetailsComponent';
import { formatTimeStamp } from '../configs/configTimeStamp';
import { GiChestnutLeaf } from 'react-icons/gi';
import { LoadingComponent } from '../SideComponent/LoadingComponent';
import { NotListComponent } from '../SideComponent/NoListComponent';
import { useNavigate } from 'react-router-dom';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo';

export const FriendStatusListComponent = () => {
  const getUserFromLocalStorage = localStorage.getItem('allow-login');
  const getData = decodeJwt(getUserFromLocalStorage);
  const currentUserId = Number(getData?.id);
  const idToNumber = Number.isFinite(currentUserId) && currentUserId > 0 ? currentUserId : null;
  const { list, loading } = useFacadeList(idToNumber);
  const safeList = Array.isArray(list)
    ? list
    : Array.isArray(list?.list)
      ? list.list
      : Array.isArray(list?.data)
        ? list.data
        : [];
  const containerRefs = useRef([]);
  const navigate = useNavigate();

  const handleNavigate = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const getPostContent = (item) => {
    if (item?.content && typeof item.content === 'object' && !Array.isArray(item.content)) {
      return {
        title: item.content.title || 'Không có nội dung',
        images: Array.isArray(item.content.images) ? item.content.images : [],
      };
    }

    return {
      title: item?.title || 'Không có nội dung',
      images: []
    };
  };

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {safeList.length === 0 ? (
            <NotListComponent description={'Bảng tin chưa có bài đăng nào'} />
          ) : (
            safeList.map((item, index) => {
              const content = getPostContent(item);
              const ownerName = item.user_name || item.name || 'Người dùng';
              const createdAt = item.created_at || item.createdAt;
              const images = content.images || [];

              return (
                <Card
                  key={item.id || index}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <ImageStatus
                        active={true}
                        width="26px"
                        height="25px"
                        image={item.avatar || 'https://i.pinimg.com/736x/8a/a9/33/8aa933d3cd8b23171598ed577c426f78.jpg'}
                        style={{
                          borderRadius: '5px',
                          border: '3px solid #0000FF',
                          boxSizing: 'border-box',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      />
                      <span>
                        <a
                          onClick={() => handleNavigate(item.user_id)}
                          style={{ textDecoration: 'none', color: 'blue' }}
                        >
                          {item.user_id !== idToNumber ? ownerName : 'Bạn'}
                        </a>
                        <span style={{ fontSize: '0.7rem', color: 'gray', paddingLeft: '0.8%' }}>
                          {createdAt ? `đã đăng tải bài viết(${formatTimeStamp(createdAt)})` : 'đã đăng tải bài viết'}
                        </span>
                      </span>
                    </div>
                  }
                  size="small"
                  style={{ order: item.user_id === idToNumber ? -1 : 0 }}
                >
                  <div>
                    <p>{content.title}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
                      <div
                        ref={containerRefs.current[index]}
                        style={{
                          display: 'flex',
                          gap: '5px',
                          overflowX: 'auto',
                          whiteSpace: 'nowrap',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                        }}
                      >
                        {images.length > 0
                          ? images.map((image, imageIndex) => (
                              <div
                                key={imageIndex}
                                style={{
                                  display: 'inline-block',
                                  marginRight: '5px',
                                  marginBottom: '5px',
                                  padding: 0,
                                }}
                              >
                                <ImageStatus
                                  image={image || 'https://i.pinimg.com/736x/8a/a9/33/8aa933d3cd8b23171598ed577c426f78.jpg'}
                                  width={150}
                                  height={250}
                                />
                              </div>
                            ))
                          : null}
                      </div>
                    </div>

                    <Space
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        style={{
                          color: item.likestatus ? 'red' : '#FFFFF',
                          backgroundColor: 'white',
                          border: `1px solid ${item.likestatus ? 'red' : '#FFFFF'}`,
                        }}
                      >
                        <GiChestnutLeaf style={{ color: item.likestatus ? 'red' : '#FFFFF' }} />
                        <span>{item.like ?? 0}</span>Like
                      </Button>
                      <FriendStatusContentDetailsComponent
                        comment_count={item.comment ?? 0}
                        title={content.title}
                        like={item.like ?? 0}
                        shared={item.shared ?? 0}
                        image={images.length > 0 ? images : 'https://i.pinimg.com/736x/8a/a9/33/8aa933d3cd8b23171598ed577c426f78.jpg'}
                        postId={item.id}
                        likeStatus={Boolean(item.likestatus)}
                      />
                      <Button>
                        <VscShare />
                        <span>{item.shared ?? 0}</span>Share
                      </Button>
                    </Space>
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
