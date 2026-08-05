import { useEffect, useRef, useState } from "react";
import { Button, Card, Image, Modal, message } from "antd";
import { DeleteOutlined, PlusOutlined, SoundOutlined } from "@ant-design/icons";
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
const DEFAULT_STORY_MUSIC_URL =
  "https://www.nhaccuatui.com/song/0lliVALb8py8?autoplay=true";
const DEFAULT_STORY_MUSIC_PAGE =
  "https://www.nhaccuatui.com/song/0lliVALb8py8";

export const AllStory = () => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyFile, setStoryFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [playingStoryId, setPlayingStoryId] = useState(null);
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
        setPlayingStoryId((currentId) =>
          Number(currentId) === Number(item.id) ? null : currentId
        );
        message.success("Đã xóa story.");
      },
    });
  };

  const openStoryViewer = (item) => {
    setViewingStory(item);
    setPlayingStoryId(item.id);
  };

  const closeStoryViewer = () => {
    setViewingStory(null);
    setPlayingStoryId(null);
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
            style={{ width: 150, marginRight: 5, marginBottom: 5, order: -2 }}
            cover={
              <div
                style={{
                  width: 150,
                  height: 250,
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
                    width: 150,
                    marginRight: 5,
                    marginBottom: 5,
                    order: isOwner ? -1 : 0,
                  }}
                  cover={
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={
                        Number(playingStoryId) === Number(item.id)
                          ? "Story đang được mở"
                          : "Xem story và phát nhạc"
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
                        width={150}
                        height={250}
                        active={false}
                        preview={false}
                      />

                      <SoundOutlined
                        style={{
                          position: "absolute",
                          right: 8,
                          bottom: 8,
                          padding: 7,
                          borderRadius: "50%",
                          color: "white",
                          background:
                            Number(playingStoryId) === Number(item.id)
                              ? "#1677ff"
                              : "rgba(0, 0, 0, 0.55)",
                        }}
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

            <div style={{ border: "1px solid #d9d9d9", borderRadius: 8, overflow: "hidden" }}>
              <iframe
                title="Nhạc mặc định của story"
                src={DEFAULT_STORY_MUSIC_URL}
                allow="autoplay; encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ display: "block", width: "100%", height: 180, border: 0 }}
              />
            </div>

            <Button
              icon={<SoundOutlined />}
              href={DEFAULT_STORY_MUSIC_PAGE}
              target="_blank"
              rel="noreferrer"
            >
              Mở nhạc trên NhacCuaTui nếu trình duyệt chặn âm thanh
            </Button>
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
