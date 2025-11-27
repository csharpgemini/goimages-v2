"use client"

import { useState, useEffect } from "react"
import PasswordModal from "@/components/password-modal"
import MainApp from "@/components/main-app"
import { io, type Socket } from "socket.io-client" // Import 'Socket' type

const PASSWORD = process.env.NEXT_PUBLIC_ACCESS_PASSWORD || "access123"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // Fix: Explicitly define the state type as Socket | null
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io()
    setSocket(socketInstance)

    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [])

  const handlePasswordSubmit = (password: string) => {
    if (password === PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert("Invalid password. Please try again.")
    }
  }

  if (!isAuthenticated) {
    return <PasswordModal onSubmit={handlePasswordSubmit} />
  }

  // Only render MainApp if socket is initialized to avoid type issues in child components
  // (Optional but recommended safety check)
  if (!socket) return null; 

  return <MainApp socket={socket} />
}
