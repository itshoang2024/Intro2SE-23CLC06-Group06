const express = require('express');
const app = express();
const router = require('./routes/index.route');

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({
    status: 'failed',
    message: 'Đã xảy ra lỗi!',
  });
});

app.get('/', (req, res) => {
  res.send('<h1 style="text-align:center">Welcome to Vocaboost\'s API 😁<h1>');
});

app.use('/api', router);

module.exports = app;
