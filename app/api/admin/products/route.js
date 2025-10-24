import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

// GET all products
export async function GET() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return new Response(JSON.stringify(products), { status: 200 });
}

// POST new product with multiple images
export async function POST(req) {
  await dbConnect();

  const formData = await req.formData();
  const name = formData.get("name");
  const price = Number(formData.get("price"));
  const category = formData.get("category");
  const description = formData.get("description");

  if (!name || !price || !category) {
    return new Response(
      JSON.stringify({ error: "Name, Price & Category required" }),
      { status: 400 }
    );
  }

  const images = [];
  for (const file of formData.getAll("images")) {
    const arrayBuffer = await file.arrayBuffer();
    images.push({
      data: Buffer.from(arrayBuffer),
      contentType: file.type,
    });
  }

  const product = await Product.create({
    name,
    price,
    category,
    description,
    images,
  });

  return new Response(JSON.stringify(product), { status: 201 });
}
