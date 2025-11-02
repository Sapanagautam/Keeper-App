"use client"

import { Bell, Edit, FileText, Pin, Trash2 } from "lucide-react"
import { useState } from "react"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { EditNoteModal } from "./edit-note-modal"
import { SetReminderModal } from "./set-reminder-modal"

interface NoteCardProps {
  id: string
  title: string
  content: string
  isPinned?: boolean
  hasReminder?: boolean
  reminderDate?: string
  createdAt: Date
  onDelete?: (id: string) => void
  onEdit?: (id: string, title: string, content: string) => void
  onTogglePin?: (id: string) => void
  onToggleReminder?: (id: string, date?: string) => void
  onClick?: (id: string) => void
}

export function NoteCard({
  id,
  title,
  content,
  isPinned = false,
  hasReminder = false,
  reminderDate,
  createdAt,
  onDelete,
  onEdit,
  onTogglePin,
  onToggleReminder,
  onClick,
}: NoteCardProps) {
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    onDelete?.(id)
  }

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleReminderClick = () => {
    if (hasReminder) {
      onToggleReminder?.(id)
    } else {
      setShowReminderModal(true)
    }
  }

  const handleSaveReminder = (date: string) => {
    onToggleReminder?.(id, date)
  }

  const handleUpdateNote = (newTitle: string, newContent: string) => {
    onEdit?.(id, newTitle, newContent)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const truncateContent = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <>
      <div
        className={`bg-card rounded-lg p-4 border shadow-sm hover:shadow-md transition-all duration-200 relative group ${
          isPinned ? "border-primary/50 bg-primary/5" : "border-border"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Note Content */}
          <div onClick={() => onClick?.(id)} className="cursor-pointer flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${hasReminder ? "bg-accent/10" : "bg-primary/10"}`}>
                {hasReminder ? (
                  <Bell className="text-accent" size={16} />
                ) : (
                  <FileText className="text-primary" size={16} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground text-balance flex items-center gap-2">
                  {title}
                  {isPinned && <Pin size={14} className="text-primary" />}
                </h3>
              </div>
            </div>

            {content && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{truncateContent(content)}</p>
            )}
            <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleReminderClick()
              }}
              className={`p-2 rounded-lg transition-colors ${
                hasReminder
                  ? "text-accent hover:bg-accent/10"
                  : "text-muted-foreground hover:text-accent hover:bg-accent/10"
              }`}
              title={hasReminder ? "Remove reminder" : "Add reminder"}
            >
              <Bell size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Edit note"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete note"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* SetReminderModal component */}
      <SetReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onSave={handleSaveReminder}
        currentDate={reminderDate}
      />

      {/* DeleteConfirmationModal component */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* EditNoteModal component */}
      <EditNoteModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateNote}
        currentTitle={title}
        currentContent={content}
      />
    </>
  )
}
