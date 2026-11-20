import type { ReactNode } from "react"

import { Label } from "@/components/ui/label"

export const menuItemFieldClass =
  "h-11 rounded-lg border-transparent bg-[#fdf2e5] px-3.5 text-sm text-[#421d0d] placeholder:text-[#6b5a4e]/60 focus-visible:border-[#f6c445] focus-visible:ring-[#f6c445]/30"

export function MenuItemFormField({
  id,
  label,
  children,
  className,
}: {
  id: string
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-[13px] font-semibold text-[#421d0d]">
        {label} <span className="text-[#c8815a]">*</span>
      </Label>
      {children}
    </div>
  )
}
