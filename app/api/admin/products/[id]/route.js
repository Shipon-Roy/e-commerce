import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const data = await req.json();

  const updated = await Product.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
