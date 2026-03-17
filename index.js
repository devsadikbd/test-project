require('dotenv').config({ override: true });
const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL Client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function start() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
    
    app.get('/', async (req, res) => {
      try {
        const result = await client.query('SELECT NOW()');
        res.send(`Database Connected! Server Time: ${result.rows[0].now}`);
      } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
      }
    });

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
}

start();
