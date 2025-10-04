const { getPool } = require('../config/db');

class Expense {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.icon = data.icon;
        this.category = data.category;
        this.amount = parseFloat(data.amount);
        this.date = data.date;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Create new expense
    static async create(expenseData) {
        const { user_id, icon, category, amount, date } = expenseData;
        
        const pool = getPool();
        const query = `
            INSERT INTO expenses (user_id, icon, category, amount, date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const values = [user_id, icon, category, amount, date || new Date()];
        const result = await pool.query(query, values);
        
        return new Expense(result.rows[0]);
    }

    // Find expenses by user ID
    static async findByUserId(userId, options = {}) {
        const { limit, offset, startDate, endDate, category } = options;
        
        let query = 'SELECT * FROM expenses WHERE user_id = $1';
        let values = [userId];
        let paramCount = 1;

        // Add date filters
        if (startDate) {
            paramCount++;
            query += ` AND date >= $${paramCount}`;
            values.push(startDate);
        }

        if (endDate) {
            paramCount++;
            query += ` AND date <= $${paramCount}`;
            values.push(endDate);
        }

        // Add category filter
        if (category) {
            paramCount++;
            query += ` AND category = $${paramCount}`;
            values.push(category);
        }

        query += ' ORDER BY date DESC, created_at DESC';

        // Add pagination
        if (limit) {
            paramCount++;
            query += ` LIMIT $${paramCount}`;
            values.push(limit);
        }

        if (offset) {
            paramCount++;
            query += ` OFFSET $${paramCount}`;
            values.push(offset);
        }

        const pool = getPool();
        const result = await pool.query(query, values);
        
        return result.rows.map(row => new Expense(row));
    }

    // Find expense by ID
    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM expenses WHERE id = $1';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return new Expense(result.rows[0]);
    }

    // Update expense
    async update(updateData) {
        const { icon, category, amount, date } = updateData;
        const pool = getPool();
        
        const query = `
            UPDATE expenses 
            SET icon = $1, category = $2, amount = $3, date = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `;
        
        const values = [icon, category, amount, date, this.id];
        const result = await pool.query(query, values);
        
        return new Expense(result.rows[0]);
    }

    // Delete expense
    async delete() {
        const pool = getPool();
        const query = 'DELETE FROM expenses WHERE id = $1';
        await pool.query(query, [this.id]);
    }

    // Get total expenses for user
    static async getTotalByUserId(userId, options = {}) {
        const { startDate, endDate, category } = options;
        
        let query = 'SELECT SUM(amount) as total FROM expenses WHERE user_id = $1';
        let values = [userId];
        let paramCount = 1;

        if (startDate) {
            paramCount++;
            query += ` AND date >= $${paramCount}`;
            values.push(startDate);
        }

        if (endDate) {
            paramCount++;
            query += ` AND date <= $${paramCount}`;
            values.push(endDate);
        }

        if (category) {
            paramCount++;
            query += ` AND category = $${paramCount}`;
            values.push(category);
        }

        const pool = getPool();
        const result = await pool.query(query, values);
        
        return parseFloat(result.rows[0].total) || 0;
    }

    // Get expenses grouped by category
    static async getByCategory(userId, options = {}) {
        const { startDate, endDate } = options;
        
        let query = `
            SELECT category, SUM(amount) as total, COUNT(*) as count
            FROM expenses 
            WHERE user_id = $1
        `;
        let values = [userId];
        let paramCount = 1;

        if (startDate) {
            paramCount++;
            query += ` AND date >= $${paramCount}`;
            values.push(startDate);
        }

        if (endDate) {
            paramCount++;
            query += ` AND date <= $${paramCount}`;
            values.push(endDate);
        }

        query += ' GROUP BY category ORDER BY total DESC';

        const pool = getPool();
        const result = await pool.query(query, values);
        
        return result.rows.map(row => ({
            category: row.category,
            total: parseFloat(row.total),
            count: parseInt(row.count)
        }));
    }
}

module.exports = Expense;