import sharp from 'sharp';
import https from 'https';

const getImageDimensions = async (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to fetch image: ${response.statusCode}`));
                return;
            }

            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', async () => {
                const buffer = Buffer.concat(chunks);

                try {
                    const metadata = await sharp(buffer).metadata();
                    resolve({ width: metadata.width, height: metadata.height });
                } catch (error) {
                    reject(error);
                }
            });

            response.on('error', (error) => {
                reject(error);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
};

// Sử dụng hàm để lấy kích thước ảnh
const imageUrl = "https://i.pinimg.com/736x/fe/dd/08/fedd08bc055257bb43f4bf9581d8d4b3.jpg";

export const getImageInfo = async function(imageUrl) { // Đã sửa tên hàm và thêm tham số imageUrl
    try {
        const dimensions = await getImageDimensions(imageUrl); // Gọi getImageDimensions và await kết quả
        return dimensions; // Trả về kích thước ảnh
    } catch (error) {
        console.error("Lỗi khi lấy thông tin ảnh:", error);
        throw error; // Re-throw lỗi để caller có thể xử lý
    }
};

// Gọi getImageInfo và in kết quả
getImageInfo(imageUrl)
    .then(info => {
        console.log('Thông tin ảnh:', info); // In ra thông tin ảnh
    })
    .catch(error => {
        console.error('Lỗi:', error); // Xử lý lỗi nếu có
    });