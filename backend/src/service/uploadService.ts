import pool from "../config/db.js";


interface ImageUrlPayload {
    imageUrl: string;
    userId: number;
}

const addUrl = async (image: ImageUrlPayload) => {
    try {
        const { imageUrl, userId } = image;

        const query = `
            INSERT INTO image_url (url, user_id) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        
        const result = await pool.query(query, [imageUrl, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting image URL:", error);
        throw error;
    }
};

export default addUrl;