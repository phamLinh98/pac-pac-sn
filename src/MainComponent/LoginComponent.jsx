import { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import {
  ArrowRightOutlined,
  HeartFilled,
  LockOutlined,
  MailOutlined,
  SafetyCertificateFilled,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loginByEmailAndPassword } from "../api/restApiConfig";
import "./LoginComponent.css";

const LOGO_URL =
  "https://i.pinimg.com/736x/40/5d/61/405d61bd97581fe4ef00cefd686aa6a3.jpg";

export const LoginComponent = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("allow-login")) navigate("/home", { replace: true });
  }, [navigate]);

  const onFinish = async ({ email, password }) => {
    try {
      setSubmitting(true);
      const result = await loginByEmailAndPassword(email.trim(), password);
      if (!result?.success) throw new Error(result?.error || "Đăng nhập thất bại");
      navigate("/home", { replace: true });
    } catch (error) {
      message.error(error?.message || "Không thể đăng nhập. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pac-login-page">
      <div className="pac-login-orb pac-login-orb-one" />
      <div className="pac-login-orb pac-login-orb-two" />

      <section className="pac-login-shell" aria-label="Đăng nhập Pac-Pac">
        <aside className="pac-login-story">
          <div className="pac-login-brand">
            <img src={LOGO_URL} alt="Pac-Pac" />
            <span>pac-pac</span>
          </div>

          <div className="pac-login-story-copy">
            <span className="pac-login-eyebrow"><HeartFilled /> Kết nối theo cách của bạn</span>
            <h1>Chia sẻ khoảnh khắc.<br />Giữ bạn bè ở gần.</h1>
            <p>Một không gian nhỏ cho những câu chuyện, cuộc trò chuyện và những người bạn quan tâm.</p>
          </div>
        </aside>

        <div className="pac-login-form-panel">
          <div className="pac-login-mobile-brand">
            <img src={LOGO_URL} alt="" />
            <span>pac-pac</span>
          </div>

          <div className="pac-login-heading">
            <span className="pac-login-welcome">Chào mừng trở lại</span>
            <h2>Đăng nhập tài khoản</h2>
            <p>Nhập thông tin của bạn để tiếp tục khám phá Pac-Pac.</p>
          </div>

          <Form name="login-form" layout="vertical" requiredMark={false} onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              validateTrigger="onBlur"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email chưa đúng định dạng" },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
              />
            </Form.Item>

            <Button
              className="pac-login-submit"
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={submitting}
            >
              {!submitting && <>Đăng nhập <ArrowRightOutlined /></>}
            </Button>
          </Form>

          <div className="pac-login-register">
            <span>Chưa có tài khoản?</span>
            <Button type="link" onClick={() => navigate("/register")}>Tạo tài khoản mới</Button>
          </div>

          <div className="pac-login-secure"><LockOutlined /> Kết nối được bảo mật</div>
        </div>
      </section>
    </main>
  );
};
