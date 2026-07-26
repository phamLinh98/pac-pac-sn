/* eslint-disable react/prop-types */

import {
  Button,
  Flex,
  Image,
  Modal,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { CloseOutlined } from "@ant-design/icons";
import { GiMapleLeaf } from "react-icons/gi";

import {
  addPostApi,
  uploadPostImagesApi,
} from "../api/restApiConfig";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";

const MAX_IMAGE_COUNT = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const createPreviewId = (file) => {
  const randomId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  return [
    file.name,
    file.size,
    file.lastModified,
    randomId,
  ].join("-");
};

export const MyStatusAreaUploadComponent = ({
  children,
  onPostCreated,
}) => {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [text, setText] = useState("");
  const [previewImages, setPreviewImages] =
    useState([]);
  const [isPosting, setIsPosting] =
    useState(false);

  const fileInputRef = useRef(null);
  const previewImagesRef = useRef([]);

  useEffect(() => {
    previewImagesRef.current = previewImages;
  }, [previewImages]);

  useEffect(() => {
    return () => {
      previewImagesRef.current.forEach(
        (preview) => {
          URL.revokeObjectURL(preview.url);
        }
      );
    };
  }, []);

  const getCurrentUserId = () => {
    const token =
      localStorage.getItem("allow-login");

    if (!token) {
      return null;
    }

    try {
      const decodedData = decodeJwt(token);
      const userId = Number(decodedData?.id);

      return Number.isFinite(userId) &&
        userId > 0
        ? userId
        : null;
    } catch (error) {
      console.error(
        "Không thể decode JWT:",
        error
      );

      return null;
    }
  };

  const resetForm = () => {
    previewImagesRef.current.forEach(
      (preview) => {
        URL.revokeObjectURL(preview.url);
      }
    );

    previewImagesRef.current = [];

    setText("");
    setPreviewImages([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (isPosting) {
      return;
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleImageClick = () => {
    if (isPosting) {
      return;
    }

    fileInputRef.current?.click();
  };

  const validateFiles = (files) => {
    return files.filter((file) => {
      if (
        !ALLOWED_IMAGE_TYPES.includes(
          file.type
        )
      ) {
        message.error(
          `${file.name}: chỉ chấp nhận JPEG, PNG, WEBP hoặc GIF.`
        );

        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        message.error(
          `${file.name}: dung lượng không được vượt quá 5 MB.`
        );

        return false;
      }

      return true;
    });
  };

  const isDuplicateFile = (
    currentPreviews,
    newFile
  ) => {
    return currentPreviews.some(
      (preview) =>
        preview.file.name === newFile.name &&
        preview.file.size === newFile.size &&
        preview.file.lastModified ===
          newFile.lastModified
    );
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    const validFiles =
      validateFiles(selectedFiles);

    const nonDuplicateFiles =
      validFiles.filter(
        (file) =>
          !isDuplicateFile(
            previewImages,
            file
          )
      );

    if (
      nonDuplicateFiles.length <
      validFiles.length
    ) {
      message.warning(
        "Một số ảnh đã được chọn trước đó nên không được thêm lại."
      );
    }

    const remainingCount =
      MAX_IMAGE_COUNT -
      previewImages.length;

    if (remainingCount <= 0) {
      message.warning(
        `Mỗi bài viết chỉ được tối đa ${MAX_IMAGE_COUNT} ảnh.`
      );

      event.target.value = "";
      return;
    }

    const acceptedFiles =
      nonDuplicateFiles.slice(
        0,
        remainingCount
      );

    if (
      acceptedFiles.length <
      nonDuplicateFiles.length
    ) {
      message.warning(
        `Chỉ có thể chọn tối đa ${MAX_IMAGE_COUNT} ảnh.`
      );
    }

    const newPreviews =
      acceptedFiles.map((file) => ({
        id: createPreviewId(file),
        file,
        url: URL.createObjectURL(file),
      }));

    setPreviewImages(
      (currentPreviews) => [
        ...currentPreviews,
        ...newPreviews,
      ]
    );

    event.target.value = "";
  };

  const handleRemoveImage = (
    previewId
  ) => {
    setPreviewImages(
      (currentPreviews) => {
        const removedPreview =
          currentPreviews.find(
            (preview) =>
              preview.id === previewId
          );

        if (removedPreview) {
          URL.revokeObjectURL(
            removedPreview.url
          );
        }

        return currentPreviews.filter(
          (preview) =>
            preview.id !== previewId
        );
      }
    );
  };

  const handlePost = async () => {
    const normalizedText = text.trim();

    if (
      !normalizedText &&
      previewImages.length === 0
    ) {
      message.warning(
        "Bạn cần nhập nội dung hoặc chọn ít nhất một ảnh."
      );

      return;
    }

    const userId = getCurrentUserId();

    if (!userId) {
      message.error(
        "Không xác định được người dùng. Vui lòng đăng nhập lại."
      );

      return;
    }

    setIsPosting(true);

    try {
      const selectedFiles =
        previewImages.map(
          (preview) => preview.file
        );

      let uploadedImageKeys = [];

      if (selectedFiles.length > 0) {
        uploadedImageKeys =
          await uploadPostImagesApi(
            selectedFiles,
            userId
          );
      }

      const content = {
        text: normalizedText,
        image: uploadedImageKeys,
      };

      const createdPost =
        await addPostApi({
          userId,
          content,
        });

      message.success(
        "Đăng bài viết thành công."
      );

      setIsModalOpen(false);
      resetForm();

      if (
        typeof onPostCreated ===
        "function"
      ) {
        onPostCreated(createdPost);
      }
    } catch (error) {
      console.error(
        "Đăng bài viết thất bại:",
        error
      );

      message.error(
        error.message ||
          "Không thể đăng bài viết."
      );
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      <Button onClick={showModal}>
        {children}
      </Button>

      <Modal
        title={
          <div
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <GiMapleLeaf /> Đăng bài viết
            mới <GiMapleLeaf />
          </div>
        }
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        maskClosable={!isPosting}
        closable={!isPosting}
        destroyOnClose
      >
        <TextArea
          value={text}
          rows={4}
          maxLength={2000}
          showCount
          disabled={isPosting}
          placeholder="Rin, bạn đang nghĩ gì?"
          onChange={(event) =>
            setText(event.target.value)
          }
          style={{
            border: "none",
            outline: "none",
            resize: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "8px 0",
          }}
        >
          <Image
            width={50}
            src="/image.svg"
            alt="Chọn ảnh"
            preview={false}
            onClick={handleImageClick}
            style={{
              cursor: isPosting
                ? "not-allowed"
                : "pointer",
            }}
          />

          <span
            style={{
              fontSize: "12px",
              color: "gray",
            }}
          >
            Chọn nhiều ảnh, tối đa{" "}
            {MAX_IMAGE_COUNT} ảnh
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(
            ","
          )}
          multiple
          disabled={isPosting}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {previewImages.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(110px, 1fr))",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            {previewImages.map(
              (preview) => (
                <div
                  key={preview.id}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "120px",
                  }}
                >
                  <Image
                    src={preview.url}
                    alt={preview.file.name}
                    preview
                    width="100%"
                    height={120}
                    style={{
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />

                  <Button
                    danger
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={
                      <CloseOutlined />
                    }
                    disabled={isPosting}
                    onClick={() =>
                      handleRemoveImage(
                        preview.id
                      )
                    }
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      zIndex: 2,
                    }}
                  />
                </div>
              )
            )}
          </div>
        )}

        <div
          style={{
            marginBottom: "10px",
            fontSize: "12px",
            color: "gray",
          }}
        >
          Đã chọn {previewImages.length}/
          {MAX_IMAGE_COUNT} ảnh
        </div>

        <Flex
          vertical
          gap="small"
          style={{ width: "100%" }}
        >
          <Button
            type="primary"
            block
            loading={isPosting}
            disabled={
              isPosting ||
              (!text.trim() &&
                previewImages.length === 0)
            }
            onClick={handlePost}
          >
            Post
          </Button>
        </Flex>
      </Modal>
    </>
  );
};
