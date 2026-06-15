const http = require('http');

const loginData = JSON.stringify({
  username: 'profiletester_new',
  password: 'password123'
});

function login() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve(data.token);
        } catch (e) {
          reject(body);
        }
      });
    });
    req.on('error', reject);
    req.write(loginData);
    req.end();
  });
}

function createShow(token) {
  const showData = JSON.stringify({
    movieId: 2,
    screenId: 1,
    showDate: '2026-06-15',
    startTime: '15:00:00',
    endTime: '18:00:00',
    basePrice: 250,
    status: 'SCHEDULED'
  });

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/shows',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': showData.length
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(body);
        }
      });
    });
    req.on('error', reject);
    req.write(showData);
    req.end();
  });
}

function generateShowSeats(showId, token) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/show-seats/generate/${showId}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve(body);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function getShowSeats(showId, token) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/show-seats/${showId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(body);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  try {
    const token = await login();
    console.log('Logged in.');

    const newShow = await createShow(token);
    console.log('Created Show:', newShow);

    const showId = newShow.id;
    console.log(`Generating seats for Show ${showId}...`);
    const genResult = await generateShowSeats(showId, token);
    console.log('Generation result:', genResult);

    const seats = await getShowSeats(showId, token);
    console.log(`Show ${showId} Seats (first 3):`, JSON.stringify(seats.slice(0, 3), null, 2));
  } catch (err) {
    console.error('Error running:', err);
  }
}

run();
