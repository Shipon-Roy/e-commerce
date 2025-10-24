import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import ProductPageClient from "./ProductPageClient";

export const dynamic = "force-dynamic";

// ✅ Properly handle MongoDB Binary field (Buffer)
function serializeImages(images) {
  if (!images || images.length === 0) return [];

  return images.map((img) => {
    let base64Data = "";

    try {
      if (img?.data?.$binary?.base64) {
        // BSON Binary
        base64Data = img.data.$binary.base64;
      } else if (
        img?.data?.type === "Buffer" &&
        Array.isArray(img?.data?.data)
      ) {
        // Mongoose Buffer (after lean)
        base64Data = Buffer.from(img.data.data).toString("base64");
      } else if (Buffer.isBuffer(img?.data)) {
        // Direct Buffer (no lean)
        base64Data = img.data.toString("base64");
      } else if (Array.isArray(img?.data)) {
        // Raw byte array
        base64Data = Buffer.from(img.data).toString("base64");
      } else if (typeof img?.data === "string") {
        // Already base64
        base64Data = img.data;
      }
    } catch (err) {
      console.error("❌ serializeImages error:", err, img);
    }

    return {
      contentType: img.contentType || "image/jpeg",
      data: base64Data || "",
    };
  });
}

export default async function ProductPage({ params }) {
  const { id } = await params; // ✅ Next.js 15 syntax
  await dbConnect();

  // ✅ Fetch product (without .lean() so Buffer stays intact)
  const productData = await Product.findById(id);
  if (!productData) {
    return (
      <div className="text-center text-white py-20 text-xl">
        ❌ Product not found
      </div>
    );
  }

  // ✅ Convert properly for client
  const product = {
    ...productData.toObject(),
    _id: productData._id.toString(),
    images: serializeImages(productData.images),
  };

  // ✅ Fetch related products
  const relatedProductsData = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);

  const relatedProducts = relatedProductsData.map((p) => ({
    ...p.toObject(),
    _id: p._id.toString(),
    images: serializeImages(p.images),
  }));

  return (
    <ProductPageClient product={product} relatedProducts={relatedProducts} />
  );
}
