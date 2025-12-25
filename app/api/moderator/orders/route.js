import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Order from "../../../../lib/models/Order";
import { verifyToken } from "../../../../lib/auth";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const updatedOrder = await req.json(); // expects full order object

    const order = await Order.findByIdAndUpdate(id, updatedOrder, {
      new: true,
    });

    if (!order) return new Response("Order not found", { status: 404 });

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req) {
  try {
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

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Order GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
