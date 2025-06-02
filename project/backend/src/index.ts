import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { RowDataPacket, OkPacket } from 'mysql2';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mukilan@2005',
  database: 'carznow',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

interface CountResult extends RowDataPacket {
  count: number;
}

interface RevenueResult extends RowDataPacket {
  total: number;
}

// Helper function for database queries
const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return { data: rows as RowDataPacket[], error: null };
  } catch (error: any) {
    console.error('Database error:', error);
    return { data: null, error: { message: error.message || 'Database error occurred' } };
  }
};

// Car Management Endpoints
app.get('/api/cars', async (req, res) => {
  const { data, error } = await executeQuery('SELECT * FROM cars ORDER BY created_at DESC');
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

app.get('/api/cars/total', async (req, res) => {
  const { data, error } = await executeQuery('SELECT COUNT(*) as count FROM cars');
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  const result = data?.[0] as CountResult;
  res.json({ total: result?.count || 0 });
});

app.get('/api/cars/:id', async (req, res) => {
  const { data, error } = await executeQuery('SELECT * FROM cars WHERE id = ?', [req.params.id]);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data?.[0] || null);
});

app.post('/api/cars', async (req, res) => {
  const {
    name,
    brand,
    model,
    description,
    price_per_day,
    car_type,
    transmission,
    fuel_type,
    seats,
    mileage,
    has_ac,
    image_url,
    images = []
  } = req.body;

  const id = `car_${Date.now()}`;
  const { error } = await executeQuery(
    `INSERT INTO cars (
      id, name, brand, model, description, price_per_day, car_type,
      transmission, fuel_type, seats, mileage, has_ac, image_url, images, rating, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      id, name, brand, model, description, price_per_day, car_type,
      transmission, fuel_type, seats, mileage, has_ac, image_url,
      JSON.stringify(images), 0
    ]
  );

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ id, ...req.body });
});

app.put('/api/cars/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const keys = Object.keys(updates);
  const values = Object.values(updates);
  
  const query = `UPDATE cars SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;
  
  const { error } = await executeQuery(query, [...values, id]);
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  res.json({ message: 'Car updated successfully' });
});

app.delete('/api/cars/:id', async (req, res) => {
  const { error } = await executeQuery('DELETE FROM cars WHERE id = ?', [req.params.id]);
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  res.json({ message: 'Car deleted successfully' });
});

// Booking Management Endpoints
app.get('/api/bookings', async (req, res) => {
  const { data, error } = await executeQuery(`
    SELECT b.*, c.name as car_name, c.image_url as car_image,
           p.full_name as user_name, p.email as user_email
    FROM bookings b
    JOIN cars c ON b.car_id = c.id
    JOIN profiles p ON b.user_id = p.id
    ORDER BY b.created_at DESC
  `);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

app.get('/api/bookings/user/:userId', async (req, res) => {
  const { data, error } = await executeQuery(
    `SELECT b.*, c.name as car_name, c.image_url as car_image
     FROM bookings b
     JOIN cars c ON b.car_id = c.id
     WHERE b.user_id = ?
     ORDER BY b.created_at DESC`,
    [req.params.userId]
  );
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

app.get('/api/bookings/car/:carId', async (req, res) => {
  const { data, error } = await executeQuery(
    'SELECT * FROM bookings WHERE car_id = ? AND status = "confirmed"',
    [req.params.carId]
  );
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

app.post('/api/bookings', async (req, res) => {
  const { car_id, user_id, start_date, end_date, total_price, status } = req.body;
  const id = `book_${Date.now()}`;
  
  // Format dates to MySQL format (YYYY-MM-DD)
  const formattedStartDate = new Date(start_date).toISOString().split('T')[0];
  const formattedEndDate = new Date(end_date).toISOString().split('T')[0];
  
  // Check if user exists in profiles table
  const { data: userExists, error: userError } = await executeQuery(
    'SELECT id FROM profiles WHERE id = ?',
    [user_id]
  );
  
  if (userError || !userExists?.length) {
    res.status(400).json({ error: 'User profile not found' });
    return;
  }
  
  const { error } = await executeQuery(
    'INSERT INTO bookings (id, car_id, user_id, start_date, end_date, total_price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
    [id, car_id, user_id, formattedStartDate, formattedEndDate, total_price, status]
  );
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  res.json({ id, car_id, user_id, start_date: formattedStartDate, end_date: formattedEndDate, total_price, status });
});

app.put('/api/bookings/:id', async (req, res) => {
  const { status } = req.body;
  const { error } = await executeQuery(
    'UPDATE bookings SET status = ? WHERE id = ?',
    [status, req.params.id]
  );
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  res.json({ message: 'Booking updated successfully' });
});

app.get('/api/bookings/total', async (req, res) => {
  const { data, error } = await executeQuery('SELECT COUNT(*) as count FROM bookings');
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  const result = data?.[0] as CountResult;
  res.json({ total: result?.count || 0 });
});

app.get('/api/bookings/revenue', async (req, res) => {
  const { data, error } = await executeQuery(
    'SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status = "confirmed"'
  );
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  const result = data?.[0] as RevenueResult;
  res.json({ total: result?.total || 0 });
});

app.get('/api/bookings/recent', async (req, res) => {
  const { data, error } = await executeQuery(`
    SELECT b.*, c.name as car_name, c.image_url as car_image,
           p.full_name as user_name, p.email as user_email
    FROM bookings b
    JOIN cars c ON b.car_id = c.id
    JOIN profiles p ON b.user_id = p.id
    ORDER BY b.created_at DESC
    LIMIT 5
  `);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

// Profile Management Endpoints
app.get('/api/profiles', async (req, res) => {
  const { data, error } = await executeQuery('SELECT * FROM profiles ORDER BY created_at DESC');
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

app.get('/api/profiles/:id', async (req, res) => {
  const { data, error } = await executeQuery('SELECT * FROM profiles WHERE id = ?', [req.params.id]);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data?.[0] || null);
});

app.put('/api/profiles/:id', async (req, res) => {
  const { full_name } = req.body;
  const { error } = await executeQuery(
    'UPDATE profiles SET full_name = ? WHERE id = ?',
    [full_name, req.params.id]
  );
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  res.json({ message: 'Profile updated successfully' });
});

app.delete('/api/profiles/:id', async (req, res) => {
  const { error } = await executeQuery('DELETE FROM profiles WHERE id = ?', [req.params.id]);
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  res.json({ message: 'Profile deleted successfully' });
});

app.put('/api/profiles/:id/role', async (req, res) => {
  const { role } = req.body;
  const { error } = await executeQuery(
    'UPDATE profiles SET role = ? WHERE id = ?',
    [role, req.params.id]
  );
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  res.json({ message: 'Profile role updated successfully' });
});

app.get('/api/profiles/total', async (req, res) => {
  const { data, error } = await executeQuery('SELECT COUNT(*) as count FROM profiles');
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  const result = data?.[0] as CountResult;
  res.json({ total: result?.count || 0 });
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  const { data, error } = await executeQuery(
    'SELECT * FROM profiles WHERE email = ? LIMIT 1',
    [email]
  );
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  if (!data || !data.length) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  
  res.json(data[0]);
});

app.post('/api/auth/signup', async (req, res) => {
  const { id, email, full_name, role } = req.body;
  
  // Check if email already exists
  const { data: existingUser } = await executeQuery(
    'SELECT id FROM profiles WHERE email = ?',
    [email]
  );
  
  if (existingUser?.length) {
    res.status(400).json({ error: 'Email already registered' });
    return;
  }
  
  const { error } = await executeQuery(
    'INSERT INTO profiles (id, email, full_name, role, created_at) VALUES (?, ?, ?, ?, NOW())',
    [id, email, full_name, role]
  );
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  res.json({ id, email, full_name, role });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});