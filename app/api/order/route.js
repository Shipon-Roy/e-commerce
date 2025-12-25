import { NextResponse } from "next/server";
import Order from "../../../lib/models/Order";
import dbConnect from "../../../lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // ✅ FIX PHONE FORMAT
    if (body.customer?.phone) {
      body.customer.phone = body.customer.phone
        .toString()
        .trim()
        .replace(/\s|-/g, "");
    }

    const itemsWithSize = body.items.map((item) => ({
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
      },
      size: item.size,
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      customer: body.customer,
      items: itemsWithSize,
      totalPrice: body.totalPrice,
      paymentMethod: body.paymentMethod,
    });

    await newOrder.save();

    return NextResponse.json(
      { message: "Order placed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER SAVE ERROR:", error);

    return NextResponse.json(
      { error: error.message, message: error.message },
      { status: 500 }
    );
  }
}

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
