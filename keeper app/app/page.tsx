"use client"

import { ThemeProvider } from "@/app/context/theme-context"
import { FolderDetailView } from "@/components/folder-detail-view"
import { FoldersView } from "@/components/folders-view"
import { NotesView } from "@/components/notes-view"
import { SettingsView } from "@/components/settings-view"
import { FolderPlus, Home, Settings } from "lucide-react"
import { useEffect, useState } from "react"

type View = "notes" | "folders" | "settings" | "folder-detail"

export default function KeeperApp() {
  const [currentView, setCurrentView] = useState<View>("notes")
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string } | null>(null)

  // Listen for folder updates and sync the selected folder name
  useEffect(() => {
    const handleStorageChange = () => {
      if (selectedFolder && currentView === "folder-detail") {
        // Load folders from localStorage
        const savedFolders = localStorage.getItem("keeper-folders")
        if (savedFolders) {
          try {
            const folders = JSON.parse(savedFolders)
            const updatedFolder = folders.find((f: any) => f.id === selectedFolder.id)
            
            // If the folder name has changed, update the state
            if (updatedFolder && updatedFolder.name !== selectedFolder.name) {
              setSelectedFolder({ id: updatedFolder.id, name: updatedFolder.name })
            }
          } catch (error) {
            console.error("Error loading folders:", error)
          }
        }
      }
    }

    window.addEventListener("storage-update", handleStorageChange as EventListener)
    
    // Poll for changes every second (for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000)

    return () => {
      window.removeEventListener("storage-update", handleStorageChange as EventListener)
      clearInterval(interval)
    }
  }, [selectedFolder, currentView])

  const handleFolderClick = (folderId: string, folderName: string) => {
    setSelectedFolder({ id: folderId, name: folderName })
    setCurrentView("folder-detail")
  }

  const handleBackToFolders = () => {
    setSelectedFolder(null)
    setCurrentView("folders")
  }

  const renderView = () => {
    switch (currentView) {
      case "notes":
        return <NotesView />
      case "folders":
        return <FoldersView onFolderClick={handleFolderClick} />
      case "folder-detail":
        return selectedFolder ? (
          <FolderDetailView
            folderId={selectedFolder.id}
            folderName={selectedFolder.name}
            onBack={handleBackToFolders}
          />
        ) : (
          <FoldersView onFolderClick={handleFolderClick} />
        )
      case "settings":
        return <SettingsView />
      default:
        return <NotesView />
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Main Content */}
        <main className="flex-1 pb-20">{renderView()}</main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
          <div className="flex justify-around items-center py-4 px-8">
            <button
              onClick={() => setCurrentView("notes")}
              className={`p-3 rounded-full transition-colors ${
                currentView === "notes"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home size={24} />
            </button>

            <button
              onClick={() => setCurrentView("folders")}
              className={`p-3 rounded-full transition-colors ${
                currentView === "folders"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FolderPlus size={24} />
            </button>

            <button
              onClick={() => setCurrentView("settings")}
              className={`p-3 rounded-full transition-colors ${
                currentView === "settings"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings size={24} />
            </button>
          </div>
        </nav>
      </div>
    </ThemeProvider>
  )
}