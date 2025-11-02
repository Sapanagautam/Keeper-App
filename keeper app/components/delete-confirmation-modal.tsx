"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure to delete?",
  message = "This action cannot be undone. This will permanently delete the note.",
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{message}</p>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-muted/50 hover:bg-muted border-border text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  )
}
