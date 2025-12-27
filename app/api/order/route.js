import { NextResponse } from "next/server";
import Order from "../../../lib/models/Order";
import dbConnect from "../../../lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    console.log("📦 RAW ORDER DATA:", body);

    // Fix phone format
    if (body.customer?.phone) {
      body.customer.phone = body.customer.phone
        .toString()
        .trim()
        .replace(/\s|-/g, "");
    }

    // ✅ FORCE SAVE ALL FIELDS
    const newOrder = new Order({
      customer: {
        ...body.customer,
        extra: body.customer?.extra || "",
      },
      items: body.items.map((item) => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: Number(item.product.price),
        },
        size: item.size || null,
        quantity: Number(item.quantity),
      })),
      subtotal: Number(body.subtotal || 0),
      shippingCost: Number(body.shippingCost || 0),
      totalPrice: Number(body.totalPrice || 0),
      paymentMethod: body.paymentMethod || "COD",
      status: "Pending",
      isPaid: false,
    });

    await newOrder.save();

    console.log("✅ SAVED ORDER:", {
      _id: newOrder._id,
      subtotal: newOrder.subtotal,
      shippingCost: newOrder.shippingCost,
      totalPrice: newOrder.totalPrice,
    });

    return NextResponse.json(
      { message: "Order placed successfully", orderId: newOrder._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ ORDER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
