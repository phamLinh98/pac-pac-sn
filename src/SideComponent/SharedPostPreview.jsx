/* eslint-disable react/prop-types */
import { Alert, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatTimeStamp } from '../configs/configTimeStamp';
import { ImageStatus } from './ImageStatus';

const normalizeContent = (raw) => {
  if (!raw) return { text: '', image: [] };
  if (typeof raw === 'string') {
    try { return normalizeContent(JSON.parse(raw)); } catch { return { text: raw, image: [] }; }
  }
  return {
    text: typeof raw.text === 'string' ? raw.text : (raw.title || ''),
    image: Array.isArray(raw.image) ? raw.image : [],
  };
};

export const SharedPostPreview = ({ post }) => {
  const navigate = useNavigate();
  if (!post?.is_shared_post) return null;
  if (!post.original_post_exists) {
    return <Alert type="warning" showIcon message="Bài đăng không còn tồn tại" description="Bạn vẫn đang giữ trạng thái đã chia sẻ bài viết này." />;
  }
  const content = normalizeContent(post.original_content);
  return <div style={{ border: '1px solid #d9d9d9', borderRadius: 10, padding: 12, marginBottom: 10, background: '#fafafa' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <Avatar src={post.original_author_avatar}>{post.original_author_name?.[0]}</Avatar>
      <div>
        <button type="button" onClick={() => navigate(`/profile/${post.original_author_id}`)} style={{ border: 0, padding: 0, background: 'transparent', color: '#1677ff', cursor: 'pointer', fontWeight: 600 }}>
          {post.original_author_name || 'Người dùng'}
        </button>
        {post.original_created_at && <div style={{ color: '#888', fontSize: 11 }}>{formatTimeStamp(post.original_created_at)}</div>}
      </div>
    </div>
    {content.text && <p style={{ whiteSpace: 'pre-wrap' }}>{content.text}</p>}
    {content.image.length > 0 && <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
      {content.image.map((image, index) => <ImageStatus className="responsive-post-image" key={`${post.id}-original-${index}`} image={image} width={150} height={220} />)}
    </div>}
  </div>;
};
