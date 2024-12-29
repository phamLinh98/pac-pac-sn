import React, { useState, useRef } from 'react';
import { Button, Card, Space } from 'antd';
import { VscShare } from 'react-icons/vsc';
import { ImageStatus } from '../SideComponent/ImageStatus';
import { useFacadeList } from '../reduxs/useFacadeList';
import { FriendStatusContentDetailsComponent } from './FriendStatusContentDetailsComponent';
import { formatTimeStamp } from '../configs/configTimeStamp';
import { GiChestnutLeaf } from 'react-icons/gi';
import { LoadingComponent } from '../SideComponent/LoadingComponent';

export const FriendStatusListComponent = () => {
  const { list, loading } = useFacadeList();
  const maxLength = 150;
  const [isExpanded, setIsExpanded] = useState(false);
  const showAllOrHideTitle = () => {
    setIsExpanded(!isExpanded);
  };

  const containerRefs = useRef([]);

  const handleScrollLeft = (index) => {
    if (containerRefs.current[index]) {
      containerRefs.current[index].scrollLeft -= 200;
    }
  };

  const handleScrollRight = (index) => {
    if (containerRefs.current[index]) {
      containerRefs.current[index].scrollLeft += 200;
    }
  };

  return (
    <>
      {loading ? <LoadingComponent/> : <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {list.map((item, index) => (
          <Card key={item.id} title={
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <ImageStatus width="26px" height="25px" image={item.avatar} style={{ borderRadius: "5px" }} />
              <span>
                <a
                  href="https://ant.design" // Thay đổi URL theo logic của bạn
                  style={{ textDecoration: 'none', color: 'blue' }} // Optional: bỏ gạch chân và giữ màu chữ
                >
                  {item.user_name}
                </a>
                <span style={{ fontSize: '0.7rem', color: 'gray', paddingLeft: "0.8%" }}>
                  {`đã đăng tải bài viết(${formatTimeStamp(item.created_at)})`}
                </span>
              </span>
            </div>
          } size="small">
            <div>
              <p>
                {isExpanded
                  ? item.content.title
                  : `${item.content.title.slice(0, maxLength)}...`}{" "}
                <span
                  onClick={showAllOrHideTitle}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  {isExpanded ? "Ẩn bớt" : " xem tiếp"}{" "}
                </span>
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div
                style={{ position: "relative", width: "100%", overflowX: "hidden" }}
              >
                <button
                  onClick={() => handleScrollLeft(index)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    background: "rgba(0, 0, 0, 0.3)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                </button>

                <div
                  ref={containerRefs.current[index]}
                  style={{
                    display: "flex",
                    gap: "5px",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    scrollbarWidth: "none", // Ẩn thanh cuộn cho Firefox
                    msOverflowStyle: "none", // Ẩn thanh cuộn cho IE
                  }}
                >
                  {item.content.images.map((image, imageIndex) => (
                    <div
                      key={imageIndex}
                      style={{
                        display: 'inline-block',
                        marginRight: "5px",
                        marginBottom: '5px',
                        padding: 0,
                      }}
                    >
                      <ImageStatus image={image} width={200} />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleScrollRight(index)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 0,
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    background: "rgba(0, 0, 0, 0.3)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                </button>
              </div>

              <Space
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button style={{
                  color: "green",
                  backgroundColor: "white",
                  border: "1px solid green"
                }}>
                  <GiChestnutLeaf />
                  <span>{item.like}</span>Like
                </Button>
                <FriendStatusContentDetailsComponent
                  comment_count={item.comment}
                  title={item.content.title}
                  like={item.like}
                  shared={item.shared}
                  image={item.content.images}
                  postId={item.id}
                />
                <Button>
                  <VscShare />
                  <span>{item.shared}</span>Share
                </Button>
              </Space>
            </div>
          </Card>
        ))}
      </div>}
    </>
  );
};