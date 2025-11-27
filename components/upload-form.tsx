"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"
import type { Socket } from "socket.io-client"

interface UploadFormProps {
  onUpload: (image: any) => void
  socket: Socket | null
}

export default function UploadForm({ onUpload, socket }: UploadFormProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(0)

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      })

      const data = await response.json()
      if (response.ok) {
        onUpload(data)
        setImageUrl("")
        socket?.emit("imageUploaded", data)
      }
    } catch (error) {
      console.error("Failed to add image:", error)
      alert("Failed to add image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsLoading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()
        if (response.ok) {
          const imageData = {
            _id: data._id,
            url: data.url,
            uploadedAt: data.uploadedAt,
          }
          onUpload(imageData)
          socket?.emit("imageUploaded", imageData)
        }
      }
    } catch (error) {
      console.error("Failed to upload file:", error)
      alert("Failed to upload file")
    } finally {
      setIsLoading(false)
      setFileInputKey((prev) => prev + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Image URL</h3>
        <form onSubmit={handleUrlSubmit} className="flex gap-3">
          <Input
            type="url"
            placeholder="Enter image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !imageUrl.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add"
            )}
          </Button>
        </form>
      </div>

      {/* File Upload */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Upload from Device</h3>
        <div className="relative">
          <input
            key={fileInputKey}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-zinc-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className="text-center">
              <p className="text-white font-medium">
                {isLoading ? "Uploading..." : "Click to upload or drag and drop"}
              </p>
              <p className="text-zinc-400 text-sm mt-1">PNG, JPG, MP4, etc.</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
