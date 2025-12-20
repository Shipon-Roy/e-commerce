import dbConnect from "../../../../../../lib/dbConnect";
import User from "../../../../../../lib/models/User";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { role } = await req.json();
    const { id } = params;
    if (!["user", "moderator", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Role update failed" }, { status: 500 });
  }
}
