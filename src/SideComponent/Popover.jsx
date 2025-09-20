import { Button, Popover } from 'antd';

// EmojiPopover Component
// eslint-disable-next-line react/prop-types
export const EmojiPopover = ({ handleAddComment, isSubmitting, setCommentText, commentText }) => {
  // Array of emojis provided
  const emojis = ['😀', '😃', '😄', '😁', '😜', '😝', '😍', '😑', '🙄', '🤗', '😘', '😱', '🤧', '😰', '😠', '😖', '🤒', '😤', '🤪', '🥵', '😱','🥶','😎','🤩','👍'];

  // Create a 5x5 grid array (25 slots), fill with emojis, and use empty strings for remaining slots
  const gridEmojis = [...emojis, ...Array(25 - emojis.length).fill('')];

  // Handle emoji click to append to commentText
  const handleEmojiClick = (emoji) => {
    if (emoji) {
      setCommentText(commentText + emoji); // Append emoji to input
    }
  };

  // Content for the Popover (5x5 grid)
  const popoverContent = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 40px)', // 5 columns, 40px each
        gridTemplateRows: 'repeat(5, 40px)', // 5 rows, 40px each
        gap: '5px', // Space between cells
        padding: '10px',
      }}
    >
      {gridEmojis.map((emoji, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px', // Adjust emoji size
            cursor: emoji ? 'pointer' : 'default', // Only clickable if emoji exists
            border: '1px solid #f0f0f0', // Optional: Border for visibility
            borderRadius: '4px',
            transition: 'background-color 0.2s', // Smooth hover transition
          }}
          onMouseEnter={(e) => emoji && (e.currentTarget.style.backgroundColor = '#f5f5f5')} // Hover effect
          onMouseLeave={(e) => emoji && (e.currentTarget.style.backgroundColor = 'transparent')} // Reset on leave
          onClick={() => handleEmojiClick(emoji)} // Append emoji on click
        >
          {emoji || <span style={{ color: '#ccc' }}>-</span>} {/* Placeholder for empty slots */}
        </div>
      ))}
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      title="Choose an Emoji"
      trigger="click" // Popover opens on click
      placement="top" // Position above the button (adjust as needed)
    >
      <Button size="large" loading={isSubmitting}>
        😀
      </Button>
    </Popover>
  );
};
