"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PasswordModalProps {
  onSubmit: (password: string) => void
}

export default function PasswordModal({ onSubmit }: PasswordModalProps) {
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(password)
    setPassword("")
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Access Required</h2>
        <p className="text-zinc-400 text-center mb-6">Enter the access code to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter access code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Access
          </Button>
        </form>
      </div>
    </div>
  )
}
