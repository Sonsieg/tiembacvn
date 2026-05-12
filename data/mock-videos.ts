import type { ProductVideo } from "@/types/commerce";

const urls = [
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://youtu.be/ysz5S6PUM-U",
  "https://www.youtube.com/watch?v=jNQXAC9IVRw",
];

export const videos: ProductVideo[] = [
  {
    id: "video-moonlight-1",
    productId: "moonlight",
    youtubeUrl: urls[0],
    youtubeId: "dQw4w9WgXcQ",
    title: "Review nhẫn Moonlight dưới ánh sáng tự nhiên",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    type: "Review",
    sortOrder: 1,
    featured: true,
    status: "active",
  },
  {
    id: "video-stellar-1",
    productId: "stellar-heart",
    youtubeUrl: urls[1],
    youtubeId: "ysz5S6PUM-U",
    title: "Đeo thử dây chuyền Stellar Heart",
    thumbnailUrl: "https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg",
    type: "Đeo thử",
    sortOrder: 2,
    featured: true,
    status: "active",
  },
  {
    id: "video-pearl-1",
    productId: "pearl-drop",
    youtubeUrl: urls[2],
    youtubeId: "jNQXAC9IVRw",
    title: "Mở hộp bông tai Pearl Drop",
    thumbnailUrl: "https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg",
    type: "Mở hộp",
    sortOrder: 3,
    featured: false,
    status: "active",
  },
];
