import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma_client";

export async function POST(req) {
  try {
    const body = await req.text();
    if (!body) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }
    const { email, password } = JSON.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
      token: token,
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Login is working!" });
  }
}
