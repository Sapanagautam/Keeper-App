"use client"

import { useTheme } from "@/app/context/theme-context"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Trash2, X } from "lucide-react"
import { useState } from "react"

export function SettingsView() {
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleClearAllDataClick = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmClearData = () => {
    // Clear localStorage or any stored data
    localStorage.clear()
    // Clear any other app data here
    sessionStorage.clear()

    setShowConfirmModal(false)
    setShowSuccessToast(true)

    // Hide toast and reload after delay
    setTimeout(() => {
      setShowSuccessToast(false)
      window.location.reload()
    }, 2000)
  }

  const handleCancelClearData = () => {
    setShowConfirmModal(false)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        
        <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Theme Toggle Section */}
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-1">Appearance</h3>
              <p className="text-muted-foreground text-sm">
                Choose your preferred theme
              </p>
            </div>

            {/* Animated Toggle on the right */}
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium transition-colors ${
                theme === "light" ? "text-foreground" : "text-muted-foreground"
              }`}>
                Light
              </span>
              
              <button
                onClick={toggleTheme}
                className={`relative w-20 h-10 rounded-full transition-all duration-500 ${
                  theme === "dark" 
                    ? "bg-slate-800" 
                    : "bg-blue-400"
                }`}
              >
                {/* Toggle Circle */}
                <div
                  className={`absolute top-1 w-8 h-8 rounded-full shadow-lg transition-all duration-500 flex items-center justify-center ${
                    theme === "dark" 
                      ? "left-[44px] bg-slate-900" 
                      : "left-1 bg-white"
                  }`}
                >
                  {theme === "dark" ? (
                    <>
                      {/* Moon with stars */}
                      <Moon size={16} className="text-yellow-200 fill-yellow-200" />
                      <div className="absolute -top-1 -left-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute top-1 -right-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-1 left-1">
                        <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                      </div>
                    </>
                  ) : (
                    <Sun size={16} className="text-yellow-500" />
                  )}
                </div>

                {/* Background decorations */}
                {theme === "dark" && (
                  <div className="absolute inset-0 flex items-center justify-start pl-2">
                    <div className="flex gap-1.5">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                )}

                {theme === "light" && (
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                      <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                    </div>
                  </div>
                )}
              </button>

              <span className={`text-sm font-medium transition-colors ${
                theme === "dark" ? "text-foreground" : "text-muted-foreground"
              }`}>
                Dark
              </span>
            </div>
          </div>
        </div>

        {/* Clear All Data Section */}
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">Data Management</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Remove all your notes, folders, and app data. This action cannot be undone.
          </p>

          <Button
            onClick={handleClearAllDataClick}
            variant="destructive"
            className="w-full flex items-center justify-center gap-2 py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <Trash2 size={20} />
            Clear All Data
          </Button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-amber-800">Are you sure?</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelClearData}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </Button>
            </div>

            <p className="text-amber-700 mb-6 text-sm leading-relaxed">
              This action will permanently delete all your notes and folders. This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleCancelClearData}
                variant="outline"
                className="px-6 bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmClearData} className="px-6 bg-red-500 hover:bg-red-600 text-white">
                Yes, clear all data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}