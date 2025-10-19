import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().select("name email role");
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
