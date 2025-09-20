import { useState } from 'react';
import { Popover, Button } from 'antd';
import { GrNotification } from "react-icons/gr";
import { List, Avatar } from 'antd';

const NotificationsPanel = () => {
    // eslint-disable-next-line no-unused-vars
    const [isModalVisible, setIsModalVisible] = useState(false);
    // Hàm để hiển thị Modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    const data = [
        {
            title: 'A đã bình luận về bài viết',
        },
        {
            title: 'B đã bình luận về bài viết',
        },
        {
            title: 'C đã bình luận về bài viết',
        },
        {
            title: 'D đã bình luận về bài viết',
        },
    ];


    // Hàm để đóng Modal
    // Nội dung của Popover với bố cục Flex
    const popoverContent = (
        <div style={{ display: 'flex', flexDirection: 'column', width: '350px' }}>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                            title={<a href="https://ant.design">{item.title}</a>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                )}
            />
            <Button type="primary" onClick={showModal} style={{ marginTop: '8px' }}>
                Xem tất cả
            </Button>
        </div>
    );

    const listChatStyle = () => <>
        <div style={{ textAlign: "center" }}>Danh Sách Thông Báo</div>
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
                    <GrNotification style={{ fontSize: '17px' }} />
                </div>
            </Popover>
        </div>
    );
};

export default NotificationsPanel;