"use client"
import { Button } from "@/components/ui/button"
import { FileText, Folder } from "lucide-react"

interface ReminderCardProps {
  id: string
  title: string
  content: string
  reminderDate: Date
  folderId?: string
  folderName?: string
  onRemove: (id: string) => void
  onClick?: () => void  // Added onClick prop
  isFolder?: boolean
}

export function ReminderCard({
  id,
  title,
  content,
  reminderDate,
  folderId,
  folderName,
  onRemove,
  onClick,  // Added onClick
  isFolder = false,
}: ReminderCardProps) {
  const formatReminderDate = (date: Date) => {
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    )
  }

  return (
    <div 
      className={`bg-card rounded-lg p-4 border border-border shadow-sm ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {isFolder ? (
            <Folder className="text-primary" size={16} />
          ) : (
            <FileText className="text-muted-foreground" size={16} />
          )}
          <h3 className="font-medium text-card-foreground text-lg">{title}</h3>
        </div>
        <span className="text-sm text-muted-foreground">{formatReminderDate(reminderDate)}</span>
      </div>

      {content && <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{content}</p>}

      {folderName && !isFolder && <p className="text-xs text-muted-foreground mb-3">Folder: {folderName}</p>}

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()  // Prevent triggering card click when removing
            onRemove(id)
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          Remove
        </Button>
      </div>
    </div>
  )
}