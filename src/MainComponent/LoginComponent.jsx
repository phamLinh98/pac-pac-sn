import { useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { loginByEmailAndPassword } from '../api/restApiConfig';

export const LoginComponent = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('allow-login');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const onFinish = async (values) => {
        try {
            await loginByEmailAndPassword(values.email, values.password);
            navigate("/home");
        } catch (error) {
            console.error(error);
            message.error(`Đăng nhập thất bại: ${error.message}`);
        }
    };
    const goToRegister = () => {
        navigate('/register'); 
    }

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Col xs={20} sm={16} md={12} lg={8}>
                <Card
                    title={<p style={{ textAlign: 'center' }}>Đăng Nhập</p>}
                    bordered={false}
                    style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <img
                            src="https://i.pinimg.com/736x/40/5d/61/405d61bd97581fe4ef00cefd686aa6a3.jpg"
                            alt="Logo"
                            style={{ width: '100px', height: 'auto', borderRadius: '100%' }}
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: '100%', borderRadius: '4px' }}
                                >
                                    Login Password
                                </Button>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button
                                        type="default"
                                        style={{ 
                                            flex: 1, 
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            border: '1px solid #dadce0'
                                        }}
                                    >
                                        <img 
                                            src="https://developers.google.com/identity/images/g-logo.png" 
                                            alt="Google" 
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                        Login Google
                                    </Button>
                                    <Button
                                        onClick={goToRegister}
                                        type="default"
                                        style={{ 
                                            flex: 1, 
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            border: '1px solid #dadce0'
                                        }}
                                    >
                                        <img 
                                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                                            alt="Register" 
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                        Register
                                    </Button>
                                </div>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};