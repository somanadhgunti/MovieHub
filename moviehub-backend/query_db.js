const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'somu',
  database: 'moviehub_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');

  // Query show_seats
  connection.query(
    'SELECT ss.id, ss.show_id, ss.seat_id, ss.status, s.seat_row, s.seat_number FROM show_seats ss JOIN seats s ON ss.seat_id = s.id LIMIT 20',
    (error, results) => {
      if (error) throw error;
      console.log('Show Seats:');
      console.log(results);
      connection.end();
    }
  );
});
