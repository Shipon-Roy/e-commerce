import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Order from "../../../../lib/models/Order";
import { verifyToken } from "../../../../lib/auth";

export async function GET(req) {
  // 🔐 Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded || decoded.role !== "moderator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 });

  return NextResponse.json(orders);
}
