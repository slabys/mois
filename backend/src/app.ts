import express from 'express';
const app = express();
const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', (req, res) => {
  console.log('Received request at /api');
  res.send('Hello from the Backend API!');
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
