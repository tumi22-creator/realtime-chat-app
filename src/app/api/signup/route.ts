import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    console.log("SIGNUP REQUEST RECEIVED");

    const body = await req.json();

    const {
      username,
      email,
      password,
    } = body;

    console.log({
      username,
      email,
    });

    if (
      !username ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    console.log("DATABASE CONNECTED");

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        username,
        email,
        password:
          hashedPassword,
      });

    console.log(
      "USER CREATED:",
      user.email
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "User created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "SIGNUP ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}