"use client"

import { useState } from "react"
import { ImageIcon, MapPin, Plus, Utensils, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createMenu } from "@/lib/actions/menu"

const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const

export type MenuItemForm = {
  name: string
  category: string
  price: string
  description: string
  location: string
  imageUrl: string
}

const EMPTY_FORM: MenuItemForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  location: "",
  imageUrl: "",
}

const fieldClass =
  "h-11 rounded-lg border-transparent bg-[#fdf2e5] px-3.5 text-sm text-[#421d0d] placeholder:text-[#6b5a4e]/60 focus-visible:border-[#f6c445] focus-visible:ring-[#f6c445]/30"

const AddMenuItemPage = () => {
  const [form, setForm] = useState<MenuItemForm>(EMPTY_FORM)
  const [saved, setSaved] = useState(false)

  const set =
    <K extends keyof MenuItemForm>(key: K) =>
    (value: MenuItemForm[K]) =>
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

    const menuItemData: MenuItemForm = { ...form }

    console.log("New menu item form data:", menuItemData)

    setForm(EMPTY_FORM)
    setSaved(true)

    const result = await createMenu(menuItemData)
    console.log("CreateMenu result:", result)
  }

  return (
    <div className="max-w-8xl mx-auto w-full px-4 py-8 sm:px-6 sm:py-10">
      {/* Eyebrow */}
      <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-[#421d0d] uppercase">
        <Utensils className="size-3.5 text-[#c8815a]" aria-hidden />
        Culinary Registry &bull; Artisan Submission
      </p>

      <h1 className="mt-3 font-serif text-3xl leading-tight font-bold text-[#421d0d] sm:text-4xl">
        Add Menu Item
      </h1>

      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6b5a4e]">
        Submit a new artisan dish to your kitchen&apos;s menu. New recipes
        undergo quality audit before appearing on the public marketplace.
      </p>

      {/* Gold-to-espresso rule */}
      <div className="mt-6 flex h-px w-full" aria-hidden>
        <span className="h-px w-1/3 bg-[#f6c445]" />
        <span className="h-px flex-1 bg-[#421d0d]/70" />
      </div>

      <Card className="mt-7 gap-0! rounded-2xl bg-white py-0! shadow-[0_24px_60px_-48px_rgba(66,29,13,0.55)] ring-1 ring-[#421d0d]/8">
        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          {/* Item name */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <Label
                htmlFor="item-name"
                className="text-[13px] font-semibold text-[#421d0d]"
              >
                Item Name <span className="text-[#c8815a]">*</span>
              </Label>
            </div>

            <Input
              id="item-name"
              value={form.name}
              onChange={(event) => {
                set("name")(event.target.value)
                setSaved(false)
              }}
              placeholder="e.g. Burrata Pugliese & Prosciutto Crudo"
              className={fieldClass}
            />
          </div>

          {/* Category + price */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="item-category"
                className="text-[13px] font-semibold text-[#421d0d]"
              >
                Category <span className="text-[#c8815a]">*</span>
              </Label>

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
                  className={`${fieldClass} !h-11 w-full justify-between data-placeholder:text-[#6b5a4e]/60`}
                >
                  <SelectValue placeholder="Select kitchen category" />
                </SelectTrigger>

                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="item-price"
                className="text-[13px] font-semibold text-[#421d0d]"
              >
                Price <span className="text-[#c8815a]">*</span>
              </Label>

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
                  className={`${fieldClass} h-11 pl-8`}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <Label
                htmlFor="item-description"
                className="text-[13px] font-semibold text-[#421d0d]"
              >
                Description <span className="text-[#c8815a]">*</span>
              </Label>

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
              className={`${fieldClass} h-auto min-h-28 py-2.5`}
            />
          </div>

          {/* Location */}
          <div className="mt-6 space-y-2">
            <Label
              htmlFor="item-location"
              className="text-[13px] font-semibold text-[#421d0d]"
            >
              Location (Area / City) <span className="text-[#c8815a]">*</span>
            </Label>

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
                className={`${fieldClass} pl-10`}
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="mt-6 space-y-2">
            <Label
              htmlFor="item-image"
              className="text-[13px] font-semibold text-[#421d0d]"
            >
              Item Image URL <span className="text-[#c8815a]">*</span>
            </Label>

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
                className={`${fieldClass} pl-10`}
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
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse items-stretch gap-3 border-t border-[#421d0d]/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p
              role="status"
              className="text-[12px] text-[#6b5a4e] sm:text-left"
            >
              {saved ? "Added to your registry." : ""}
            </p>

            <div className="flex items-center gap-2 sm:justify-end">
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
