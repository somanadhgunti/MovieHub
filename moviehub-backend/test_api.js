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

function getAllShows(token) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/shows',
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
    const shows = await getAllShows(token);
    console.log('All Shows:', JSON.stringify(shows, null, 2));
  } catch (err) {
    console.error('Error running check:', err);
  }
}

run();
