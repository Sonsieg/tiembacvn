import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/services/blog.service";

export const metadata: Metadata = {
  title: "Journal trang sức bạc",
  description: "Cẩm nang chọn, đeo và bảo quản trang sức bạc S925 từ Tiembac.vn.",
};

export default async function JournalPage() {
  const posts = await getBlogPosts();
  return (
    <section className="section">
      <div className="container-page grid gap-8">
        <div><p className="eyebrow">Journal</p><h1 className="heading-lg">Cẩm nang trang sức bạc</h1></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/journal/${post.slug}`} className="overflow-hidden rounded-[1.5rem] bg-white shadow-soft">
              <img src={post.coverImage} alt={post.title} className="aspect-[16/10] w-full object-cover" />
              <div className="p-5"><h2 className="text-xl font-semibold text-ink">{post.title}</h2><p className="mt-2 text-sm text-gray-500">{post.excerpt}</p></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
