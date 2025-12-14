"use client"

import { CreateNoteModal } from "@/components/create-note-modal"
import { NoteCard } from "@/components/note-card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"

interface Note {
  id: string
  title: string
  content: string
  folderId: string
  isPinned: boolean
  hasReminder: boolean
  createdAt: Date
  updatedAt: Date
}

interface FolderDetailViewProps {
  folderId: string
  folderName: string
  onBack: () => void
}

export function FolderDetailView({ folderId, folderName, onBack }: FolderDetailViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Load notes for this folder from localStorage
  useEffect(() => {
    loadNotes()
  }, [folderId])

  const loadNotes = () => {
    const savedNotes = localStorage.getItem("keeper-notes")
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes)
          .filter((note: any) => note.folderId === folderId)
          .map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }))
        setNotes(parsedNotes)
      } catch (error) {
        console.error("Error loading notes:", error)
      }
    }
  }

  const handleCreateNote = (noteData: { title: string; content: string; isReminder: boolean }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title,
      content: noteData.content,
      folderId,
      isPinned: false,
      hasReminder: noteData.isReminder,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to localStorage
    const savedNotes = localStorage.getItem("keeper-notes")
    const allNotes = savedNotes ? JSON.parse(savedNotes) : []
    const updatedNotes = [...allNotes, newNote]
    localStorage.setItem("keeper-notes", JSON.stringify(updatedNotes))

    setNotes((prev) => [...prev, newNote])
  }

  // This function is called from NoteCard with (noteId, title, content)
  const handleEditNote = (noteId: string, title: string, content: string) => {
    // Update the note with new data
    const noteToUpdate = notes.find(note => note.id === noteId)
    if (!noteToUpdate) return

    const updatedNote = {
      ...noteToUpdate,
      title,
      content,
      updatedAt: new Date(),
    }

    // Update in local state
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? updatedNote : note
    )
    setNotes(updatedNotes)

    // Update in localStorage
    const savedNotes = localStorage.getItem("keeper-notes")
    if (savedNotes) {
      const allNotes = JSON.parse(savedNotes)
      const updatedAllNotes = allNotes.map((note: any) =>
        note.id === noteId ? updatedNote : note
      )
      localStorage.setItem("keeper-notes", JSON.stringify(updatedAllNotes))
    }
  }

  const handleDeleteNote = (noteId: string) => {
    // Remove from localStorage
    const savedNotes = localStorage.getItem("keeper-notes")
    if (savedNotes) {
      const allNotes = JSON.parse(savedNotes)
      const updatedNotes = allNotes.filter((note: any) => note.id !== noteId)
      localStorage.setItem("keeper-notes", JSON.stringify(updatedNotes))
    }

    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  const handleTogglePin = (noteId: string) => {
    const updatedNotes = notes.map((note) => (note.id === noteId ? { ...note, isPinned: !note.isPinned } : note))

    // Update localStorage
    const savedNotes = localStorage.getItem("keeper-notes")
    if (savedNotes) {
      const allNotes = JSON.parse(savedNotes)
      const updatedAllNotes = allNotes.map((note: any) =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note,
      )
      localStorage.setItem("keeper-notes", JSON.stringify(updatedAllNotes))
    }

    setNotes(updatedNotes)
  }

  const handleToggleReminder = (noteId: string) => {
    const updatedNotes = notes.map((note) => (note.id === noteId ? { ...note, hasReminder: !note.hasReminder } : note))

    // Update localStorage
    const savedNotes = localStorage.getItem("keeper-notes")
    if (savedNotes) {
      const allNotes = JSON.parse(savedNotes)
      const updatedAllNotes = allNotes.map((note: any) =>
        note.id === noteId ? { ...note, hasReminder: !note.hasReminder } : note,
      )
      localStorage.setItem("keeper-notes", JSON.stringify(updatedAllNotes))
    }

    setNotes(updatedNotes)
  }

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort notes: pinned first, then by creation date
  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-4xl font-bold text-foreground text-balance">{folderName}</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {/* Notes List */}
      {sortedNotes.length > 0 ? (
        <div className="space-y-4 mb-8">
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              isPinned={note.isPinned}
              hasReminder={note.hasReminder}
              createdAt={note.createdAt}
              onDelete={handleDeleteNote}
              onEdit={handleEditNote}
              onTogglePin={handleTogglePin}
              onToggleReminder={handleToggleReminder}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <p className="text-foreground text-lg mb-2">No notes in this folder yet.</p>
          <p className="text-muted-foreground">Click the + button to create your first note.</p>
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