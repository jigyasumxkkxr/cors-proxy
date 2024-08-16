const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

app.get('/proxy', async (req, res) => {
  try {
    // Extract the target URL from query parameters
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }

    // Log the incoming request
    console.log('Forwarding request to:', url);

    // Fetch data from the target URL
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json' // Ensure the request expects JSON
      }
    });

    // Log the response details
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);

    // Forward the JSON response to the client
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: 'Expected JSON response, but received something else.' });
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(port, () => {
  console.log(`CORS Proxy server listening at http://localhost:${port}`);
});
