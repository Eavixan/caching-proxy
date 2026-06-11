const express = require("express"); // Imports Express to create the HTTP server
const axios = require("axios"); // Imports Axios to forward requests to the origin server
const {
  getCacheKey,
  getFromCache,
  saveToCache,
} = require("./cache"); // Imports cache helper functions

function startServer(port, origin) {
  const app = express(); // Creates the Express app

  app.use(express.json()); // Allows Express to read JSON request bodies for POST/PUT/PATCH requests

  app.use(async (req, res) => {
    const targetUrl = `${origin}${req.originalUrl}`; // Builds the full origin URL including path and query string
    const isGetRequest = req.method === "GET"; // Only GET requests should be cached

    if (isGetRequest) {
      const cacheKey = getCacheKey(req); // Creates a unique cache key for this request
      const cachedResponse = getFromCache(cacheKey); // Checks whether this request already exists in cache

      if (cachedResponse) {
        res.set("X-Cache", "HIT"); // Tells the client the response came from cache
        return res.status(cachedResponse.status).send(cachedResponse.data); // Sends cached response and stops here
      }
    }

    try {
      const response = await axios({
        method: req.method, // Uses the same HTTP method as the incoming request
        url: targetUrl, // Sends the request to the origin server
        data: req.body, // Forwards the request body for POST/PUT/PATCH requests
        validateStatus: () => true, // Prevents Axios from throwing errors for 4xx/5xx responses
      });

      if (isGetRequest) {
        const cacheKey = getCacheKey(req); // Reuses the same request key for saving cache

        saveToCache(cacheKey, {
          status: response.status,
          data: response.data,
        }); // Saves the origin response for future repeated GET requests

        res.set("X-Cache", "MISS"); // Tells the client this GET response came from the origin
      } else {
        res.set("X-Cache", "BYPASS"); // Tells the client this request was not cached
      }

      res.status(response.status).send(response.data); // Sends the origin response back to the client
    } catch (error) {
      res.status(500).send({
        error: "Failed to connect to origin server",
        details: error.message,
      }); // Handles network-level errors such as origin server being unreachable
    }
  });

  app.listen(port, () => {
    console.log(`Caching proxy server running on http://localhost:${port}`); // Confirms the proxy server started
    console.log(`Origin server: ${origin}`); // Shows which origin server is being proxied
  });
}

module.exports = {
  startServer,
}; // Exports startServer so cli.js can use it