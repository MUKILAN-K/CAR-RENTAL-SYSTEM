import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mukilan@2005',
  database: 'carznow',
});

export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return { data: rows, error: null };
  } catch (error) {
    console.error('Database error:', error);
    return { data: null, error };
  }
};

export const db = {
  // Cars
  async getCars() {
    return executeQuery('SELECT * FROM cars ORDER BY created_at DESC');
  },
  
  async getCar(id: string) {
    return executeQuery('SELECT * FROM cars WHERE id = ?', [id]);
  },

  async createCar(data: any) {
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
    } = data;

    return executeQuery(
      `INSERT INTO cars (
        name, brand, model, description, price_per_day, car_type,
        transmission, fuel_type, seats, mileage, has_ac, image_url, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, brand, model, description, price_per_day, car_type,
        transmission, fuel_type, seats, mileage, has_ac, image_url,
        JSON.stringify(images)
      ]
    );
  },

  async updateCar(id: string, data: any) {
    const updates = Object.entries(data)
      .map(([key]) => `${key} = ?`)
      .join(', ');
    
    return executeQuery(
      `UPDATE cars SET ${updates} WHERE id = ?`,
      [...Object.values(data), id]
    );
  },

  async deleteCar(id: string) {
    return executeQuery('DELETE FROM cars WHERE id = ?', [id]);
  },

  async getTotalCars() {
    const { data } = await executeQuery('SELECT COUNT(*) as count FROM cars');
    return data?.[0]?.count || 0;
  },
  
  // Bookings
  async getBookings() {
    return executeQuery(`
      SELECT b.*, c.name as car_name, c.image_url as car_image,
             p.full_name as user_name, p.email as user_email
      FROM bookings b
      JOIN cars c ON b.car_id = c.id
      JOIN profiles p ON b.user_id = p.id
      ORDER BY b.created_at DESC
    `);
  },
  
  async getUserBookings(userId: string) {
    return executeQuery(
      `SELECT b.*, c.name as car_name, c.image_url as car_image
       FROM bookings b
       JOIN cars c ON b.car_id = c.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
  },

  async getCarBookings(carId: string) {
    return executeQuery(
      'SELECT * FROM bookings WHERE car_id = ? AND status = "confirmed"',
      [carId]
    );
  },
  
  async createBooking(data: any) {
    const { car_id, user_id, start_date, end_date, total_price, status } = data;
    return executeQuery(
      `INSERT INTO bookings (car_id, user_id, start_date, end_date, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [car_id, user_id, start_date, end_date, total_price, status]
    );
  },
  
  async updateBookingStatus(id: string, status: string) {
    return executeQuery(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );
  },

  async getTotalBookings() {
    const { data } = await executeQuery('SELECT COUNT(*) as count FROM bookings');
    return data?.[0]?.count || 0;
  },

  async getTotalRevenue() {
    const { data } = await executeQuery(
      'SELECT SUM(total_price) as total FROM bookings WHERE status = "confirmed"'
    );
    return data?.[0]?.total || 0;
  },

  async getRecentBookings() {
    return executeQuery(`
      SELECT b.*, c.name as car_name, c.image_url as car_image,
             p.full_name as user_name, p.email as user_email
      FROM bookings b
      JOIN cars c ON b.car_id = c.id
      JOIN profiles p ON b.user_id = p.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `);
  },
  
  // Users/Profiles
  async getProfile(id: string) {
    return executeQuery('SELECT * FROM profiles WHERE id = ?', [id]);
  },

  async getProfiles() {
    return executeQuery('SELECT * FROM profiles ORDER BY created_at DESC');
  },
  
  async updateProfile(id: string, data: any) {
    const { full_name } = data;
    return executeQuery(
      'UPDATE profiles SET full_name = ? WHERE id = ?',
      [full_name, id]
    );
  },

  async deleteProfile(id: string) {
    return executeQuery('DELETE FROM profiles WHERE id = ?', [id]);
  },

  async updateProfileRole(id: string, role: string) {
    return executeQuery(
      'UPDATE profiles SET role = ? WHERE id = ?',
      [role, id]
    );
  },

  async getTotalUsers() {
    const { data } = await executeQuery('SELECT COUNT(*) as count FROM profiles');
    return data?.[0]?.count || 0;
  },
  
  // Auth (simplified for local development)
  async login(email: string, password: string) {
    return executeQuery(
      'SELECT * FROM profiles WHERE email = ? LIMIT 1',
      [email]
    );
  },
  
  async signup(data: any) {
    const { id, email, full_name, role = 'user' } = data;
    return executeQuery(
      'INSERT INTO profiles (id, email, full_name, role) VALUES (?, ?, ?, ?)',
      [id, email, full_name, role]
    );
  }
};