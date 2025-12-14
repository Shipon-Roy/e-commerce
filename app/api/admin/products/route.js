import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../lib/models/Product";
import { NextResponse } from "next/server";

// GET all products
export async function GET() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

// POST create product
export async function POST(req) {
  await dbConnect();

  const formData = await req.formData();

  const name = formData.get("name");
  const price = Number(formData.get("price"));
  const offerPrice = formData.get("offerPrice")
    ? Number(formData.get("offerPrice"))
    : undefined;

  const category = formData.get("category");
  const description = formData.get("description");
  const sizes = JSON.parse(formData.get("sizes") || "[]");

  if (!name || !price || !category) {
    return NextResponse.json(
      { error: "Name, Price & Category required" },
      { status: 400 }
    );
  }

  const images = [];
  for (const file of formData.getAll("images")) {
    const buffer = Buffer.from(await file.arrayBuffer());
    images.push({
      data: buffer,
      contentType: file.type,
    });
  }

  const product = await Product.create({
    name,
    price,
    offerPrice,
    category,
    description,
    sizes,
    images,
  });

  return NextResponse.json(product, { status: 201 });
}
