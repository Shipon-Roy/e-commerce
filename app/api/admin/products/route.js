import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../lib/models/Product";

// GET all products
export async function GET() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return new Response(JSON.stringify(products), { status: 200 });
}

// POST new product
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  if (!body.name || !body.price || !body.category) {
    return new Response(
      JSON.stringify({ error: "Name, Price & Category required" }),
      { status: 400 }
    );
  }

  body.price = Number(body.price); // ensure number
  const product = await Product.create(body);
  return new Response(JSON.stringify(product), { status: 201 });
}
