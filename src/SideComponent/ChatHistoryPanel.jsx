import { useState, useEffect } from 'react';
import { Popover, Modal, Button } from 'antd';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo';
import { SiMessenger } from "react-icons/si";
import { Divider, List, Typography } from 'antd';
import { ChatItem } from "./ImageStatus";

const ChatHistoryPanel = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const getUserFromLocalStorage = localStorage.getItem("allow-login");
    const getData = decodeJwt(getUserFromLocalStorage);
    const { id, avatar, name } = getData;

    const idToNumber = +id;
    // Hàm lấy danh sách yêu cầu kết bạn
    const fetchFriendRequests = async () => {

    };

    // useEffect để gọi API khi component được mount
    useEffect(() => {
        fetchFriendRequests();
    }, [idToNumber]); // Gọi lại API nếu idToNumber thay đổi

    // Hàm để hiển thị Modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Hàm để đóng Modal và làm mới dữ liệu
    const handleOk = () => {
        fetchFriendRequests(); // Làm mới danh sách thông báo
        setIsModalVisible(false); // Đóng Modal
    };

    // Hàm để đóng Modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const data = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.',
    ];

    // Nội dung của Popover với bố cục Flex
    const popoverContent = (
        <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
            <List
                bordered
                dataSource={data}
                // eslint-disable-next-line no-unused-vars
                renderItem={(item) => <ChatItem avatar={avatar} name={name} />}
            />
            <Button type="primary" onClick={showModal} style={{ marginTop: '8px' }}>
                Xem tất cả
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
                onOk={handleOk}
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
                    bordered
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text mark>[ITEM]</Typography.Text> {item}
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default ChatHistoryPanel;