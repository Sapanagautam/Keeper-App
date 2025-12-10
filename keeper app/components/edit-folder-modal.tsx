"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface EditFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (name: string) => void
  currentName: string
}

export function EditFolderModal({ isOpen, onClose, onUpdate, currentName }: EditFolderModalProps) {
  const [name, setName] = useState(currentName)

  // Update local state when props change
  useEffect(() => {
    setName(currentName)
  }, [currentName])

  const handleSubmit = () => {
    if (name.trim()) {
      onUpdate(name.trim())
      onClose()
    }
  }

  const handleClose = () => {
    // Reset to current value instead of empty string
    setName(currentName)
    onClose()
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-background rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">Edit folder</h2>
          <button 
            type="button"
            onClick={handleClose} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border-2 border-primary/50 focus:border-primary"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}