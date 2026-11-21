"use client"

import type { LucideIcon } from "lucide-react"
import {
  CirclePlus,
  LayoutGrid,
  LogOut,
  NotebookText,
  ReceiptText,
  Settings2,
  Users,
  UtensilsCrossed,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { Role } from "@/lib/auth"
import { authClient, useSession } from "@/lib/auth-client"

export type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

const menuItemsByRole = {
  admin: [
    {
      id: "admin-overview",
      name: "Overview",
      url: "/dashboard/admin",
      icon: LayoutGrid,
    },
    {
      id: "admin-users",
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "admin-menu-items",
      name: "Manage Menu Items",
      url: "/dashboard/admin/menu-items",
      icon: UtensilsCrossed,
    },
    {
      id: "admin-transactions",
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: ReceiptText,
    },
  ],
  vendor: [
    {
      id: "vendor-overview",
      name: "Overview",
      url: "/dashboard/vendor",
      icon: LayoutGrid,
    },
    {
      id: "vendor-menu-items",
      name: "My Menu Items",
      url: "/dashboard/vendor/menu-items",
      icon: UtensilsCrossed,
    },
    {
      id: "vendor-add-menu-item",
      name: "Add Menu Item",
      url: "/dashboard/vendor/menu-items/new",
      icon: CirclePlus,
    },
    {
      id: "vendor-customer-orders",
      name: "Customer Orders",
      url: "/dashboard/vendor/orders",
      icon: NotebookText,
    },
    {
      id: "vendor-subscription",
      name: "Subscription",
      url: "/dashboard/vendor/subscription",
      icon: ReceiptText,
    },
    {
      id: "vendor-profile-settings",
      name: "Profile Settings",
      url: "/dashboard/vendor/settings",
      icon: Settings2,
    },
  ],
  customer: [
    {
      id: "customer-overview",
      name: "Overview",
      url: "/dashboard/customer",
      icon: LayoutGrid,
    },
    {
      id: "my-orders",
      name: "My Orders",
      url: "/dashboard/customer/my-orders",
      icon: NotebookText,
    },
    {
      id: "customer-profile-settings",
      name: "Profile Settings",
      url: "/dashboard/customer/settings",
      icon: Settings2,
    },
  ],
} satisfies Record<Role, MenuItem[]>

const isRole = (value: unknown): value is Role =>
  typeof value === "string" && Object.hasOwn(menuItemsByRole, value)

const roleLabel = (role: Role) =>
  role === "admin" ? "Admin" : role === "vendor" ? "Vendor" : "Customer"

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()

  const role: Role = isRole(session?.user?.role)
    ? session.user.role
    : "customer"
  const menuItems = menuItemsByRole[role]

  const userName = session?.user?.name || "Your account"
  const initial = userName.charAt(0).toUpperCase()

  const activeUrl = menuItems
    .map((item) => item.url)
    .filter((url) => pathname === url || pathname.startsWith(`${url}/`))
    .sort((a, b) => b.length - a.length)[0]

  const handleSignOut = async () => {
    await authClient.signOut()
    if (isMobile) setOpenMobile(false)
    router.replace("/")
  }

  return (
    <Sidebar collapsible="icon" className="top-16! h-auto! lg:top-20!">
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-1">
        <div className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#3d2010] font-serif text-lg font-semibold text-[#fefaf5] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:text-sm"
          >
            {isPending ? "" : initial}
          </span>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-[15px] leading-tight font-semibold text-[#421d0d]">
              {isPending ? "Loading…" : userName}
            </p>
            <p className="mt-0.5 truncate text-[13px] leading-tight text-[#421d0d]/65">
              {roleLabel(role)}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <div
        role="separator"
        aria-orientation="horizontal"
        className="mx-3 h-px shrink-0 bg-sidebar-border"
      />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1.5">
            {isPending
              ? Array.from({ length: 3 }, (_, index) => (
                  <SidebarMenuItem key={index}>
                    <div
                      aria-hidden
                      className="flex h-10 items-center gap-2 rounded-lg px-2"
                    >
                      <span className="size-4 shrink-0 animate-pulse rounded bg-sidebar-foreground/15" />
                      <span
                        className="h-4 animate-pulse rounded bg-sidebar-foreground/15"
                        style={{ width: `${[70, 55, 65][index]}%` }}
                      />
                    </div>
                  </SidebarMenuItem>
                ))
              : menuItems.map((item) => {
                  const isActive = item.url === activeUrl

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={isActive}
                        tooltip={item.name}
                        aria-current={isActive ? "page" : undefined}
                        className="h-10! rounded-lg! text-[#421d0d]! hover:bg-[#2f1a0d]/6! hover:text-[#2a1509]! data-active:bg-[#421d0d]! data-active:font-semibold! data-active:text-[#fdf6e3]! data-active:hover:bg-[#421d0d]! data-active:hover:text-[#fdf6e3]!"
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        <div
          role="separator"
          aria-orientation="horizontal"
          className="mb-3 h-px shrink-0 bg-sidebar-border"
        />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={handleSignOut}
              className="h-10! rounded-lg! text-[#421d0d]! hover:bg-red-50! hover:text-red-600!"
            >
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
