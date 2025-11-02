"use client"

import { Bell, Edit, Folder, MoreVertical, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { EditFolderModal } from "./edit-folder-modal"
import { SetReminderModal } from "./set-reminder-modal"

interface FolderCardProps {
  id: string
  name: string
  noteCount?: number
  hasReminder?: boolean
  reminderDate?: string
  onDelete?: (id: string) => void
  onRename?: (id: string, newName: string) => void
  onToggleReminder?: (id: string, date?: string) => void
  onClick?: (id: string) => void
}

export function FolderCard({
  id,
  name,
  noteCount = 0,
  hasReminder = false,
  reminderDate,
  onDelete,
  onRename,
  onToggleReminder,
  onClick,
}: FolderCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMenu])

  const handleDelete = () => {
    setShowDeleteModal(true)
    setShowMenu(false)
  }

  const handleConfirmDelete = () => {
    onDelete?.(id)
  }

  const handleEdit = () => {
    setShowEditModal(true)
    setShowMenu(false)
  }

  const handleUpdateFolder = (newName: string) => {
    onRename?.(id, newName)
  }

  const handleReminderClick = () => {
    if (hasReminder) {
      onToggleReminder?.(id)
    } else {
      setShowReminderModal(true)
    }
    setShowMenu(false)
  }

  const handleSaveReminder = (date: string) => {
    onToggleReminder?.(id, date)
  }

  return (
    <>
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-all duration-200 relative group">
        {/* Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={16} />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-8 right-2 bg-popover border border-border rounded-md shadow-lg z-10 min-w-32 animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <button
              onClick={handleEdit}
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-t-md"
            >
              <Edit size={14} />
              Rename
            </button>
            <button
              onClick={handleReminderClick}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 ${
                hasReminder ? "text-accent" : ""
              }`}
            >
              <Bell size={14} />
              {hasReminder ? "Remove Reminder" : "Set Reminder"}
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-3 py-2 text-left text-sm hover:bg-destructive hover:text-destructive-foreground flex items-center gap-2 rounded-b-md"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}

        {/* Folder Content */}
        <div onClick={() => onClick?.(id)} className="cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Folder className="text-primary" size={24} />
            </div>
            <h3 className="font-medium text-card-foreground text-balance">{name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </p>
        </div>
      </div>

      {/* SetReminderModal component */}
      <SetReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onSave={handleSaveReminder}
        currentDate={reminderDate}
      />

      <EditFolderModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateFolder}
        currentName={name}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
