const mysql2 = require('mysql2/promise');

const db = mysql2.createPool({

  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_ROOT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
  
});

async function testConnection() {
  try {
    const [rows, fields] = await db.query('SELECT 6 + 1 AS result');
    console.log('Sevenn needs me:', rows);
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
}

// Run the test
testConnection();

module.exports = db;