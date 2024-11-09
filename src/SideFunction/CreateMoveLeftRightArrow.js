// CSS to hide the scrollbar but still allow scrolling
const style = document.createElement("style");
style.innerHTML = `
  .scroll-container::-webkit-scrollbar {
    display: none; /* Ẩn thanh cuộn cho Webkit browsers */
  }
  .scroll-container {
    -ms-overflow-style: none;  /* Ẩn thanh cuộn cho IE */
    scrollbar-width: none; /* Ẩn thanh cuộn cho Firefox */
  }
`;
document.head.appendChild(style);