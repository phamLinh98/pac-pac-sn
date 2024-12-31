import React from 'react';
import { Avatar, Button, Card, Image, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { IoMdAdd } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';
import { ImageStatus } from '../SideComponent/ImageStatus';
import { GiChestnutLeaf } from 'react-icons/gi';
import { VscShare } from 'react-icons/vsc';
const { Meta } = Card;
export const ProfileComponent = () => {
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
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar size={64} icon={<UserOutlined />} src="https://i.pinimg.com/736x/b4/55/1f/b4551f8d549b7e6f7f63d789fa06fb3b.jpg" />
                                <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: "16px" }}>Phạm Tuấn Linh</span>
                                <span style={{ marginLeft: '10px', fontSize: "12px", color:"gray" }}>(128 bạn bè)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button type="primary" style={{ marginRight: '10px' }}><IoMdAdd />Kết Bạn</Button>
                                <Button type="dashed"><FiSend />Nhắn Tin</Button>
                            </div>
                        </div>
                    } description="" />
                </Card>
            </div>

            {/* TODO */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingTop: "2%"}}>
                <Card key={1} title={
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <ImageStatus width="26px" height="25px" image="https://i.pinimg.com/736x/b4/55/1f/b4551f8d549b7e6f7f63d789fa06fb3b.jpg" style={{ borderRadius: "5px" }} />
                        <span>
                            <a
                                onClick={() => { }} // Thay đổi URL theo logic của bạn
                                style={{ textDecoration: 'none', color: 'blue' }} // Optional: bỏ gạch chân và giữ màu chữ
                            >
                                Pham Tuan Linh
                            </a>
                            <span style={{ fontSize: '0.7rem', color: 'gray', paddingLeft: "0.8%" }}>
                                đã đăng tải bài viết
                            </span>
                        </span>
                    </div>
                } size="small">
                    <div>
                        Vẻ đẹp người thiếu nữ nằm trong đôi mắt kẻ si tình.
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div
                            style={{ position: "relative", width: "100%", overflowX: "hidden" }}
                        >
                            <div
                                // ref=""
                                style={{
                                    display: "flex",
                                    gap: "5px",
                                    overflowX: "auto",
                                    whiteSpace: "nowrap",
                                    scrollbarWidth: "none", // Ẩn thanh cuộn cho Firefox
                                    msOverflowStyle: "none", // Ẩn thanh cuộn cho IE
                                }}
                            >
                                {/* Render Image here */}
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
                                <span>100</span>Like
                            </Button>
                            {/* <FriendStatusContentDetailsComponent
                                comment_count="100"
                                title="Demo"
                                like="100"
                                shared="100"
                                image=""
                                // postId={item.id}
                            /> */}
                            <Button>
                                <VscShare />
                                <span>100</span>Share
                            </Button>
                        </Space>
                    </div>
                </Card>
            </div>
        </>
    );
};