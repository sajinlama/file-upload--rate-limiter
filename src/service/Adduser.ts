import pool from "../config/db.js";

interface username {
    fullname : string
}

export const newUSer = async (userfullName : username)=>{
    const {fullname} = userfullName;
    await pool.query(`INSERT INTO users VALUES ($1)`,[fullname])
}