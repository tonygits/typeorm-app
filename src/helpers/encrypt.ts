import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { payload } from "../entity/createuser.dto";

const { JWT_SECRET = "" } = process.env;

export class encrypt {
  static async encryptpass(password: string) {
    const hash = bcrypt.hashSync(password, 12);
    return hash;
  }

  static generateToken(payload: payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1y" });
  }
}
