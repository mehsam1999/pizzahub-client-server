
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Loader2, XCircle } from "lucide-react"

type CancelOrderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isCancelling: boolean
}

export function CancelOrderDialog({
  open,
  onOpenChange,
  onConfirm,
  isCancelling,
}: CancelOrderDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-[400px] rounded-xl border-[#ead9cc]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-lg text-[#421d0d]">
            Cancel Order?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm leading-relaxed text-[#6b5a4e]">
            Are you sure you want to cancel this order? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isCancelling}
            className="border-[#ead9cc] text-[#6b5a4e] hover:bg-[#fdf2e5]"
          >
            Keep Order
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={isCancelling}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="mr-2 size-4" />
                Yes, Cancel Order
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
