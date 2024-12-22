import React, { useState, useRef } from 'react';
import { Button, Card, Space } from 'antd';
import { SlLike } from 'react-icons/sl';
import { VscShare } from 'react-icons/vsc';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { ImageStatus } from '../SideComponent/ImageStatus';
import { FriendStatusButtonModalComponent } from './FriendStatusContentDetailsComponent';
import { useFacadeList } from '../reduxs/useFacadeList';

export const FriendStatusListComponent = () => {
  // facade cho list
  const { list, loading } = useFacadeList();
  console.log('list1', list);
  console.log('loading', loading);

  // Đặt giới hạn ký tự mỗi dòng
  const maxLength = 150;

  // Ẩn bớt hoặc Show hết Title bài viết
  const [isExpanded, setIsExpanded] = useState(false);
  const showAllOrHideTitle = () => {
    setIsExpanded(!isExpanded);
  };

  // Du lieu chua loading ra se show Loading...
  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Sử dụng mảng ref để mỗi item có một ref riêng biệt
  const containerRefs = useRef([]);

  // left button
  const handleScrollLeft = (index) => {
    if (containerRefs.current[index]) {
      containerRefs.current[index].scrollLeft -= 200;
    }
  };

  // right button
  const handleScrollRight = (index) => {
    if (containerRefs.current[index]) {
      containerRefs.current[index].scrollLeft += 200;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {list.length > 0 &&
        list.map((item, index) => (
          <Card key={item.id} title={`${item.id} đã đăng tải bài viết (10p)`} size="small">
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

            {/* Flex container for UploadImage */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {/* Nút cuộn trái */}
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
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  <TiChevronLeft />
                </button>

                {/* Container ảnh */}
                <div
                  ref={(el) => (containerRefs.current[index] = el)}
                  style={{
                    display: "flex",
                    gap: "5px",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    scrollbarWidth: "none", // Ẩn thanh cuộn cho Firefox
                    msOverflowStyle: "none", // Ẩn thanh cuộn cho IE
                  }}
                >
                  {item.content.images.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'inline-block',
                        marginRight: "5px", // Để tránh khoảng trống cuối
                        marginBottom: '5px', // Nếu muốn giữ margin dưới các hình ảnh
                        padding: 0, // Bỏ padding nếu có
                      }}
                    >
                      <ImageStatus image={image} width={200} />
                    </div>
                  ))}
                </div>

                {/* Nút cuộn phải */}
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
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  <TiChevronRight />
                </button>
              </div>

              {/* Các button Like, Share và comment */}
              <Space
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button>
                  <SlLike />
                  <span>{item.like}</span>Like
                </Button>
                <FriendStatusButtonModalComponent
                  comment_count={item.comment}
                  title={item.content.title}
                  like={item.like}
                  shared={item.shared}
                  image={item.content.images}
                />
                <Button>
                  <VscShare />
                  <span>{item.shared}</span>Share
                </Button>
              </Space>
            </div>
          </Card>
        ))}
    </div>
  );
};
