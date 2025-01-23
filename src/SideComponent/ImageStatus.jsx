import { Image } from "antd";
export const ImageStatus = ({ image, width, height, style }) => (
  <Image
    width={width}
    height={height}
    src={image}
    style={style}
  />
);
