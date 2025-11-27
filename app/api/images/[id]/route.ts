import { connectDB } from "@/lib/mongodb"
import Image from "@/models/Image"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params; // Await the params promise
    await connectDB()
    
    const result = await Image.findByIdAndDelete(params.id)

    if (!result) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
