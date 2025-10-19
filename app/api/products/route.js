import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const price = searchParams.get("price");
  const inStock = searchParams.get("inStock");

  let filter = {};

  // Case-insensitive category filter
  if (category) {
    filter.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  if (inStock) {
    filter.inStock = inStock === "true";
  }

  if (price) {
    if (price.includes("-")) {
      const [min, max] = price.split("-").map(Number);
      filter.price = { $gte: min, $lte: max };
    } else if (price.includes("+")) {
      const min = Number(price.replace("+", ""));
      filter.price = { $gte: min };
    }
  }

  const products = await Product.find(filter).sort({ createdAt: -1 }).limit(20);

  return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  if (!body.name || !body.price || !body.category) {
    return new Response(
      JSON.stringify({ error: "Name, Price & Category required" }),
      { status: 400 }
    );
  }

  const product = await Product.create({
    name: body.name,
    price: Number(body.price),
    category: body.category,
    description: body.description || "",
    image: body.image || "",
  });

  console.log("Saved Product:", product);

  return new Response(JSON.stringify(product), { status: 201 });
}
