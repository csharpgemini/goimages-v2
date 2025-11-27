import type { NextRequest } from "next/server"

export function GET(request: NextRequest) {
  if (request.method === "GET") {
    return new Response("Socket.IO endpoint", { status: 200 })
  }

  return new Response("Method not allowed", { status: 405 })
}
