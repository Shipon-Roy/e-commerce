"use client";

export default function ProductDescript({ title, description }) {
  const product = {
    title: title,
    description: description,
    ourSupport: [
      "পণ্য বেছে নিন পরে টাকা দিন। পণ্য পছন্দ না হলে ডেলিভারি চার্জ দিয়ে রিটার্ন করে দিন।",
      "১ টাকাও অগ্রিম দিতে হবে না।",
      "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।",
      "পণ্য পছন্দ না হলে ডেলিভারি চার্জ দিয়ে ফেরত দিন।",
      "পণ্য পরিবর্তন ও ফেরত দেওয়ার সুবিধা প্রদান করছি।",
      "নিজস্ব কারখানায় তৈরি।",
      "টেকসই সেলাই অসাধারণ বোটাম কোয়ালিটি।",
      "কালার গ্যারান্টি পাকা রঙ।",
    ],
    sizes: [
      { label: "S", length: 38, chest: 38 },
      { label: "M", length: 40, chest: 40 },
      { label: "L", length: 42, chest: 42 },
      { label: "XL", length: 44, chest: 44 },
      { label: "XXL", length: 46, chest: 46 },
    ],
    details: [
      "Product Type: Panjabi",
      "Type: Semi-Long Panjabi",
      "Production Country: Bangladesh",
      "Fabric: Indian Soft Cotton/Tencel Fabric",
      "Button Type: Metal Button",
      "Style: Casual",
      "Gender: Men",
    ],
    image: "/6f063275-04a8-4612-8754-3b2c4ee3fb76.png",
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <h1 className="text-xl mb-4">{product.description}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            {product.ourSupport.map((line, index) => (
              <p key={index} className="flex items-start gap-2 text-gray-50">
                <span className="text-green-500">✔</span> {line}
              </p>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mt-4 mb-2">Size Chart</h2>
            <ul className="space-y-1">
              {product.sizes.map((size) => (
                <li key={size.label}>
                  <span className="font-medium">{size.label}:</span> Length{" "}
                  {size.length}", Chest {size.chest}"
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mt-4 mb-2">Product Details</h2>
            <ul className="space-y-1">
              {product.details.map((detail, index) => (
                <li key={index}>• {detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
