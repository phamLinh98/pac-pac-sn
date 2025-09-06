import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingComponent } from "../SideComponent/LoadingComponent";
import { Modal } from "antd";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleReLogin = () => {
    // Xóa toàn bộ localStorage
    localStorage.clear();
    // Đóng modal
    setShowErrorModal(false);
    // Chuyển hướng về /login
    navigate("/login");
  };

  useEffect(() => {
    // Theo dõi lỗi network cho refresh token endpoint
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Kiểm tra nếu có lỗi 405 từ refresh-token endpoint
        if (response.status === 405 && 
            args[0] && 
            args[0].includes('pac-pac-backend.vercel.app/refesh-token')) {
          setShowErrorModal(true);
        }
        
        return response;
      } catch (error) {
        return originalFetch(...args);
      }
    };

    // Cleanup khi component unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("allow-login");
      // verify
      if (!accessToken) {
        navigate("/login");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Opps',error);
    }
  }, [navigate]);



  if (isLoading) {
    return <div><LoadingComponent /></div>;
  }

  return (
    <>
      {children}
      <Modal
        title="Không thể tải nội dung"
        open={showErrorModal}
        onOk={handleReLogin}
        onCancel={() => setShowErrorModal(false)}
        okText="Đăng Nhập Lại"
        cancelText="Hủy"
        centered
      >
        <p>
          Phiên đăng nhập đã hết hạn
          <br />
          Vui lòng đăng nhập lại.
        </p>
      </Modal>
    </>
  );
};

export default AuthGuard;
