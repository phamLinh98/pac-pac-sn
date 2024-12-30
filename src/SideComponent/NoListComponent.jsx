import { Empty } from "antd";

export const NotListComponent = ({description}="Bảng tin chưa có bài đăng nào") => {
    return <Empty description={description} />
};