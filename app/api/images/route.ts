import { connectDB } from "@/lib/mongodb"
import Image from "@/models/Image"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const images = await Image.find().sort({ uploadedAt: -1 }).lean()
    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    await connectDB()

    const newImage = await Image.create({
      url,
      uploadedAt: new Date(),
    })

    return NextResponse.json(newImage)
  } catch (error) {
    console.error("Error creating image:", error)
    return NextResponse.json({ error: "Failed to create image" }, { status: 500 })
  }
}
