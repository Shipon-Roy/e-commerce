import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

export const dynamic = "force-dynamic";

function bufferToBase64(buffer) {
  if (!buffer) return "";
  try {
    return Buffer.from(buffer).toString("base64");
  } catch (err) {
    console.error("⚠️ bufferToBase64 error:", err);
    return "";
  }
}

export async function GET() {
  await dbConnect();

  // ❌ No .lean() — keeps Buffer data
  const products = await Product.find({}, { category: 1, images: 1 });

  const categoryMap = new Map();

  for (const product of products) {
    const category = product.category?.trim();
    if (!category) continue;

    // Add category only once
    if (!categoryMap.has(category)) {
      const slug = category.toLowerCase().replace(/\s+/g, "-");

      const firstImage = product.images?.[0];
      let image = null;

      if (firstImage?.data) {
        image = {
          contentType: firstImage.contentType || "image/jpeg",
          data: bufferToBase64(firstImage.data),
        };
      }

      categoryMap.set(category, {
        name: category,
        slug,
        image,
      });
    }
  }

  const categories = Array.from(categoryMap.values());

  return Response.json(categories);
}
