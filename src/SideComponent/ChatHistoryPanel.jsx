import { useState } from 'react';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo';
import { SiMessenger } from "react-icons/si";
import { Divider, List, Avatar, Popover, Modal, Button } from 'antd';
import { useFacadeList } from '../reduxs/useFacadeList';
import { extractUniqueUsers } from "../SideFunction/GetListFriendById";

const ChatHistoryPanel = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const getUserFromLocalStorage = localStorage.getItem("allow-login");
    const getData = decodeJwt(getUserFromLocalStorage);
    const { id } = getData;
    const idToNumber = Number(id);
    const { list } = useFacadeList(idToNumber);
    const getListFriend = extractUniqueUsers(list);
    // Hàm để hiển thị Modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Hàm để đóng Modal và làm mới dữ liệu
    const handleOk = () => {
        setIsModalVisible(false); // Đóng Modal
    };

    // Hàm để đóng Modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const data = [
        {
            message: "Mai mày rảnh không?"
        },
        {
            message: "Gửi tao mượn 100K?"
        },
        {
            message: "Biết thế?"
        },
        {
            message: "Có cl ấy?"
        },
    ];

    // Nội dung của Popover với bố cục Flex
    const popoverContent = (
        <div style={{ display: 'flex', flexDirection: 'column', width: '350px' }}>
            <List
                itemLayout="horizontal"
                dataSource={getListFriend}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={<a href="https://ant.design">{item.name}</a>}
                            description={item.message}
                        />
                    </List.Item>
                )}
            />
            <Button type="primary" onClick={showModal} style={{ marginTop: '8px' }}>
                Xem tất cả tin nhắn
            </Button>
        </div>
    );

    const listChatStyle = () => <>
        <div style={{ textAlign: "center" }}>Danh Sách Trò Chuyện</div>
    </>

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Popover
                content={popoverContent}
                title={listChatStyle}
                placement="bottom"
                trigger="click"
            >
                <div style={{ cursor: 'pointer' }}>
                    <SiMessenger style={{ fontSize: '17px' }} />
                </div>
            </Popover>

            {/* Modal hiển thị khi click vào nút trong Popover */}
            <Modal
                title="Lich Sử Trò Chuyện"
                open={isModalVisible}
                // onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Đóng
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <Divider orientation="right">
                    <Button>Cài đặt</Button>
                </Divider>
                <List
                    itemLayout="horizontal"
                    dataSource={getListFriend}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<a href="https://ant.design">{item.name}</a>}
                                description={item.message}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default ChatHistoryPanel;