function validatePort(port) {
  const parsedPort = Number(port); // Converts the CLI string value into a JavaScript number

  if (!Number.isInteger(parsedPort)) {
    throw new Error("Port must be a whole number"); // Stops execution when the value is not an integer
  }

  if (parsedPort < 1 || parsedPort > 65535) {
    throw new Error("Port must be between 1 and 65535"); // Network ports must stay within the valid port range
  }

  return parsedPort; // Returns the validated number for use by the server
}

function validateOrigin(origin) {
  let parsedUrl;

  try {
    parsedUrl = new URL(origin); // Attempts to convert the supplied text into a URL object
  } catch {
    throw new Error("Origin must be a valid URL"); // Handles malformed values such as "dummyjson"
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Origin must use HTTP or HTTPS"); // Prevents unsupported protocols such as ftp:
  }

  return parsedUrl.origin; // Returns a normalized origin without unnecessary trailing paths
}

module.exports = {
  validatePort,
  validateOrigin,
}; // Makes both functions available to other files