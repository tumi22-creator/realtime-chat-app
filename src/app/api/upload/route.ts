import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { image } = body;

    const uploadedImage = await cloudinary.uploader.upload(
      image,
      {
        folder: "chat-app",
      }
    );

    return NextResponse.json({
      url: uploadedImage.secure_url,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}