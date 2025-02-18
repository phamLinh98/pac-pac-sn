import { Image } from "antd";

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

export const ImageStatusAvatar = ({ image, width, height, style, active, preview}) => {
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