import dbConnect from "../../../../lib/dbConnect";
import Order from "../../../../lib/models/Order";

export async function PUT(req, { params }) {
  await dbConnect();
  const { status } = await req.json();

  const updated = await Order.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  );

  return new Response(JSON.stringify(updated), { status: 200 });
}
