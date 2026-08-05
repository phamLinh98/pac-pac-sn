import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// eslint-disable-next-line react/prop-types
export const LoadingComponent = ({paddingTop="20%"}) => {
    return <Spin indicator={<LoadingOutlined spin />} size="middle" style={{paddingLeft:"50%", paddingTop:paddingTop, color:"red"}}/>
};
