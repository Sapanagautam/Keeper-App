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
  const [name, setName] = useState("")

  useEffect(() => {
    if (isOpen) {
      setName(currentName)
    }
  }, [isOpen, currentName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onUpdate(name.trim())
      onClose()
    }
  }

  const handleClose = () => {
    setName("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">Edit folder</h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-primary/50 focus:border-primary"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
