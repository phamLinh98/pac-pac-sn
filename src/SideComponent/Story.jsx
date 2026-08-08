import { useEffect, useRef, useState } from "react";
import { Button, Card, Image, Modal, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { PiHeartbeatBold } from "react-icons/pi";
import { ImReply } from "react-icons/im";
import { RiUserUnfollowFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { ImageStatus } from "./ImageStatus";
import { LoadingComponent } from "./LoadingComponent";
import { useFacadeStory } from "../reduxs/useFacadeStory";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";

const { Meta } = Card;
const MAX_STORY_SIZE = 5 * 1024 * 1024;
const ALLOWED_STORY_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
export const AllStory = () => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyFile, setStoryFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [viewingStory, setViewingStory] = useState(null);

  const {
    story,
    loadingStory,
    createStory,
    deleteStory,
  } = useFacadeStory();

  const safeStory = Array.isArray(story)
    ? story
    : Array.isArray(story?.data)
      ? story.data
      : [];

  const navigate = useNavigate();
  const token = localStorage.getItem("allow-login");
  const loginUser = decodeJwt(token) ?? {};
  const loginUserId = Number(loginUser.id);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetStoryForm = () => {
    setStoryFile(null);
    setPreviewUrl("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ALLOWED_STORY_TYPES.has(file.type)) {
      message.error("Story chỉ hỗ trợ ảnh JPEG, PNG, WEBP hoặc GIF.");
      return;
    }

    if (file.size > MAX_STORY_SIZE) {
      message.error("Ảnh story không được vượt quá 5 MB.");
      return;
    }

    setStoryFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCreateStory = async () => {
    if (!storyFile) {
      message.warning("Bạn cần chọn một ảnh story.");
      return;
    }

    setIsPosting(true);

    try {
      await createStory(storyFile);
      message.success("Đăng story thành công.");
      setIsModalOpen(false);
      resetStoryForm();
    } catch (error) {
      message.error(error?.message || "Không thể đăng story.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteStory = (item) => {
    Modal.confirm({
      title: "Xóa story",
      content: "Bạn có chắc chắn muốn xóa story này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        await deleteStory(item.id);
        message.success("Đã xóa story.");
      },
    });
  };

  const openStoryViewer = (item) => {
    setViewingStory(item);
  };

  const closeStoryViewer = () => {
    setViewingStory(null);
  };

  return (
    <div style={{ width: "95%", overflowX: "hidden", position: "relative" }}>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          padding: "10px 0",
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
        }}
      >
        <div style={{ display: "flex" }}>
          <Card
            hoverable
            onClick={() => setIsModalOpen(true)}
            className="story-card"
            style={{ marginRight: 5, marginBottom: 5, order: -2 }}
            cover={
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f0f5ff",
                }}
              >
                <PlusOutlined style={{ fontSize: 42, color: "#1677ff" }} />
              </div>
            }
          >
            <Meta title="Đăng story" style={{ textAlign: "center" }} />
          </Card>

          {loadingStory ? (
            <LoadingComponent />
          ) : (
            safeStory.map((item) => {
              const storyUserId = Number(item.user_id);
              const isOwner = storyUserId === loginUserId;
              const imageUrl = item.image_url || item.image;

              return (
                <Card
                  key={item.id}
                  hoverable
                  style={{
                    width: undefined,
                    marginRight: 5,
                    marginBottom: 5,
                    order: isOwner ? -1 : 0,
                  }}
                  className="story-card"
                  cover={
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={
                          "Xem story"
                      }
                      onClick={() => openStoryViewer(item)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openStoryViewer(item);
                        }
                      }}
                      style={{ position: "relative", cursor: "pointer" }}
                    >
                      <ImageStatus
                        image={imageUrl}
                        width="100%"
                        height="100%"
                        active={false}
                        preview={false}
                      />

                    </div>
                  }
                  actions={
                    isOwner
                      ? [
                          <DeleteOutlined
                            key="delete"
                            style={{ color: "red", fontSize: "1.2rem" }}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteStory(item);
                            }}
                          />,
                        ]
                      : [
                          <PiHeartbeatBold key="like" style={{ fontSize: "1.5rem", color: "red" }} />,
                          <ImReply key="reply" style={{ fontSize: "1.3rem" }} />,
                          <RiUserUnfollowFill key="unfollow" style={{ fontSize: "1.3rem" }} />,
                        ]
                  }
                >
                  <Meta
                    title={isOwner ? "Bạn" : item.user_name || "Người dùng"}
                    onClick={() => navigate(`/profile/${storyUserId}`)}
                    style={{ textAlign: "center" }}
                  />
                </Card>
              );
            })
          )}
        </div>
      </div>

      <Modal
        title={viewingStory ? `Story của ${Number(viewingStory.user_id) === loginUserId ? "Bạn" : viewingStory.user_name || "Người dùng"}` : "Story"}
        open={Boolean(viewingStory)}
        onCancel={closeStoryViewer}
        footer={null}
        centered
        width={620}
        destroyOnClose
      >
        {viewingStory && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ textAlign: "center", background: "#000", borderRadius: 8, overflow: "hidden" }}>
              <Image
                src={viewingStory.image_url || viewingStory.image}
                alt="Story"
                style={{ width: "100%", maxHeight: "65vh", objectFit: "contain" }}
              />
            </div>

          </div>
        )}
      </Modal>

      <Modal
        title="Đăng story mới"
        open={isModalOpen}
        onCancel={() => {
          if (!isPosting) {
            setIsModalOpen(false);
            resetStoryForm();
          }
        }}
        onOk={handleCreateStory}
        okText="Đăng story"
        cancelText="Hủy"
        confirmLoading={isPosting}
        maskClosable={!isPosting}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={isPosting}
        />

        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Xem trước story"
            style={{ width: "100%", maxHeight: 420, objectFit: "contain", marginTop: 16 }}
          />
        ) : (
          <Button
            block
            icon={<PlusOutlined />}
            style={{ marginTop: 16 }}
            onClick={() => fileInputRef.current?.click()}
          >
            Chọn ảnh story
          </Button>
        )}
      </Modal>
    </div>
  );
};
