const express = require("express"); // Imports Express, which helps us create an HTTP server

function startServer(port, origin) {
  const app = express(); // Creates the Express application

  app.get("/", (req, res) => {
    res.json({
      message: "Caching proxy server is running",
      origin,
    }); // Sends a temporary JSON response so we can confirm the server works
  });

  app.listen(port, () => {
    console.log(`Caching proxy server running on http://localhost:${port}`); // Runs after the server starts successfully
    console.log(`Origin server: ${origin}`);
  });
}

module.exports = {
  startServer,
}; // Allows cli.js to use the startServer function