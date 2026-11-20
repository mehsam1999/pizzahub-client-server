"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon, MapPin, Plus, Utensils, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createMenu } from "@/lib/actions/menu"
import { toast } from "@/components/ui/toast"
import {
  MenuItemFormField,
  menuItemFieldClass,
} from "@/components/menu/menu-item-form-field"
import { MENU_CATEGORIES } from "@/lib/constants/menu"
import type { MenuItemForm } from "@/lib/types/menu"

type MenuItemFormValues = Omit<MenuItemForm, "price"> & { price: string }

const EMPTY_FORM: MenuItemFormValues = {
  name: "",
  category: "",
  price: "",
  description: "",
  location: "",
  imageUrl: "",
  status: "Pending",
}
const AddMenuItemPage = () => {
  const router = useRouter()
  const [form, setForm] = useState<MenuItemFormValues>(EMPTY_FORM)
  const [saved, setSaved] = useState(false)

  const set =
    <K extends keyof MenuItemFormValues>(key: K) =>
    (value: MenuItemFormValues[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }))

  const isFormInvalid =
    !form.name.trim() ||
    !form.category ||
    !form.price.trim() ||
    !form.description.trim() ||
    !form.location.trim() ||
    !form.imageUrl.trim()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const menuItemData: MenuItemForm = { ...form, price: Number(form.price) }

    console.log("New menu item form data:", menuItemData)

    try {
      await createMenu(menuItemData)
      setForm(EMPTY_FORM)
      setSaved(true)
      toast.add({ title: "Menu item added", description: "Your menu item was added successfully.", type: "success" })
      router.push("/dashboard/vendor/menu-items")
    } catch {
      toast.add({ title: "Could not add menu item", description: "Please try again.", type: "error" })
    }
  }

  return (
    <div className="mx-auto w-full max-w-8xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Eyebrow */}
      <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.12em] text-[#421d0d] uppercase sm:text-[10px] sm:tracking-[0.2em]">
        <Utensils className="size-3.5 text-[#c8815a]" aria-hidden />
        Culinary Registry &bull; Artisan Submission
      </p>

      <h1 className="mt-3 font-serif text-3xl leading-tight font-bold text-[#421d0d] sm:text-4xl">
        Add Menu Item
      </h1>

      <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#6b5a4e] sm:text-sm">
        Submit a new artisan dish to your kitchen&apos;s menu. New recipes
        undergo quality audit before appearing on the public marketplace.
      </p>

      {/* Gold-to-espresso rule */}
      <div className="mt-6 flex h-px w-full" aria-hidden>
        <span className="h-px w-1/3 bg-[#f6c445]" />
        <span className="h-px flex-1 bg-[#421d0d]/70" />
      </div>

      <Card className="mt-7 gap-0! rounded-2xl bg-white py-0! shadow-[0_24px_60px_-48px_rgba(66,29,13,0.55)] ring-1 ring-[#421d0d]/8">
        <form onSubmit={handleSubmit} className="p-4 sm:p-7">
          {/* Item name */}
          <div>
            <MenuItemFormField id="item-name" label="Item Name">
                <Input
                  id="item-name"
                  value={form.name}
                  onChange={(event) => {
                    set("name")(event.target.value)
                    setSaved(false)
                  }}
                  placeholder="e.g. Burrata Pugliese & Prosciutto Crudo"
                  className={menuItemFieldClass}
                />
            </MenuItemFormField>
          </div>

          {/* Category + price */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <MenuItemFormField id="item-category" label="Category">
              <Select
                value={form.category}
                onValueChange={(value) => {
                  if (value !== null) {
                    set("category")(value)
                    setSaved(false)
                  }
                }}
              >
                <SelectTrigger
                  id="item-category"
                  className={`${menuItemFieldClass} !h-11 w-full justify-between data-placeholder:text-[#6b5a4e]/60`}
                >
                  <SelectValue placeholder="Select kitchen category" />
                </SelectTrigger>

                <SelectContent>
                  {MENU_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </MenuItemFormField>

            <MenuItemFormField id="item-price" label="Price">
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-[#6b5a4e]"
                >
                  $
                </span>

                <Input
                  id="item-price"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(event) => {
                    set("price")(event.target.value)
                    setSaved(false)
                  }}
                  placeholder="e.g. 24.50"
                  className={`${menuItemFieldClass} h-11 pl-8`}
                />
              </div>
            </MenuItemFormField>
          </div>

          {/* Description */}
          <MenuItemFormField
            id="item-description"
            label="Description"
            className="mt-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] text-[#6b5a4e] tabular-nums">
                {form.description.length} / 600
              </span>
            </div>

            <Textarea
              id="item-description"
              value={form.description}
              onChange={(event) => {
                set("description")(event.target.value)
                setSaved(false)
              }}
              maxLength={600}
              placeholder="Describe dough fermentation (e.g. 48h poolish), key imported ingredients, and flavor profile..."
              className={`${menuItemFieldClass} h-auto min-h-28 py-2.5`}
            />
          </MenuItemFormField>

          {/* Location */}
          <MenuItemFormField
            id="item-location"
            label="Location (Area / City)"
            className="mt-6"
          >
            <div className="relative">
              <MapPin
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#6b5a4e]"
              />

              <Input
                id="item-location"
                value={form.location}
                onChange={(event) => {
                  set("location")(event.target.value)
                  setSaved(false)
                }}
                placeholder="e.g. Pizza Hut Dhanmondi, Dhaka"
                className={`${menuItemFieldClass} pl-10`}
              />
            </div>
          </MenuItemFormField>

          {/* Image URL */}
          <MenuItemFormField
            id="item-image"
            label="Item Image URL"
            className="mt-6"
          >
            <div className="relative">
              <ImageIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#6b5a4e]"
              />

              <Input
                id="item-image"
                type="url"
                value={form.imageUrl}
                onChange={(event) => {
                  set("imageUrl")(event.target.value)
                  setSaved(false)
                }}
                placeholder="https://example.com/my-dish.jpg"
                className={`${menuItemFieldClass} pl-10`}
              />
            </div>

            {form.imageUrl.trim() !== "" ? (
              <div className="mt-3 overflow-hidden rounded-lg bg-[#fdf2e5] ring-1 ring-[#421d0d]/8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl}
                  alt="Menu item preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            ) : (
              <p className="text-[11px] text-[#6b5a4e]">
                Paste a direct image link (JPG, PNG or WebP).
              </p>
            )}
          </MenuItemFormField>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse items-stretch gap-3 border-t border-[#421d0d]/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p
              role="status"
              className="text-[12px] text-[#6b5a4e] sm:text-left"
            >
              {saved ? "Added to your registry." : ""}
            </p>

            <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(EMPTY_FORM)
                  setSaved(false)
                }}
                className="h-10 flex-1 rounded-lg border-[#421d0d]/15 bg-white px-5 text-[#421d0d] hover:bg-[#fdf2e5] sm:flex-none"
              >
                <X aria-hidden />
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isFormInvalid}
                className="h-10 flex-1 rounded-lg bg-[#421d0d] px-5 font-semibold text-[#fdf6e3] hover:bg-[#2f1a0d] sm:flex-none"
              >
                <Plus aria-hidden />
                Add Menu Item
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddMenuItemPage
