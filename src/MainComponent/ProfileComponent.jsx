import React, { useRef, useState } from 'react';
import { Avatar, Button, Card, Image, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { IoMdAdd } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';
import { ImageStatus, ImageStatusAvatar } from '../SideComponent/ImageStatus';
import { GiChestnutLeaf } from 'react-icons/gi';
import { VscShare } from 'react-icons/vsc';
import { MdRemoveRedEye } from 'react-icons/md';
import { FriendStatusContentDetailsComponent } from './FriendStatusContentDetailsComponent';
import { LoadingComponent } from '../SideComponent/LoadingComponent';
import { NotListComponent } from '../SideComponent/NoListComponent';
import { formatTimeStamp } from '../configs/configTimeStamp';
import { useParams } from 'react-router-dom';
import { useFacadeListByUserId } from '../reduxs/useFacadeListByUserId';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo.js';
import { MyStatusAreaComponent } from './MyStatusAreaComponent.jsx';

const { Meta } = Card;

export const ProfileComponent = () => {
    const userId = useParams();
    const userIdConverToNumber = +userId.id;
    const { listUserById, loading } = useFacadeListByUserId(userIdConverToNumber);
    const [isExpanded, setIsExpanded] = useState(false);
    const showAllOrHideTitle = () => {
        setIsExpanded(!isExpanded);
    };
    const containerRefs = useRef([]);
    const maxLength = 150;
    const isEmptyObject = (obj) =>
        obj && typeof obj === 'object' && Object.keys(obj).length === 0;
    const getUserFromLocalStorage = localStorage.getItem('accessToken');
    const getData = decodeJwt(getUserFromLocalStorage);
    const { id, name, friends, avatar } = getData;
    return (
        <>
            <div style={{ width: '100%', height: '5%', position: 'relative' }}>
                <Card
                    hoverable
                    style={{ width: "100%", height: "5%" }}
                    cover={
                        <Image
                            style={{ height: "230px", objectFit: "cover" }}
                            alt="example"
                            src="https://i.pinimg.com/originals/a0/5c/53/a05c534a95aa48c6423f65d34db97996.gif"
                            preview={true}
                        />
                    }
                >
                    <Meta
                        title={
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {loading ? (
                                        <LoadingComponent paddingTop='0' />
                                    ) : (
                                        listUserById.slice(0, 1).map((item) => (
                                            <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                                                <ImageStatusAvatar
                                                    active={true}
                                                    size={64} // Cần thiết để Avatar hoạt động đúng kích thước
                                                    icon={<UserOutlined />}
                                                    image={item.avatar ? item.avatar : 'https://i.pinimg.com/736x/8a/a9/33/8aa933d3cd8b23171598ed577c426f78.jpg'}
                                                    style={{
                                                        width: '64px',
                                                        height: '64px',
                                                        border: '5px solid #0000FF',
                                                        borderRadius: '50%',
                                                        boxSizing: 'border-box',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                    }}
                                                />
                                                <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: "16px" }}>
                                                    {item.name}
                                                </span>
                                                <span style={{ marginLeft: '10px', fontSize: "12px", color: "gray" }}>
                                                    ({item.friends} bạn bè) đang online
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',  // Căn giữa theo chiều ngang
                                    alignItems: 'center',      // Căn giữa theo chiều dọc
                                }}>
                                    {loading ? <LoadingComponent paddingTop='0' /> : (
                                        listUserById.slice(0, 1).map((item) => ( // Chỉ lấy phần tử đầu tiên
                                            <React.Fragment key={item.id}>
                                                {item.user_id !== id && ( // Điều kiện hiển thị nút
                                                    <>
                                                        <Button
                                                            type="primary"
                                                            style={{ marginRight: '10px' }}
                                                            icon={<IoMdAdd />} // Đưa icon vào prop icon
                                                        >
                                                            Kết Bạn
                                                        </Button>
                                                        <Button
                                                            type="primary"
                                                            style={{ marginRight: '10px' }}
                                                            icon={<MdRemoveRedEye />}
                                                        >
                                                            Follow
                                                        </Button>
                                                        <Button type="dashed" icon={<FiSend />}>
                                                            Nhắn Tin
                                                        </Button>
                                                    </>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </div>
                            </div>
                        }
                        description=""
                    />
                </Card>
            </div>
            <div style={{ paddingTop: '1%' }}>
                <MyStatusAreaComponent />
            </div>
            {/* TODO123 */}
            {loading ? <LoadingComponent /> : <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingTop: "1%" }}>
                {listUserById.length > 0 ? listUserById.map((item, index) => {
                    return !isEmptyObject(item.content) ? (
                        <Card key={item.id} title={
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <ImageStatus
                                    active={true}
                                    width="26px"
                                    height="25px"
                                    image={item.avatar ? item.avatar : 'https://i.pinimg.com/736x/8a/a9/33/8aa933d3cd8b23171598ed577c426f78.jpg'}
                                    style={{
                                        width: '26px',         /* Đảm bảo width khớp với kích thước ảnh */
                                        height: '25px',        /* Đảm bảo height khớp với kích thước ảnh */
                                        borderRadius: '5px',   /* Giữ border-radius ban đầu */
                                        border: '3px solid #0000FF', /* Màu xanh đậm */
                                        boxSizing: 'border-box', /* Đảm bảo kích thước không bị ảnh hưởng bởi border */
                                        overflow: 'hidden',     /* Cắt bỏ phần border thừa nếu có */
                                        display: 'flex',       /* Để căn giữa nếu cần thiết */
                                        alignItems: 'center',   /* Căn giữa dọc */
                                        justifyContent: 'center',/* Căn giữa ngang */
                                    }}
                                />
                                <span>
                                    <a
                                        style={{ textDecoration: 'none', color: 'blue' }} // Optional: bỏ gạch chân và giữ màu chữ
                                    >
                                        {item.name}
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
                                        <span>
                                            {isExpanded ? (
                                                <>
                                                    <br />
                                                    ẩn
                                                </>
                                            ) : (
                                                "xem tiếp"
                                            )}{" "}
                                        </span>
                                    </span>
                                </p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <div
                                    style={{ position: "relative", width: "100%", overflowX: "hidden" }}
                                >
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
                                        {item.content.images && item.content.images.length > 0 && item.content.images.map((image, imageIndex) => (
                                            <div
                                                key={imageIndex}
                                                style={{
                                                    display: 'inline-block',
                                                    marginRight: "5px",
                                                    marginBottom: '5px',
                                                    padding: 0,
                                                }}
                                            >
                                                <ImageStatus image={image ? image : ''} width={150} height={250} />
                                            </div>
                                        ))}
                                    </div>
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
                                        color: item.likestatus ? 'red' : '#FFFFF',
                                        backgroundColor: "white",
                                        border: `1px solid ${item.likestatus ? 'red' : '#FFFFF'}`
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
                    ) : (
                        <NotListComponent description="Người dùng chưa đăng bài viết" key={item.id} />
                    );
                }) : <NotListComponent description="Người dùng không tồn tại" />}
            </div>}
        </>
    );
};