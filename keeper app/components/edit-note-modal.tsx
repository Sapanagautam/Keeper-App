"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface EditNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (title: string, content: string) => void
  currentTitle: string
  currentContent: string
}

export function EditNoteModal({ isOpen, onClose, onUpdate, currentTitle, currentContent }: EditNoteModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle)
      setContent(currentContent)
    }
  }, [isOpen, currentTitle, currentContent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onUpdate(title.trim(), content.trim())
      onClose()
    }
  }

  const handleClose = () => {
    setTitle("")
    setContent("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">Edit note</h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <Textarea
              placeholder="Start your text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[200px] border-2 border-primary/50 focus:border-primary resize-none"
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
