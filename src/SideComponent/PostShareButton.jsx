/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Alert, Avatar, Button, Input, Modal, message } from 'antd';
import { VscShare } from 'react-icons/vsc';
import { sharePostApi } from '../api/restApiConfig';
import { ImageStatus } from './ImageStatus';

export const PostShareButton = ({ postId, initialCount = 0, disabled = false, preview }) => {
  const [shareCount, setShareCount] = useState(Number(initialCount) || 0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [shareText, setShareText] = useState('');

  useEffect(() => setShareCount(Number(initialCount) || 0), [initialCount, postId]);
  useEffect(() => {
    const sync = (event) => {
      if (event.detail?.type === 'share' && Number(event.detail?.sourcePostId) === Number(postId)) {
        setShareCount(Number(event.detail.shareCount) || 0);
      }
    };
    window.addEventListener('post-engagement-updated', sync);
    return () => window.removeEventListener('post-engagement-updated', sync);
  }, [postId]);

  const share = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      const result = await sharePostApi(postId, shareText.trim());
      const detail = {
        type: 'share',
        sourcePostId: Number(result.original_post_id),
        sharedPostId: Number(result.id),
        shareCount: Number(result.share_count) || 0,
      };
      setShareCount(detail.shareCount);
      window.dispatchEvent(new CustomEvent('post-engagement-updated', { detail }));
      window.dispatchEvent(new CustomEvent('post-shared', { detail }));
      setModalOpen(false);
      setShareText('');
      message.success('Đã chia sẻ bài viết');
    } catch (error) {
      message.error(error.message || 'Không thể chia sẻ bài viết');
    } finally {
      setLoading(false);
    }
  };

  return <>
    <Button loading={loading} disabled={disabled} onClick={() => setModalOpen(true)}>
      <VscShare /><span>{shareCount}</span>Share
    </Button>
    <Modal
      title="Chia sẻ bài viết"
      open={modalOpen}
      okText="Chia sẻ ngay"
      cancelText="Hủy"
      confirmLoading={loading}
      onOk={share}
      onCancel={() => { if (!loading) setModalOpen(false); }}
    >
      <Input.TextArea
        value={shareText}
        onChange={(event) => setShareText(event.target.value)}
        placeholder="Bạn muốn nói gì về bài viết này?"
        autoSize={{ minRows: 3, maxRows: 8 }}
        maxLength={2000}
        showCount
      />
      <div style={{ marginTop: 18 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Nội dung bạn sẽ chia sẻ</div>
        {preview?.unavailable ? (
          <Alert type="warning" showIcon message="Bài đăng không còn tồn tại" />
        ) : (
          <div style={{ border: '1px solid #d9d9d9', borderRadius: 10, padding: 12, background: '#fafafa', maxHeight: '42vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Avatar src={preview?.authorAvatar}>{preview?.authorName?.[0]}</Avatar>
              <strong>{preview?.authorName || 'Người dùng'}</strong>
            </div>
            {preview?.text && <p style={{ whiteSpace: 'pre-wrap' }}>{preview.text}</p>}
            {Array.isArray(preview?.images) && preview.images.length > 0 && (
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                {preview.images.map((image, index) => (
                  <ImageStatus key={`${postId}-share-preview-${index}`} image={image} width={120} height={160} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  </>;
};
