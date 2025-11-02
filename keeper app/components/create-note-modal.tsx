"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, X } from "lucide-react"
import { useEffect, useState } from "react"

interface CreateNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateNote?: (note: { title: string; content: string; isReminder: boolean; reminderDate?: string }) => void
}

export function CreateNoteModal({ isOpen, onClose, onCreateNote }: CreateNoteModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isReminder, setIsReminder] = useState(false)
  const [reminderDate, setReminderDate] = useState("")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onCreateNote?.({
        title: title.trim(),
        content: content.trim(),
        isReminder,
        reminderDate: isReminder && reminderDate ? reminderDate : undefined,
      })
      setTitle("")
      setContent("")
      setIsReminder(false)
      setReminderDate("")
      onClose()
    }
  }

  const handleClose = () => {
    setTitle("")
    setContent("")
    setIsReminder(false)
    setReminderDate("")
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-lg animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">Create a new note</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm hover:bg-accent"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full border-2 border-primary/50 focus:border-primary bg-input"
              autoFocus
            />
          </div>

          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start your text here..."
              className="w-full min-h-32 resize-none border border-border bg-input"
              rows={6}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isReminder"
              checked={isReminder}
              onChange={(e) => setIsReminder(e.target.checked)}
              className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
            />
            <label htmlFor="isReminder" className="text-sm text-card-foreground cursor-pointer">
              Set as reminder
            </label>
          </div>

          {isReminder && (
            <div>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Pick a date"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose} className="px-6">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              disabled={!title.trim() || (isReminder && !reminderDate)}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
