import { Image, Button } from "antd";

// eslint-disable-next-line react/prop-types
export const ImageStatus = ({ image, width, height, style, active, preview }) => {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden', // Đảm bảo chấm tròn không tràn ra ngoài
    }}>
      <Image
        width={width}
        height={height}
        src={image}
        style={{
          ...style, // Giữ style ban đầu
          display: 'block', // Đảm bảo không có khoảng trắng thừa
        }}
        preview={preview}
      />
      {active === true ? ( // So sánh nghiêm ngặt với true
        <span
          style={{
            position: 'absolute',
            bottom: '3px',
            left: '15px',
            width: '12px',
            height: '12px',
            backgroundColor: 'green',
            borderRadius: '50%',
            border: '1px solid #fff',
            boxSizing: 'border-box',
          }}
        />
      ) : null} {/* Sử dụng null thay vì string rỗng */}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
export const ImageStatusAvatar = ({ image, width, height, style, active, preview }) => {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden', // Đảm bảo chấm tròn không tràn ra ngoài
    }}>
      <Image
        width={width}
        height={height}
        src={image}
        preview={preview}
        style={{
          ...style, // Giữ style ban đầu
          display: 'block', // Đảm bảo không có khoảng trắng thừa
        }}
      />
      {active === true ? ( // So sánh nghiêm ngặt với true
        <span
          style={{
            position: 'absolute',
            bottom: '7px',
            left: '45px',
            width: '12px',
            height: '12px',
            backgroundColor: 'green',
            borderRadius: '50%',
            border: '1px solid #fff',
            boxSizing: 'border-box',
          }}
        />
      ) : null} {/* Sử dụng null thay vì string rỗng */}
    </div>
  );
};


// Tạo component Item riêng
// eslint-disable-next-line react/prop-types
export const ChatItem = ({ avatar, name }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0 8px 8px' }}>
      <ImageStatusChat
        image={avatar}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '100%',
          border: '3px solid #0000FF',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <span>{name}</span>
      <Button>Chat</Button>
      <Button color="danger" variant="solid">Xóa</Button>
      <Button color="cyan" variant="solid">Lưu trữ</Button>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
export const ImageStatusChat = ({ image, width, height, style }) => {
  return <Image
    width={width}
    height={height}
    src={image}
    style={{
      ...style, // Giữ style ban đầu
      display: 'block', // Đảm bảo không có khoảng trắng thừa
    }}
    preview={false}
  />
};