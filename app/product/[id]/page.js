export const dynamic = "force-dynamic";

import Container from "@/components/Container";
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../lib/models/Product";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({ params }) {
  const { id } = await params;

  await dbConnect();

  // Fetch main product
  let product = await Product.findById(id).lean();
  if (!product) return <div>Product not found</div>;

  product = { ...product, _id: product._id.toString() };

  // Fetch related products (same category, exclude current product)
  const relatedProductsData = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .limit(4)
    .lean();

  const relatedProducts = relatedProductsData.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

  return (
    <div>
      <Container>
        <div className="mx-auto bg-gray-800 rounded shadow my-10 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img
                src={product.image || "/no-image.png"}
                alt={product.name}
                className="w-full h-80 md:h-auto object-cover rounded mb-4"
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-200 mb-4">{product.description}</p>
              <p className="text-xl font-semibold mb-4">${product.price}</p>
              {product.inStock ? (
                <AddToCartButton product={product} />
              ) : (
                <button
                  disabled
                  className="bg-gray-500 text-white px-4 py-2 rounded opacity-70 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4 text-white">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <div
                    key={p._id}
                    className="bg-gray-700 p-4 rounded text-white"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-600 rounded mb-2 flex items-center justify-center">
                        No Image
                      </div>
                    )}
                    <h3 className="font-semibold">{p.name}</h3>
                    <p>${p.price}</p>
                    {p.inStock ? (
                      <AddToCartButton product={p} />
                    ) : (
                      <button
                        disabled
                        className="bg-gray-500 text-white px-4 py-1 rounded opacity-70 cursor-not-allowed mt-2 w-full"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
