const http = require('http');

const data = JSON.stringify({
  name: 'Test',
  email: 'test@gmail.com',
  password: 'testdemo'
});

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
