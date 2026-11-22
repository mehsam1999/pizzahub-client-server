import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Toaster } from "@/components/ui/toast"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="min-w-0 flex-1 bg-[#fefaf5]">
        <div className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
        </div>
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  )
}

export default DashboardLayout
