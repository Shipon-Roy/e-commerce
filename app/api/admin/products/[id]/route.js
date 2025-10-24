import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

// PUT: update product
export async function PUT(req, context) {
  await dbConnect();
  const { id } = context.params;
  const data = await req.json();
  const updated = await Product.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

// DELETE: remove product
export async function DELETE(req, context) {
  await dbConnect();
  const { id } = context.params;
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
