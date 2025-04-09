import { Card, Row, Col } from "antd";
import { FaEye } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { useFacadeFriendListOnline } from "../reduxs/useFacadeFriendListOnline";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
import { LoadingComponent } from "../SideComponent/LoadingComponent";
import { useNavigate } from "react-router-dom";
import { ImageStatus } from "../SideComponent/ImageStatus";

export const ListFriendEachAccount = () => {
    const getUserFromLocalStorage = localStorage.getItem('accessToken');
    const getData = decodeJwt(getUserFromLocalStorage);
    const { id } = getData;
    const idToNumber = +id;
    const { listFriendListOnline, loading } = useFacadeFriendListOnline(idToNumber);
    const navigate = useNavigate();

    const moveToProfile = (userId) => {
        navigate(`/profile/${userId}`);
      }

    return (
        <Row gutter={[16, 16]}>
            {loading ? <LoadingComponent /> :listFriendListOnline.map((friend, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                    <Card
                        size="small"
                        title={
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                    src={friend.avatar}
                                    alt="avatar"
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        marginRight: 8,
                                    }}
                                />
                                <span
                                    onClick={() => moveToProfile(friend.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {friend.name.length > 10
                                        ? `${friend.name.slice(0, 10)}...`
                                        : friend.name}
                                </span>
                            </div>
                        }
                        extra={
                            <div>
                                <MdAdd style={{ paddingTop: "3px" }} /> | <FaEye style={{ paddingTop: "3px" }} />
                            </div>
                        }
                        style={{ width: "100%" }}
                    >
                        <p style={{ margin: 0 }}>200 bạn chung</p>
                    </Card>
                </Col>
            ))}
        </Row>
    )
};
