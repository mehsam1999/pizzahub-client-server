'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"


const menuItemsByRole = {
  admin: [],
  vendor: [],
  customer: [],
}

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const role = session?.user?.role || "customer"
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {
                // menuItemsByRole[role].map((item) => (
                // <SidebarMenuItem key={item.id}>
                //     <SidebarMenuButton render={<a href={item.url} />}>
                //     <project.icon />
                //     <span>{item.name}</span>
                //     </SidebarMenuButton>
                // </SidebarMenuItem>
                // ))
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
