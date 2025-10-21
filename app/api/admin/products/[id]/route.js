import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context.params; // ✅ await params
  const data = await req.json();

  const updated = await Product.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context.params; // ✅ await params
  await Product.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
