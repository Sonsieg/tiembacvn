import { VideoAdminWorkspace } from "@/components/admin/video-admin-workspace";
import { getAdminProducts } from "@/lib/services/product.service";
import { getAdminProductVideos } from "@/lib/services/video.service";

export default async function AdminVideosPage() {
  const [products, videos] = await Promise.all([getAdminProducts(), getAdminProductVideos()]);
  return <VideoAdminWorkspace products={products} videos={videos} />;
}
