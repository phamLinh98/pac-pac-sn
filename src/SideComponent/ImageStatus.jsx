import { Image } from "antd";
export const ImageStatus = ({image, width}) => (
  <Image
    width={width}
    src={image}
  />
);
