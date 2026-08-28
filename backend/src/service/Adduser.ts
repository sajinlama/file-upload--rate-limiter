import pool from "../config/db.js";

interface username {
  fullname: string;
}

export const newUSer = async (userfullName: username) => {
  const { fullname } = userfullName;

const result = await pool.query(
  `INSERT INTO users (full_name) VALUES ($1) RETURNING user_id, full_name`,
  [fullname]
);
return result.rows[0];
};
