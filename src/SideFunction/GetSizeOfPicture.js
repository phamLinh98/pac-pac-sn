export const getImageInfo = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("Không thể tải hình ảnh"));
    image.src = url;
  });
