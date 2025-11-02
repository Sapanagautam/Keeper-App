"use client"

import { Button } from "@/components/ui/button"
import { Calendar, X } from "lucide-react"
import { useState } from "react"

interface SetReminderModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (date: string) => void
  currentDate?: string
}

export function SetReminderModal({ isOpen, onClose, onSave, currentDate }: SetReminderModalProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate || "")

  if (!isOpen) return null

  const handleSave = () => {
    if (selectedDate) {
      onSave(selectedDate)
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedDate(currentDate || "")
    onClose()
  }

  // Get current date and time in the format required for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date()
    // Format: YYYY-MM-DDTHH:MM
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Set a reminder</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Date Picker */}
        <div className="mb-6">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="datetime-local"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getCurrentDateTime()}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Pick a date"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <Button onClick={handleCancel} variant="outline" className="px-6 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedDate} className="px-6 bg-primary hover:bg-primary/90">
            Save Reminder
          </Button>
        </div>
      </div>
    </div>
  )
}