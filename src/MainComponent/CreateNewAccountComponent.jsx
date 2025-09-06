import { useState } from 'react';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  RocketOutlined,
  HeartOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Checkbox,
  Card,
  Typography,
  Divider,
  Progress,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { createNewUser } from '../api/restApiConfig';

const { Title, Text } = Typography;

export const CreateNewAccountComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const backToLogin = () => {
    navigate('/login'); // Adjust the path as necessary
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const onPasswordChange = (e) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStatus = () => {
    if (passwordStrength < 50) return 'exception';
    if (passwordStrength < 75) return 'normal';
    return 'success';
  };

  const getPasswordText = () => {
    if (passwordStrength < 25) return 'Yếu';
    if (passwordStrength < 50) return 'Trung bình';
    if (passwordStrength < 75) return 'Mạnh';
    return 'Rất mạnh';
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userInfo = {
        name: values.fullName,
        email: values.email,
        password: values.password
      };
      
      const response = await createNewUser(userInfo);
      
      if (response && response.ok) {
        message.success('🎉 Tài khoản đã được tạo thành công!');
        // Reset form sau khi tạo thành công
        form.resetFields();
        setPasswordStrength(0);
        // Chuyển hướng về trang login sau khi tạo tài khoản thành công
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // Xử lý lỗi từ server
        const errorData = await response.json();
        message.error(errorData.message || 'Có lỗi xảy ra khi tạo tài khoản, vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      if (error.message.includes('email')) {
        message.error('Email đã được sử dụng, vui lòng chọn email khác!');
      } else {
        message.error('Có lỗi xảy ra, vui lòng kiểm tra kết nối mạng và thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: 16,
          border: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ 
            fontSize: 48, 
            marginBottom: 16,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            <RocketOutlined />
          </div>
          <Title level={2} style={{ 
            margin: 0, 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Tạo tài khoản mới
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Tham gia cộng đồng của chúng tôi ngay hôm nay! ✨
          </Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
              { max: 50, message: 'Tên không được quá 50 ký tự!' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#667eea' }} />}
              placeholder="Họ và tên"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
              { max: 100, message: 'Email không được quá 100 ký tự!' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#667eea' }} />}
              placeholder="Email"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
              { max: 50, message: 'Mật khẩu không được quá 50 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#667eea' }} />}
              placeholder="Mật khẩu"
              onChange={onPasswordChange}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          {passwordStrength > 0 && (
            <div style={{ marginBottom: 24 }}>
              <Progress
                percent={passwordStrength}
                status={getPasswordStatus()}
                size="small"
                showInfo={false}
                strokeColor={{
                  from: '#ff7875',
                  to: '#52c41a',
                }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Độ mạnh mật khẩu: <strong>{getPasswordText()}</strong>
              </Text>
            </div>
          )}

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#667eea' }} />}
              placeholder="Xác nhận mật khẩu"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Divider />
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!')) }
            ]}
          >
            <Checkbox>
              Tôi đồng ý với <a href="#" style={{ color: '#667eea' }}>Điều khoản sử dụng</a> và{' '}
              <a href="#" style={{ color: '#667eea' }}>Chính sách bảo mật</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: 48,
                borderRadius: 8,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                border: 'none',
                fontSize: 16,
                fontWeight: 'bold',
              }}
              icon={<HeartOutlined />}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản ngay'}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Text type="secondary">
              Đã có tài khoản?{' '}
              <a href="#" style={{ color: '#667eea', fontWeight: 'bold' }} onClick={backToLogin}>
                Đăng nhập ngay <StarOutlined />
              </a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};