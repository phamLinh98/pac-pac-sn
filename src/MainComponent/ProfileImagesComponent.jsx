import { Card, Col, Empty, Image, Row } from "antd";
import { useParams } from "react-router-dom";

import { LoadingComponent } from "../SideComponent/LoadingComponent";
import { useFacadeList } from "../reduxs/useFacadeList";

const getPostImages = (rawContent) => {
  let content = rawContent;

  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch {
      return [];
    }
  }

  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return [];
  }

  const rawImages = content.image ?? content.images ?? [];

  return (Array.isArray(rawImages) ? rawImages.flat(Infinity) : [rawImages])
    .filter((imageUrl) => typeof imageUrl === "string" && imageUrl.trim())
    .map((imageUrl) => imageUrl.trim());
};

export const ProfileImagesComponent = () => {
  const { id: profileIdParam } = useParams();
  const profileUserId = Number(profileIdParam);
  const { list, loading } = useFacadeList(profileUserId);

  const safePosts = Array.isArray(list)
    ? list
    : Array.isArray(list?.data)
      ? list.data
      : [];

  const images = safePosts.flatMap((post) =>
    getPostImages(post?.content).map((imageUrl, imageIndex) => ({
      key: `${post?.id ?? "post"}-${imageIndex}-${imageUrl}`,
      imageUrl,
    }))
  );

  if (loading) {
    return <LoadingComponent />;
  }

  if (images.length === 0) {
    return <Empty description="Người dùng chưa có hình ảnh nào" />;
  }

  return (
    <Image.PreviewGroup>
      <Row gutter={[12, 12]}>
        {images.map((item) => (
          <Col key={item.key} xs={12} sm={8} md={6} lg={4}>
            <Card styles={{ body: { padding: 0 } }}>
              <Image
                src={item.imageUrl}
                alt="Ảnh bài viết"
                width="100%"
                height={180}
                style={{ display: "block", objectFit: "cover" }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Image.PreviewGroup>
  );
};
