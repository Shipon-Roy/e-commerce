import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

export async function GET() {
  await dbConnect();

  const products = await Product.find({}).lean();
  const uniqueCategories = {};

  products.forEach((p) => {
    if (p.category && !uniqueCategories[p.category]) {
      uniqueCategories[p.category] = {
        name: p.category,
        slug: p.category.toLowerCase().replace(/\s+/g, "-"),
        image: p.image,
      };
    }
  });

  return NextResponse.json(Object.values(uniqueCategories));
}
