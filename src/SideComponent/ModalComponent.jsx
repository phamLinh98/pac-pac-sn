/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Empty, Image, message, Modal, Segmented, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getProfileMediaApi, updateProfileImageApi } from "../api/restApiConfig";

export const ModalComponent = ({ open, hideModal, imageType = "avatar", onUpdated }) => {
  const [source, setSource] = useState("upload");
  const [file, setFile] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [saving, setSaving] = useState(false);

  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : "", [file]);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  useEffect(() => {
    if (!open) return;
    setFile(null);
    setSelectedKey("");
    setSource("upload");
    setLoadingMedia(true);
    getProfileMediaApi()
      .then(setMedia)
      .catch((error) => message.error(error.message || "Không thể tải kho ảnh"))
      .finally(() => setLoadingMedia(false));
  }, [open]);

  const beforeUpload = (nextFile) => {
    if (!nextFile.type.startsWith("image/")) {
      message.error("Vui lòng chọn một file ảnh");
      return Upload.LIST_IGNORE;
    }
    if (nextFile.size > 5 * 1024 * 1024) {
      message.error("Ảnh không được vượt quá 5 MB");
      return Upload.LIST_IGNORE;
    }
    setFile(nextFile);
    return false;
  };

  const saveImage = async () => {
    if (source === "upload" && !file) return message.warning("Hãy chọn ảnh từ máy");
    if (source === "library" && !selectedKey) return message.warning("Hãy chọn một ảnh trong kho");

    try {
      setSaving(true);
      const result = await updateProfileImageApi({
        imageType,
        file: source === "upload" ? file : null,
        imageKey: source === "library" ? selectedKey : "",
      });
      message.success(imageType === "avatar" ? "Đã cập nhật ảnh đại diện" : "Đã cập nhật ảnh bìa");
      onUpdated?.(result.user);
      hideModal();
    } catch (error) {
      message.error(error.message || "Không thể cập nhật ảnh");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={imageType === "avatar" ? "Thay ảnh đại diện" : "Thay ảnh bìa"}
      open={open}
      onOk={saveImage}
      onCancel={hideModal}
      confirmLoading={saving}
      okText="Lưu ảnh"
      cancelText="Hủy"
      width={680}
    >
      <Segmented
        block
        value={source}
        onChange={setSource}
        options={[{ label: "Tải từ máy", value: "upload" }, { label: "Kho ảnh của tôi", value: "library" }]}
        style={{ marginBottom: 16 }}
      />

      {source === "upload" ? (
        <div style={{ textAlign: "center" }}>
          <Upload accept="image/jpeg,image/png,image/webp,image/gif" maxCount={1} beforeUpload={beforeUpload} fileList={file ? [file] : []} onRemove={() => setFile(null)}>
            <div style={{ padding: 20, border: "1px dashed #999", borderRadius: 8, cursor: "pointer" }}>
              <UploadOutlined /> Chọn ảnh từ máy (tối đa 5 MB)
            </div>
          </Upload>
          {previewUrl && <Image src={previewUrl} alt="Xem trước" style={{ maxHeight: 280, marginTop: 16, objectFit: "contain" }} />}
        </div>
      ) : loadingMedia ? (
        <div style={{ padding: 40, textAlign: "center" }}><Spin /></div>
      ) : media.length === 0 ? (
        <Empty description="Bạn chưa có ảnh trong bài viết hoặc story" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10, maxHeight: 420, overflowY: "auto" }}>
          {media.map((item) => (
            <button
              type="button"
              key={item.imageKey}
              onClick={() => setSelectedKey(item.imageKey)}
              style={{ padding: 3, border: selectedKey === item.imageKey ? "3px solid #1677ff" : "1px solid #ddd", borderRadius: 8, background: "transparent", cursor: "pointer" }}
            >
              <img src={item.imageUrl} alt="Ảnh trong kho" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 5 }} />
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
};
