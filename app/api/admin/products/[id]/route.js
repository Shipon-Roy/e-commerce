import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();

  const formData = await req.formData();

  const updateData = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    offerPrice: formData.get("offerPrice")
      ? Number(formData.get("offerPrice"))
      : undefined,
    category: formData.get("category"),
    description: formData.get("description"),
    sizes: JSON.parse(formData.get("sizes") || "[]"),
  };

  const imageFiles = formData.getAll("images");
  if (imageFiles.length > 0) {
    updateData.images = await Promise.all(
      imageFiles.map(async (file) => ({
        data: Buffer.from(await file.arrayBuffer()),
        contentType: file.type,
      }))
    );
  }

  const updated = await Product.findByIdAndUpdate(params.id, updateData, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
