import { useEffect, useState } from "react";
import { Avatar, Card, Col, Empty, Row } from "antd";
import { FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { getApi } from "../api/restApiConfig";
import { LoadingComponent } from "../SideComponent/LoadingComponent";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";

// eslint-disable-next-line react/prop-types
export const ListFriendEachAccount = ({ userId: requestedUserId, showTitle = false }) => {
  const { id: profileIdParam } = useParams();
  const loginUser = decodeJwt(localStorage.getItem('allow-login')) || {};
  const profileUserId = Number(requestedUserId || profileIdParam || loginUser.id);
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
    <div>
      {showTitle && <h2 style={{ margin: '8px 0 18px' }}>Bạn bè của bạn</h2>}
      <Row gutter={[16, 16]}>
      {friends.map((friend) => (
        <Col key={friend.id} xs={24} sm={12} md={8} lg={6}>
          <Card
            size="small"
            hoverable
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar src={friend.avatar} size={32} />
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${friend.id}`)}
                  style={{ minWidth: 0, padding: 0, border: 0, background: 'none', color: '#1677ff', cursor: 'pointer', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}
                >
                  {friend.name || "Người dùng"}
                </button>
              </div>
            }
            extra={<FaEye aria-label="Xem profile" />}
          >
            <span style={{ color: '#777' }}>{Array.isArray(friend.list_friend_id) ? friend.list_friend_id.length : 0} bạn bè</span>
          </Card>
        </Col>
      ))}
      </Row>
    </div>
  );
};
