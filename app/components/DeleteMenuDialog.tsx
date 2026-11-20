"use client"
import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { MenuItem } from "../dashboard/vendor/menu-items/page"
import { deleteMenu } from "@/lib/actions/menu"
import { useState } from "react"
import { toast } from "@/components/ui/toast"

export function DeleteMenuDialog({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false)
  const handleDelete = async () => {
    const res = await deleteMenu(String(item._id))
    if (res.deletedCount) {
      setOpen(false)
      toast.add({
        title: "Menu Deleted",
        description: "The menu has been permanently deleted.",
      })
      window.location.reload()
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="destructive">
            <Trash2Icon />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>

          <AlertDialogTitle>Delete Menu Item?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this menu item? This action cannot
            be undone. The menu item will be permanently removed from your
            PizzaHub menu.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} variant="destructive">
            Delete Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
