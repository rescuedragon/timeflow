const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'timesheet_app',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function createUser() {
  try {
    const username = 'admin';
    const password = 'password';
    const email = 'admin@timesheet.com';
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insert user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, passwordHash, 'Admin', 'User']
    );
    
    console.log('User created successfully:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createUser();