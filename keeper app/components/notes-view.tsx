"use client"

import { CreateNoteModal } from "@/components/create-note-modal"
import { NoteCard } from "@/components/note-card"
import { ReminderCard } from "@/components/reminder-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Plus, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Note {
  id: string
  title: string
  content: string
  isReminder: boolean
  reminderDate?: Date
  createdAt: Date
  folderId?: string
}

interface Folder {
  id: string
  name: string
  noteCount: number
  createdAt: Date
  hasReminder?: boolean
  reminderDate?: string
}

export function NotesView() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"notes" | "reminders">("notes")
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [folders, setFolders] = useState<Folder[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load notes and folders from localStorage on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Listen for storage changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      loadData()
    }

    window.addEventListener("storage-update", handleStorageChange as EventListener)
    
    // Poll for changes every second (for same-tab updates)
    const interval = setInterval(loadData, 1000)

    return () => {
      window.removeEventListener("storage-update", handleStorageChange as EventListener)
      clearInterval(interval)
    }
  }, [])

  const loadData = () => {
    // Load notes
    const savedNotes = localStorage.getItem("keeper-notes")
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          reminderDate: note.reminderDate ? new Date(note.reminderDate) : undefined,
        }))
        setNotes(parsedNotes)
      } catch (error) {
        console.error("Error loading notes:", error)
      }
    }

    // Load folders
    const savedFolders = localStorage.getItem("keeper-folders")
    if (savedFolders) {
      try {
        const parsedFolders = JSON.parse(savedFolders).map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt),
        }))
        setFolders(parsedFolders)
      } catch (error) {
        console.error("Error loading folders:", error)
      }
    }
  }

  const updateFolderCounts = (allNotes: Note[]) => {
    const savedFolders = localStorage.getItem("keeper-folders")
    if (savedFolders) {
      const folders = JSON.parse(savedFolders)
      const updatedFolders = folders.map((folder: Folder) => {
        const count = allNotes.filter(note => note.folderId === folder.id).length
        return { ...folder, noteCount: count }
      })
      localStorage.setItem("keeper-folders", JSON.stringify(updatedFolders))
      window.dispatchEvent(new Event("storage-update"))
    }
  }

  const handleCreateNote = (noteData: {
    title: string
    content: string
    isReminder: boolean
    reminderDate?: string
  }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title,
      content: noteData.content,
      isReminder: noteData.isReminder,
      reminderDate: noteData.reminderDate ? new Date(noteData.reminderDate) : undefined,
      createdAt: new Date(),
    }
    
    const updatedNotes = [newNote, ...notes]
    setNotes(updatedNotes)
    localStorage.setItem("keeper-notes", JSON.stringify(updatedNotes))
    updateFolderCounts(updatedNotes)
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    setNotes(updatedNotes)
    localStorage.setItem("keeper-notes", JSON.stringify(updatedNotes))
    updateFolderCounts(updatedNotes)
  }

  const handleRemoveReminder = (noteId: string) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === noteId) {
        return {
          ...note,
          isReminder: false,
          reminderDate: undefined,
        }
      }
      return note
    })
    setNotes(updatedNotes)
    localStorage.setItem("keeper-notes", JSON.stringify(updatedNotes))
    updateFolderCounts(updatedNotes)
  }

  const handleToggleReminder = (noteId: string, date?: string) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === noteId) {
        if (date) {
          return {
            ...note,
            isReminder: true,
            reminderDate: new Date(date),
          }
        } else {
          return {
            ...note,
            isReminder: false,
            reminderDate: undefined,
          }
        }
      }
      return note
    })
    
    setNotes(updatedNotes)
    localStorage.setItem("keeper-notes", JSON.stringify(updatedNotes))
  }

  const handleEditNote = (noteId: string, title: string, content: string) => {
    const updatedNotes = notes.map((note) => 
      note.id === noteId ? { ...note, title, content } : note
    )
    setNotes(updatedNotes)
    localStorage.setItem("keeper-notes", JSON.stringify(updatedNotes))
  }

  const handleNoteClick = (noteId: string) => {
    console.log("Opening note:", noteId)
  }

  const handleUpdateNote = (noteId: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map((note) => 
      note.id === noteId ? { ...note, ...updates } : note
    )
    setNotes(updatedNotes)
    localStorage.setItem("keeper-notes", JSON.stringify(updatedNotes))
  }

  const handleRemoveFolderReminder = (folderId: string) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return { ...folder, hasReminder: false, reminderDate: undefined }
      }
      return folder
    })
    setFolders(updatedFolders)
    localStorage.setItem("keeper-folders", JSON.stringify(updatedFolders))
    window.dispatchEvent(new Event("storage-update"))
  }

  // Handle Notes button click - focus search bar
  const handleNotesTabClick = () => {
    setActiveTab("notes")
    // Focus the search input after a small delay to ensure the tab has switched
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }

  // Filter notes based on active tab and search query
  const filteredNotes = notes.filter((note) => {
    // In Notes tab: show notes WITHOUT a folderId (both reminder and non-reminder notes)
    // In Reminders tab: show notes that are reminders
    const matchesTab = activeTab === "notes" 
      ? !note.folderId  // Show all notes without folderId (including reminders)
      : note.isReminder  // Show only reminder notes
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const filteredFolderReminders = folders.filter((folder) => {
    if (activeTab !== "reminders" || !folder.hasReminder) return false
    const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getFolderName = (folderId?: string) => {
    if (!folderId) return undefined
    const folder = folders.find((f) => f.id === folderId)
    return folder?.name
  }

  // Get current time and greeting
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "Good morning!" : hour < 18 ? "Good afternoon!" : "Good evening!"
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance text-center">Welcome to The Keeper App</h1>
        <div className="text-foreground">
          <p className="text-lg font-medium">{greeting}</p>
          <p className="text-sm text-muted-foreground">
            {dateString} • {timeString}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          ref={searchInputRef}
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 justify-center">
        <Button
          variant={activeTab === "notes" ? "default" : "secondary"}
          onClick={handleNotesTabClick}
          className="flex items-center gap-2"
        >
          <Search size={16} />
          Notes
        </Button>
        <Button
          variant={activeTab === "reminders" ? "default" : "secondary"}
          onClick={() => setActiveTab("reminders")}
          className="flex items-center gap-2"
        >
          <Bell size={16} />
          Reminders
        </Button>
      </div>

      {/* Notes/Reminders Grid */}
      {filteredNotes.length > 0 || (activeTab === "reminders" && filteredFolderReminders.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {activeTab === "notes"
            ? filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  content={note.content}
                  hasReminder={note.isReminder}
                  reminderDate={note.reminderDate?.toISOString()}
                  createdAt={note.createdAt}
                  onDelete={handleDeleteNote}
                  onEdit={handleEditNote}
                  onToggleReminder={handleToggleReminder}
                  onClick={handleNoteClick}
                />
              ))
            : [
                ...filteredNotes.map((note) => (
                  <ReminderCard
                    key={`note-${note.id}`}
                    id={note.id}
                    title={note.title}
                    content={note.content}
                    reminderDate={note.reminderDate || note.createdAt}
                    folderId={note.folderId}
                    folderName={getFolderName(note.folderId)}
                    onRemove={handleRemoveReminder}
                  />
                )),
                ...filteredFolderReminders.map((folder) => (
                  <ReminderCard
                    key={`folder-${folder.id}`}
                    id={folder.id}
                    title={folder.name}
                    content={`Folder with ${folder.noteCount} ${folder.noteCount === 1 ? "note" : "notes"}`}
                    reminderDate={folder.reminderDate ? new Date(folder.reminderDate) : folder.createdAt}
                    folderId={folder.id}
                    folderName={folder.name}
                    onRemove={handleRemoveFolderReminder}
                    isFolder={true}
                  />
                )),
              ]}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <p className="text-foreground text-lg">
            {searchQuery
              ? `No ${activeTab} found matching "${searchQuery}"`
              : `No ${activeTab} yet. Click the + button to create your first ${activeTab.slice(0, -1)}.`}
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <Plus size={24} />
      </button>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateNote={handleCreateNote}
      />
    </div>
  )
}