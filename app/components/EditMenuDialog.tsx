
"use client"

import { useState } from "react"
import type { MenuItem, MenuItemForm } from "@/lib/types/menu"
import { updateMenu } from "@/lib/actions/menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type EditMenuDialogProps = {
  item: MenuItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: (item: MenuItem) => void
}

export function EditMenuDialog({
  item,
  open,
  onOpenChange,
  onUpdated,
}: EditMenuDialogProps) {
  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-menu-dialog-title"
          className="max-h-[90vh] w-full overflow-y-auto rounded-lg border bg-background p-6 shadow-lg sm:max-w-2xl"
        >
          <div className="mb-4 space-y-1.5">
            <h2 id="edit-menu-dialog-title" className="text-lg font-semibold">
              Edit Menu Item
            </h2>
            <p className="text-sm text-muted-foreground">
              Update your menu item information below.
            </p>
          </div>

          {item && (
            <EditMenuForm
              key={String(item._id)}
              item={item}
              onOpenChange={onOpenChange}
              onUpdated={onUpdated}
            />
          )}
        </div>
      </div>
    )
  )
}

function EditMenuForm({
  item,
  onOpenChange,
  onUpdated,
}: {
  item: MenuItem
  onOpenChange: (open: boolean) => void
  onUpdated: (item: MenuItem) => void
}) {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: item.name || "",
    category: item.category || "",
    price: String(item.price || ""),
    description: item.description || "",
    location: item.location || "",
    imageUrl: item.imageUrl || "",
    images: [
      item.images?.[0] || "",
      item.images?.[1] || "",
      item.images?.[2] || "",
    ],
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const images = [...prev.images]
      images[index] = value

      return {
        ...prev,
        images,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    try {
      const updatedData: MenuItemForm = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        location: formData.location,
        imageUrl: formData.imageUrl,
        images: formData.images.filter((image) => image.trim() !== ""),
        status: item.status,
      }

      const result = await updateMenu(String(item._id), updatedData)

      onUpdated(result)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update menu item:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Menu Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={600}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Main Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Additional Images (Maximum 3)</Label>

        {formData.images.map((image, index) => (
          <Input
            key={index}
            type="url"
            placeholder={`Image URL ${index + 1}`}
            value={image}
            onChange={(e) => handleImageChange(index, e.target.value)}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
