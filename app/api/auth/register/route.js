import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();
  const { name, email, password, role = "user" } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return NextResponse.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
