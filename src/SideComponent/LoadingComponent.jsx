import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const LoadingComponent = () => {
    return <Spin indicator={<LoadingOutlined spin />} size="middle" style={{paddingLeft:"50%", paddingTop:"20%", color:"red"}}/>
};