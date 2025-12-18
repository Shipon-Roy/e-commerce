import dbConnect from "../../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import Product from "../../../../../lib/models/Product";

export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params; // ✅ no await

  let updateData = {};

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = await req.json();
    updateData = { ...json };
  } else if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    updateData = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      offerPrice: formData.get("offerPrice")
        ? Number(formData.get("offerPrice"))
        : undefined,
      category: formData.get("category"),
      description: formData.get("description"),
      sizes: JSON.parse(formData.get("sizes") || "[]"),
      inStock: formData.get("inStock") === "true",
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
  } else {
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 400 }
    );
  }

  const updated = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
