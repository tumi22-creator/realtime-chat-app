import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Message from "@/models/Message";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { sender, receiver, text, image } = body;

    const message = await Message.create({
      sender,
      receiver,
      text,
      image,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender")
      .populate("receiver");

    return NextResponse.json(populatedMessage);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Failed to send message",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const sender = searchParams.get("sender");

    const receiver = searchParams.get("receiver");

    const messages = await Message.find({
      $or: [
        {
          sender,
          receiver,
        },
        {
          sender: receiver,
          receiver: sender,
        },
      ],
    })
      .populate("sender")
      .populate("receiver")
      .sort({
        createdAt: 1,
      });

    return NextResponse.json(messages);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Failed to fetch messages",
      },
      {
        status: 500,
      }
    );
  }
}