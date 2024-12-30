import React from 'react';
import { Avatar, Button, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { IoMdAdd } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';
const { Meta } = Card;
export const ProfileComponent = () => {
    return (
        <div style={{ width: '100%', height: '5%', position: 'relative' }}>
            <Card
                hoverable
                style={{
                    width: "100%",       // Độ rộng 80% của layout cha
                    height: "5%",      // Chiều cao 10% của layout cha
                }}
                cover={<img style={{ height: "230px" }} alt="example" src="https://i.pinimg.com/originals/a0/5c/53/a05c534a95aa48c6423f65d34db97996.gif" />}
            >
                <Meta title={
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar size="large" icon={<UserOutlined />} />
                            <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: "16px" }}>Phạm Tuấn Linh</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button type="primary" style={{ marginRight: '10px' }}><IoMdAdd/>Kết Bạn</Button>
                            <Button type="dashed"><FiSend/>Nhắn Tin</Button>
                        </div>
                    </div>
                } description="" />
            </Card>
        </div>

    );
};