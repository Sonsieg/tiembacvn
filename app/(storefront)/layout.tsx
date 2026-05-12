import { AnnouncementBar, MobileBottomNav, StorefrontHeader } from "@/components/layout/storefront-header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { StoreHydrator } from "@/components/store/store-hydrator";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHydrator />
      <AnnouncementBar />
      <StorefrontHeader />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </>
  );
}
