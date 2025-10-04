const { getPool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.profile_photo = data.profile_photo;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Create new user
    static async create(userData) {
        const { name, email, password, profile_photo = null } = userData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const pool = getPool();
        const query = `
            INSERT INTO users (name, email, password, profile_photo)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const values = [name, email, hashedPassword, profile_photo];
        const result = await pool.query(query, values);
        
        return new User(result.rows[0]);
    }

    // Find user by email
    static async findByEmail(email) {
        const pool = getPool();
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return new User(result.rows[0]);
    }

    // Find user by ID
    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return new User(result.rows[0]);
    }

    // Update user
    async update(updateData) {
        const { name, email, profile_photo } = updateData;
        const pool = getPool();
        
        const query = `
            UPDATE users 
            SET name = $1, email = $2, profile_photo = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `;
        
        const values = [name, email, profile_photo, this.id];
        const result = await pool.query(query, values);
        
        return new User(result.rows[0]);
    }

    // Compare password
    async comparePassword(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    }

    // Delete user
    async delete() {
        const pool = getPool();
        const query = 'DELETE FROM users WHERE id = $1';
        await pool.query(query, [this.id]);
    }

    // Get user without password
    toJSON() {
        const { password, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }
}

module.exports = User;