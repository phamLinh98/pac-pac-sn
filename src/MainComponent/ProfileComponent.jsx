import React from 'react';
import { Avatar, Button, Card, Image, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { IoMdAdd } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';
import { ImageStatus } from '../SideComponent/ImageStatus';
import { GiChestnutLeaf } from 'react-icons/gi';
import { VscShare } from 'react-icons/vsc';
import { MdRemoveRedEye } from 'react-icons/md';
import { FriendStatusContentDetailsComponent } from './FriendStatusContentDetailsComponent';
import { LoadingComponent } from '../SideComponent/LoadingComponent';
import { NotListComponent } from '../SideComponent/NoListComponent';
import { formatTimeStamp } from '../configs/configTimeStamp';
import { useFacadeListByUserId } from '../reduxs/useFacadeListByUserId';
import { useParams } from 'react-router-dom';
const { Meta } = Card;
export const ProfileComponent = () => {
    const userId = useParams();
    const userIdConverToNumber = +userId.id;
    const { listUserById, loading } = useFacadeListByUserId(userIdConverToNumber);
    return (
        <>
            <div style={{ width: '100%', height: '5%', position: 'relative' }}>
                <Card
                    hoverable
                    style={{
                        width: "100%",
                        height: "5%",
                    }}
                    cover={<Image
                        style={{ height: "230px", objectFit: "cover" }} // Tùy chỉnh chiều cao và cách hiển thị ảnh
                        alt="example"
                        src="https://i.pinimg.com/originals/a0/5c/53/a05c534a95aa48c6423f65d34db97996.gif"
                        preview={true} // Bật tính năng preview
                    />}
                >
                    <Meta title={
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                        }}>
                            {listUserById.map((item) => <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar size={64} icon={<UserOutlined />} src={item.avatar}/>
                                <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: "16px" }}>{item.name}</span>
                                <span style={{ marginLeft: '10px', fontSize: "12px", color: "gray" }}>(128 bạn bè)</span>
                            </div>)}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button type="primary" style={{ marginRight: '10px' }}><IoMdAdd />Kết Bạn</Button>
                                <Button type="primary" style={{ marginRight: '10px' }}><MdRemoveRedEye />Follow</Button>
                                <Button type="dashed"><FiSend />Nhắn Tin</Button>
                            </div>
                        </div>
                    } description="" />
                </Card>
            </div>

            {/* TODO */}
            {loading ? <LoadingComponent /> : <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingTop: "1%" }}>
                {listUserById.length <= 0 ? <NotListComponent description="Chưa có bài đăng nào" /> : listUserById.map((item, index) => (
                    <Card key={item.id} title={
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <ImageStatus width="26px" height="25px" image={item.avatar} style={{ borderRadius: "5px" }} />
                            <span>
                                <a
                                    //onClick={handleNavigate} // Thay đổi URL theo logic của bạn
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
                            {/* <p>
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
                            </p> */}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <div
                                style={{ position: "relative", width: "100%", overflowX: "hidden" }}
                            >
                                <div
                                    // ref={containerRefs.current[index]}
                                    style={{
                                        display: "flex",
                                        gap: "5px",
                                        overflowX: "auto",
                                        whiteSpace: "nowrap",
                                        scrollbarWidth: "none", // Ẩn thanh cuộn cho Firefox
                                        msOverflowStyle: "none", // Ẩn thanh cuộn cho IE
                                    }}
                                >
                                    {item.content.images.length > 0 && item.content.images.map((image, imageIndex) => (
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