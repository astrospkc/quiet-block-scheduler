import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabaseClient";
import prisma from "../../../../lib/prisma_client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";
export async function POST(req) {
  try {
    console.log("signup");
    // Check if request has a body
    const body = await req.text();
    console.log(body);

    if (!body) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    // Parse the JSON
    const { email, name, password } = JSON.parse(body);

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields: email, name, password" },
        { status: 400 }
      );
    }

    //email validator
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    //validate password, mininum 6 character
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    //   check if user already exist
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
      },
    });
    const secret = process.env.JWT_SECRET || "your-secret-key";
    console.log(secret);
    //   create jwt token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );
    //user without password
    const { password: _, ...userWithoutPassword } = user;

    // console.log("resdata: ", user);
    const response = NextResponse.json({
      message: "Sign up is working!",
      data: userWithoutPassword,
    });

    //set http-only cookies
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("JSON parsing error:", error);
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}
