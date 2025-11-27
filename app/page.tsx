"use client"

import { useState, useEffect } from "react"
import PasswordModal from "@/components/password-modal"
import MainApp from "@/components/main-app"
import { io } from "socket.io-client"

const PASSWORD = process.env.NEXT_PUBLIC_ACCESS_PASSWORD || "access123"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [socket, setSocket] = useState(null)

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

  return <MainApp socket={socket} />
}
