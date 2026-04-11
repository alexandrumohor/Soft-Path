import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 overflow-x-hidden pb-16 lg:pb-0">{children}</div>
      </div>
      <MobileBottomNav />
    </>
  );
}
