import express from "express";
import http from "http";
const app = express();
const port = 3000;

app.get('/weather', (req, res) => {
  const { location } = req.query;
  const api_key = 'c2e5e5bac366fda7739450f75f6c3b09';

  http.get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${location}`, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const result = JSON.parse(data);

      if (result.success === false) {
        res.status(500).json({ error: result.error.info });
      } else {
        res.json(result);
      }
    });
  }).on('error', (error) => {
    res.status(500).json({ error: error.message });
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Se está ejecutando el servidor en el puerto ${port}:`);
});
