import jwt from "jsonwebtoken";

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    return decoded;
  } catch (err) {
    return null;
  }
}
