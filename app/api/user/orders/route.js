import dbConnect from "../../../../lib/dbConnect";
import Order from "../../../../lib/models/Order";
import { verifyToken } from "../../../../lib/auth";

export async function GET(req) {
  await dbConnect();
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return new Response("Unauthorized", { status: 401 });

  const decoded = verifyToken(token);
  const orders = await Order.find({ user: decoded.id }).populate(
    "items.product"
  );
  return new Response(JSON.stringify(orders), { status: 200 });
}
