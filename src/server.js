const express = require("express"); // Imports Express to create the HTTP server
const axios = require("axios"); // Imports Axios to forward requests to the origin server
const {
  getCacheKey,
  getFromCache,
  saveToCache,
} = require("./cache"); // Imports cache helper functions

function startServer(port, origin) {
  const app = express(); // Creates the Express app

  app.use(async (req, res) => {
    const cacheKey = getCacheKey(req); // Creates a unique key for the current request
    const cachedResponse = getFromCache(cacheKey); // Checks whether this request already has a cached response

    if (cachedResponse) {
      res.set("X-Cache", "HIT"); // Tells the client this response came from cache
      return res
        .status(cachedResponse.status)
        .send(cachedResponse.data); // Sends the saved response without calling the origin server
    }

    const targetUrl = `${origin}${req.originalUrl}`; // Builds the full URL to request from the origin server

    try {
      const response = await axios.get(targetUrl); // Forwards the request to the origin server

      const responseToCache = {
        status: response.status,
        data: response.data,
      }; // Stores only the important response parts for now

      saveToCache(cacheKey, responseToCache); // Saves the origin response for future matching requests

      res.set("X-Cache", "MISS"); // Tells the client this response came from the origin server
      res.status(response.status).send(response.data); // Sends the origin response back to the client
    } catch (error) {
      const statusCode = error.response?.status || 500; // Uses origin error status if available
      const message = error.response?.data || error.message; // Uses origin error body if available

      res.status(statusCode).send(message); // Sends the error response back to the client
    }
  });

  app.listen(port, () => {
    console.log(`Caching proxy server running on http://localhost:${port}`); // Confirms the server started
    console.log(`Origin server: ${origin}`); // Shows the origin server being proxied
  });
}

module.exports = {
  startServer,
}; // Exports startServer so cli.js can use it