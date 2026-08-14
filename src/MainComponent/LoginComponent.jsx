import { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import {
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
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
            <span className="pac-login-wordmark" aria-label="PacPac">
              <span>Pac</span><span>Pac</span><i>●</i>
            </span>
          </div>

        </aside>

        <div className="pac-login-form-panel">
          <div className="pac-login-mobile-brand">
            <img src={LOGO_URL} alt="" />
            <span className="pac-login-wordmark" aria-label="PacPac">
              <span>Pac</span><span>Pac</span><i>●</i>
            </span>
          </div>

          <div className="pac-login-heading">
            <span className="pac-login-welcome"><i /> Chào bạn, lâu rồi không gặp!</span>
            <h2>Tiếp tục cùng <strong>PacPac</strong></h2>
            <p>Đăng nhập để xem những câu chuyện mới nhất từ bạn bè của bạn.</p>
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
