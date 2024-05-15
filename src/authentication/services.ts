import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "./../config/envConfig";

const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);

  return hashedPassword;
};

const createJWT = (id: number) => {
  //signtoken

  return jwt.sign({ id, exp: Number(JWT_EXPIRES_IN) }, JWT_SECRET as string);
};
export default { hashPassword, createJWT};
