import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { role } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("name email role");

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
