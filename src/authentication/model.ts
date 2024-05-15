import { UserForm } from "./type";
import pool from "../db/db";
import authServices from "./services";

const createUser = async (user: UserForm) => {
  const client = await pool.connect();

  const query =
    "INSERT INTO users (email, password, last_name, first_name, date_of_birth, address, role, is_verified, is_flagged, is_deleted, is_suspended, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, false, false, false, false, NOW(), NOW()) RETURNING id, email, last_name, first_name, date_of_birth;";
  const values = [
    user.email.toLowerCase().trim(),
    await authServices.hashPassword(user.password.trim()),
    user.last_name.trim(),
    user.first_name.trim(),
    user.date_of_birth.trim(),
    user.address,
    "user",
  ];

  const res = await client.query(query, values).catch((err) => {
    throw err;
  });

  client.release();
  return res.rows[0];
};

const getUserByEmail = async (email: string): Promise<any[]> => {
  const query =
    "SELECT id, email, password, last_name, first_name, date_of_birth, role, is_flagged, is_deleted, is_suspended FROM users WHERE email = $1";
  const values = [email.toLowerCase()];

  const client = await pool.connect();

  const res = await client.query(query, values).catch((err) => {
    throw err;
  });
  client.release();
  return res.rows;
};

export default { createUser, getUserByEmail };
