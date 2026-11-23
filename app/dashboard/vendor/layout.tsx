import { requireRole } from "@/lib/core/server"

const VendorLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireRole("vendor")
  return children
}

export default VendorLayout
