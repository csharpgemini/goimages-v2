import { Server } from "socket.io"

let io: Server

export function getIO() {
  return io
}

export function initializeSocket(httpServer: any) {
  if (io) return io

  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("imageUploaded", (data) => {
      socket.broadcast.emit("imageUploaded", data)
    })

    socket.on("imageDeleted", (imageId) => {
      socket.broadcast.emit("imageDeleted", imageId)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })

  return io
}
