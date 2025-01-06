import React from 'react';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export const LoginComponent = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        // Xử lý đăng nhập tại đây
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Col xs={20} sm={16} md={12} lg={8}>
                <Card
                    title="Đăng Nhập"
                    bordered={false}
                    style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <img
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZveq.png"
                            alt="Logo"
                            style={{ width: '100px', height: 'auto' }}
                        />
                    </div>
                    <Form
                        name="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Tên đăng nhập"
                                style={{ borderRadius: '4px' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Mật khẩu"
                                style={{ borderRadius: '4px' }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: '100%', borderRadius: '4px', marginRight: '5px' }} // Thêm marginRight 5px
                                >
                                    Login Password
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: '100%', borderRadius: '4px' }}
                                >
                                    Login SSO
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};