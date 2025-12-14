import { NextResponse } from "next/server";
import Order from "../../../lib/models/Order";
import dbConnect from "../../../lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const newOrder = new Order({
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        address: body.customer.address || "N/A", // fallback
      },
      items: body.items,
      totalPrice: body.totalPrice,
      paymentMethod: body.paymentMethod,
    });

    await newOrder.save();
    return NextResponse.json(
      { message: "Order placed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order POST Error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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
