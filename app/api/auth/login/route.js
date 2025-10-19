import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return new Response("User not found", { status: 404 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return new Response("Invalid credentials", { status: 401 });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return new Response(JSON.stringify({ token, role: user.role }), {
    status: 200,
  });
}
