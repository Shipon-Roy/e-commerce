import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../lib/models/Product";
import Order from "../../../../lib/models/Order";
import User from "../../../../lib/models/User";

export async function GET() {
  try {
    await dbConnect();

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(); // populate na korle

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
