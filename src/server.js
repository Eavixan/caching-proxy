const express = require("express"); // Imports Express to create the HTTP server
const axios = require("axios"); // Imports Axios to forward requests to the origin server

function startServer(port, origin) {
  const app = express(); // Creates the Express app

  app.use(async (req, res) => {
    const targetUrl = `${origin}${req.originalUrl}`; // Builds the full origin URL, including path and query string

    try {
      const response = await axios.get(targetUrl); // Sends the request to the real origin server

      res.set("X-Cache", "MISS"); // For now, every response is from the origin, so it is a cache miss
      res.status(response.status).send(response.data); // Sends the origin response back to the client
    } catch (error) {
      const statusCode = error.response?.status || 500; // Uses origin error status if available, otherwise 500
      const message = error.response?.data || error.message; // Uses origin error body if available, otherwise Axios error message

      res.status(statusCode).send(message); // Sends the error response back to the client
    }
  });

  app.listen(port, () => {
    console.log(`Caching proxy server running on http://localhost:${port}`); // Confirms the proxy server started
    console.log(`Origin server: ${origin}`); // Shows which origin server is being proxied
  });
}

module.exports = {
  startServer,
}; // Exports startServer so cli.js can call it