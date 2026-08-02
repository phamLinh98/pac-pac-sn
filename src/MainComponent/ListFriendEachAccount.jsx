import { useEffect, useState } from "react";
import { Avatar, Card, Col, Empty, Row } from "antd";
import { FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { getApi } from "../api/restApiConfig";
import { LoadingComponent } from "../SideComponent/LoadingComponent";

export const ListFriendEachAccount = () => {
  const { id: profileIdParam } = useParams();
  const profileUserId = Number(profileIdParam);
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isFinite(profileUserId) || profileUserId <= 0) {
      setFriends([]);
      setError("User id không hợp lệ");
      return undefined;
    }

    let isActive = true;

    const fetchFriends = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getApi(`/list-friend/${profileUserId}`);
        const payload = await response.json().catch(() => []);

        if (isActive) {
          setFriends(Array.isArray(payload) ? payload : []);
        }
      } catch (requestError) {
        if (isActive) {
          setFriends([]);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải danh sách bạn bè"
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchFriends();

    return () => {
      isActive = false;
    };
  }, [profileUserId]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (friends.length === 0) {
    return <Empty description={error || "Người dùng chưa có bạn bè"} />;
  }

  return (
    <Row gutter={[16, 16]}>
      {friends.map((friend) => (
        <Col key={friend.id} xs={24} sm={12} md={8} lg={6}>
          <Card
            size="small"
            hoverable
            onClick={() => navigate(`/profile/${friend.id}`)}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar src={friend.avatar} size={32} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {friend.name || "Người dùng"}
                </span>
              </div>
            }
            extra={<FaEye aria-label="Xem profile" />}
          />
        </Col>
      ))}
    </Row>
  );
};
