import { AppSidebar } from "@/components/layout/app-sidebar";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex"><AppSidebar /><div className="flex-1 overflow-x-hidden">{children}</div></div>;
}
