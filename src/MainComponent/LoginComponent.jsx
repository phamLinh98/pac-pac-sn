import React from 'react';
import { Form, Input, Button, Card, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { loginByEmailAndPassword } from '../api/restApiConfig';

export const LoginComponent = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            await loginByEmailAndPassword(values.email, values.password);
            console.log('login thanh cong');
            navigate("/home");
        } catch (error) {
            console.error(error);
            message.error(`Đăng nhập thất bại: ${error.message}`);
        }
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
                            src="https://i.pinimg.com/736x/e7/23/37/e7233741efa8cc3971e5964cffbcbdcb.jpg"
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
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Email đăng nhập"
                                style={{ borderRadius: '4px' }}
                                autoComplete="email"
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
                                autoComplete="current-password"
                            />
                        </Form.Item>


                        <Form.Item>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: '100%', borderRadius: '4px', marginRight: '5px' }}
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