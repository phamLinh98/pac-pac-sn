/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { GiChestnutLeaf } from 'react-icons/gi';
import { togglePostLikeApi } from '../api/restApiConfig';

export const PostLikeButton = ({ postId, initialCount = 0, initialLiked = false }) => {
  const [likeCount, setLikeCount] = useState(Number(initialCount) || 0);
  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikeCount(Number(initialCount) || 0);
    setLiked(Boolean(initialLiked));
  }, [initialCount, initialLiked, postId]);

  useEffect(() => {
    const syncLike = (event) => {
      if (Number(event.detail?.postId) !== Number(postId) || event.detail?.type !== 'like') return;
      setLikeCount(Number(event.detail.likeCount) || 0);
      setLiked(Boolean(event.detail.liked));
    };
    window.addEventListener('post-engagement-updated', syncLike);
    return () => window.removeEventListener('post-engagement-updated', syncLike);
  }, [postId]);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await togglePostLikeApi(postId);
      const nextState = {
        type: 'like',
        postId: Number(postId),
        likeCount: Number(result.like_count) || 0,
        liked: Boolean(result.liked),
      };
      setLikeCount(nextState.likeCount);
      setLiked(nextState.liked);
      window.dispatchEvent(new CustomEvent('post-engagement-updated', { detail: nextState }));
      window.dispatchEvent(new Event('comment-notification-updated'));
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật lượt thích');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      loading={loading}
      onClick={toggleLike}
      aria-pressed={liked}
      style={{
        color: liked ? 'red' : '#595959',
        backgroundColor: 'white',
        border: `1px solid ${liked ? 'red' : '#d9d9d9'}`,
      }}
    >
      <GiChestnutLeaf style={{ color: liked ? 'red' : '#595959' }} />
      <span>{likeCount}</span>
      <span>Like</span>
    </Button>
  );
};
