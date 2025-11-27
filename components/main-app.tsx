"use client"

import { useState, useEffect } from "react"
import UploadForm from "./upload-form"
import ImageGallery from "./image-gallery"
import type { Socket } from "socket.io-client"

interface Image {
  _id: string
  url: string
  uploadedAt: string
}

interface MainAppProps {
  socket: Socket | null
}

export default function MainApp({ socket }: MainAppProps) {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial images
    fetchImages()

    if (socket) {
      // Listen for new image updates
      socket.on("imageUploaded", (newImage: Image) => {
        setImages((prev) => [newImage, ...prev])
      })

      socket.on("imageDeleted", (imageId: string) => {
        setImages((prev) => prev.filter((img) => img._id !== imageId))
      })

      return () => {
        socket.off("imageUploaded")
        socket.off("imageDeleted")
      }
    }
  }, [socket])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/images")
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error("Failed to fetch images:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (newImage: Image) => {
    setImages((prev) => [newImage, ...prev])
  }

  const handleImageDelete = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img._id !== imageId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Image Gallery</h1>
          <p className="text-zinc-400">Upload images via URL or from your device</p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <UploadForm onUpload={handleImageUpload} socket={socket} />
        </div>

        {/* Gallery Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
          <ImageGallery images={images} loading={loading} onDelete={handleImageDelete} socket={socket} />
        </div>
      </div>
    </div>
  )
}
