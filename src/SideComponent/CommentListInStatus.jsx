/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Image, List, Mentions, Modal, Space, message } from 'antd';
import { IoCloseCircle, IoImageOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { deleteCommentApi, searchUsersApi, toggleCommentLikeApi, updateCommentApi } from '../api/restApiConfig';
import { formatTimeStamp } from '../configs/configTimeStamp';
import { addCommentThunkFunction, getCommentThunkFunction } from '../reduxs/thunkFunctionComment';
import { useFacadeComment } from '../reduxs/useFacadeComment';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo';
import { ImageStatus } from './ImageStatus';
import { LoadingComponent } from './LoadingComponent';
import { NotListComponent } from './NoListComponent';

const supportedImages = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const CommentListInDetailComponent = ({ postId, highlightedCommentId = null }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = decodeJwt(localStorage.getItem('allow-login')) || {};
  const userId = Number(userData.id);
  const { listComment, loading } = useFacadeComment(postId);
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentionOptions, setMentionOptions] = useState([]);
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const imageInputRef = useRef(null);
  const searchTimerRef = useRef(null);

  useEffect(() => () => {
    if (commentImagePreview) URL.revokeObjectURL(commentImagePreview);
    window.clearTimeout(searchTimerRef.current);
  }, [commentImagePreview]);

  useEffect(() => {
    if (!highlightedCommentId || !listComment.some((item) => Number(item.id) === Number(highlightedCommentId))) return;
    const timer = window.setTimeout(() => {
      document.querySelector(`[data-comment-id="${highlightedCommentId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [highlightedCommentId, listComment]);

  const reload = () => dispatch(getCommentThunkFunction(postId));

  const resetComposer = () => {
    setCommentText('');
    setCommentImage(null);
    setCommentImagePreview('');
    setSelectedMentions([]);
    setParentCommentId(null);
  };

  const handleMentionSearch = (keyword) => {
    window.clearTimeout(searchTimerRef.current);
    if (!keyword.trim()) return setMentionOptions([]);
    searchTimerRef.current = window.setTimeout(async () => {
      try {
        const users = await searchUsersApi(keyword);
        setMentionOptions(users.map((user) => ({
          key: String(user.id),
          value: user.name,
          label: user.name,
          userId: Number(user.id),
          avatar: user.avatar,
        })));
      } catch {
        setMentionOptions([]);
      }
    }, 250);
  };

  const handleMentionSelect = (option) => {
    setSelectedMentions((current) => current.some((item) => item.id === option.userId)
      ? current
      : [...current, { id: option.userId, name: option.value }]);
  };

  const handleTextChange = (value) => {
    setCommentText(value);
    setSelectedMentions((current) => current.filter((item) => value.includes(`@${item.name}`)));
  };

  const handleReply = (comment) => {
    const mention = { id: Number(comment.user_id), name: comment.user_name };
    setParentCommentId(Number(comment.id));
    setSelectedMentions([mention]);
    setCommentText(`@${comment.user_name} `);
    document.querySelector(`[data-comment-composer="${postId}"] textarea`)?.focus();
  };

  const handleAddComment = async () => {
    if (!commentText.trim() && !commentImage) return message.warning('Vui lòng nhập nội dung hoặc chọn ảnh');
    if (!postId || !userId) return message.error('Thiếu thông tin để thêm bình luận');
    setIsSubmitting(true);
    try {
      await dispatch(addCommentThunkFunction(commentText, userId, postId, commentImage, {
        parentCommentId,
        mentionUserIds: selectedMentions.map((item) => item.id),
      }));
      resetComposer();
      await reload();
      message.success('Bình luận đã được thêm');
    } catch (error) {
      message.error(error?.message || 'Không thể thêm bình luận');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!supportedImages.includes(file.type)) return message.warning('Chỉ hỗ trợ JPEG, PNG, WEBP hoặc GIF');
    if (file.size > 5 * 1024 * 1024) return message.warning('Ảnh không được vượt quá 5 MB');
    setCommentImage(file);
    setCommentImagePreview(URL.createObjectURL(file));
  };

  const handleLike = async (comment) => {
    try {
      await toggleCommentLikeApi(comment.id);
      await reload();
    } catch (error) { message.error(error.message || 'Không thể thích bình luận'); }
  };

  const saveEdit = async (comment) => {
    if (!editingText.trim() && !comment.image_url) return message.warning('Bình luận không thể để trống');
    try {
      await updateCommentApi(comment.id, editingText);
      setEditingId(null);
      await reload();
      message.success('Đã chỉnh sửa bình luận');
    } catch (error) { message.error(error.message || 'Không thể sửa bình luận'); }
  };

  const confirmDelete = (comment) => Modal.confirm({
    title: 'Xóa bình luận?',
    content: 'Nội dung và ảnh của bình luận sẽ bị xóa vĩnh viễn.',
    okText: 'Xóa',
    cancelText: 'Hủy',
    okButtonProps: { danger: true },
    onOk: async () => {
      await deleteCommentApi(comment.id);
      await reload();
      message.success('Đã xóa bình luận');
    },
  });

  return <>
    <div style={{ maxHeight: 320, overflow: 'auto', padding: '0 12px', border: '1px solid rgba(140,140,140,.35)' }}>
      {loading ? <LoadingComponent /> : listComment.length === 0
        ? <NotListComponent description="Bài viết chưa có bình luận" />
        : <List dataSource={listComment} renderItem={(item) => {
          const mine = Number(item.user_id) === userId;
          const highlighted = Number(item.id) === Number(highlightedCommentId);
          return <List.Item data-comment-id={item.id} key={item.id} style={{ alignItems: 'flex-start', margin: '2px 0', paddingInline: 6, borderRadius: 8, background: highlighted ? '#fff7cc' : undefined, boxShadow: highlighted ? 'inset 3px 0 #faad14' : undefined }}>
            <List.Item.Meta
              avatar={<ImageStatus image={item.avatar} width="28px" height="28px" active style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />}
              title={<span>
                <button type="button" onClick={() => navigate(`/profile/${item.user_id}`)} style={{ border: 0, padding: 0, background: 'none', color: 'blue', cursor: 'pointer', fontWeight: 600 }}>{item.user_name}</button>
                <small style={{ color: 'gray', marginLeft: 6 }}>{formatTimeStamp(item.created_at)}{item.updated_at && item.updated_at !== item.created_at ? ' · đã chỉnh sửa' : ''}</small>
              </span>}
              description={<div>
                {editingId === item.id ? <Space.Compact style={{ width: '100%' }}>
                  <Mentions value={editingText} maxLength={2000} autoSize onChange={setEditingText} />
                  <Button type="primary" onClick={() => saveEdit(item)}>Lưu</Button>
                  <Button onClick={() => setEditingId(null)}>Hủy</Button>
                </Space.Compact> : <>
                  {item.content && <div style={{ color: '#222', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{item.content}</div>}
                  {item.image_url && <Image src={item.image_url} alt="Ảnh bình luận" style={{ marginTop: item.content ? 6 : 0, maxWidth: 220, maxHeight: 220, objectFit: 'contain', borderRadius: 8 }} />}
                  <div style={{ display: 'flex', gap: 14, marginTop: 5, fontSize: 12 }}>
                    <button type="button" onClick={() => handleLike(item)} style={{ border: 0, padding: 0, background: 'none', cursor: 'pointer', color: item.is_liked ? '#1677ff' : '#666', fontWeight: item.is_liked ? 600 : 400 }}>Like{Number(item.like_count) ? ` (${item.like_count})` : ''}</button>
                    <button type="button" onClick={() => handleReply(item)} style={{ border: 0, padding: 0, background: 'none', cursor: 'pointer', color: '#666' }}>Reply</button>
                    {mine && <button type="button" onClick={() => { setEditingId(item.id); setEditingText(item.content || ''); }} style={{ border: 0, padding: 0, background: 'none', cursor: 'pointer', color: '#666' }}>Chỉnh sửa</button>}
                    {mine && <button type="button" onClick={() => confirmDelete(item)} style={{ border: 0, padding: 0, background: 'none', cursor: 'pointer', color: '#d4380d' }}>Xóa</button>}
                  </div>
                </>}
              </div>}
            />
          </List.Item>;
        }} />}
    </div>

    <div data-comment-composer={postId} style={{ paddingTop: 10 }}>
      {parentCommentId && <div style={{ marginBottom: 6, fontSize: 12, color: '#666' }}>Đang trả lời bình luận <Button type="link" size="small" onClick={() => { setParentCommentId(null); setSelectedMentions([]); setCommentText(''); }}>Hủy</Button></div>}
      {commentImagePreview && <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
        <Image src={commentImagePreview} width={72} height={72} preview={false} style={{ objectFit: 'cover', borderRadius: 8 }} />
        <Button type="text" shape="circle" size="small" icon={<IoCloseCircle />} onClick={() => { setCommentImage(null); setCommentImagePreview(''); }} style={{ position: 'absolute', top: -10, right: -10, background: '#fff' }} />
      </div>}
      <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
        <Mentions
          value={commentText}
          options={mentionOptions}
          onChange={handleTextChange}
          onSearch={handleMentionSearch}
          onSelect={handleMentionSelect}
          onPressEnter={(event) => { if (!event.shiftKey) { event.preventDefault(); handleAddComment(); } }}
          placeholder="Nhập bình luận, dùng @ để nhắc tên"
          maxLength={2000}
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ flex: 1 }}
          disabled={isSubmitting}
        />
        <input ref={imageInputRef} type="file" accept={supportedImages.join(',')} onChange={handleImageChange} style={{ display: 'none' }} />
        <Button icon={<IoImageOutline />} onClick={() => imageInputRef.current?.click()} disabled={isSubmitting} />
        <Button type="primary" onClick={handleAddComment} loading={isSubmitting} disabled={(!commentText.trim() && !commentImage) || isSubmitting}>Gửi</Button>
      </div>
    </div>
  </>;
};
