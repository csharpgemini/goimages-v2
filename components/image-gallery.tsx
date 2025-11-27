"use client"

import { useState } from "react"
import { Trash2, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Socket } from "socket.io-client"

interface ImageItem {
  _id: string
  url: string
  uploadedAt: string
}

interface ImageGalleryProps {
  images: ImageItem[]
  loading: boolean
  onDelete: (id: string) => void
  socket: Socket | null
}

export default function ImageGallery({ images, loading, onDelete, socket }: ImageGalleryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId)
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete(imageId)
        socket?.emit("imageDeleted", imageId)
      }
    } catch (error) {
      console.error("Failed to delete image:", error)
      alert("Failed to delete image")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400">No images uploaded yet. Start by adding an image URL or uploading a file.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div
          key={image._id}
          className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors group"
        >
          <div className="relative w-full h-48 bg-zinc-900">
            <img
              src={image.url || "/placeholder.svg"}
              alt="Gallery item"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/broken-image.jpg"
              }}
            />
          </div>

          <div className="p-4 flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-400">{new Date(image.uploadedAt).toLocaleDateString()}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(image._id)}
              disabled={deletingId === image._id}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 ml-2"
            >
              {deletingId === image._id ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
