import { NextResponse } from "next/server";
import Order from "../../../lib/models/Order";
import dbConnect from "../../../lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Build items array with sizes
    const itemsWithSize = body.items.map((item) => ({
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
      },
      size: item.product.size || item.product.selectedSize,
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      customer: body.customer, // name, phone, address
      items: itemsWithSize, // items with size
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
      {
        error: error.message,
        details: error.errors || null,
      },
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
