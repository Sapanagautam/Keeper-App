"use client"

import { CreateFolderModal } from "@/components/create-folder-modal"
import { FolderCard } from "@/components/folder-card"
import { Input } from "@/components/ui/input"
import { FolderPlus, Search } from "lucide-react"
import { useEffect, useState } from "react"

interface Folder {
  id: string
  name: string
  noteCount: number
  createdAt: Date
  hasReminder?: boolean
  reminderDate?: string
}

interface FoldersViewProps {
  onFolderClick?: (folderId: string, folderName: string) => void
}

export function FoldersView({ onFolderClick }: FoldersViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [folders, setFolders] = useState<Folder[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Load folders from localStorage on component mount
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

  const handleCreateFolder = (folderName: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: folderName,
      noteCount: 0,
      createdAt: new Date(),
      hasReminder: false,
      reminderDate: undefined,
    }
    const updatedFolders = [...folders, newFolder]
    setFolders(updatedFolders)
    localStorage.setItem("keeper-folders", JSON.stringify(updatedFolders))
    window.dispatchEvent(new Event("storage-update"))
  }

  const handleDeleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter((folder) => folder.id !== folderId)
    setFolders(updatedFolders)
    localStorage.setItem("keeper-folders", JSON.stringify(updatedFolders))
    window.dispatchEvent(new Event("storage-update"))
  }

  const handleRenameFolder = (folderId: string, newName: string) => {
    const updatedFolders = folders.map((folder) => 
      folder.id === folderId ? { ...folder, name: newName } : folder
    )
    setFolders(updatedFolders)
    localStorage.setItem("keeper-folders", JSON.stringify(updatedFolders))
    window.dispatchEvent(new Event("storage-update"))
  }

  const handleFolderClick = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId)
    if (folder && onFolderClick) {
      onFolderClick(folderId, folder.name)
    }
  }

  const handleToggleReminder = (folderId: string, date?: string) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        if (date) {
          // Setting a reminder
          return { ...folder, hasReminder: true, reminderDate: date }
        } else {
          // Removing a reminder
          return { ...folder, hasReminder: false, reminderDate: undefined }
        }
      }
      return folder
    })
    setFolders(updatedFolders)
    localStorage.setItem("keeper-folders", JSON.stringify(updatedFolders))
    window.dispatchEvent(new Event("storage-update"))
  }

  // Filter folders based on search query
  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance"> The Keeper App</h1>
        <h2 className="text-2xl font-semibold text-foreground">CREATE A NEW FOLDER</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {/* Folders Grid */}
      {filteredFolders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              noteCount={folder.noteCount}
              hasReminder={folder.hasReminder}
              reminderDate={folder.reminderDate}
              onDelete={handleDeleteFolder}
              onRename={handleRenameFolder}
              onToggleReminder={handleToggleReminder}
              onClick={handleFolderClick}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <p className="text-foreground text-lg">
            {searchQuery
              ? `No folders found matching "${searchQuery}"`
              : "No folders yet. Click the + button to create your first folder."}
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <FolderPlus size={24} />
      </button>

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  )
}