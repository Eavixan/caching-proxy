const fs = require("fs"); // Imports Node's file system module so we can read/write cache files
const path = require("path"); // Imports path helper so file paths work safely across operating systems

const CACHE_DIR = path.join(__dirname, "..", ".cache"); // Creates path to the hidden cache folder
const CACHE_FILE = path.join(CACHE_DIR, "cache.json"); // Creates path to the cache JSON file

function ensureCacheFileExists() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR); // Creates the .cache folder if it does not exist
  }

  if (!fs.existsSync(CACHE_FILE)) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({})); // Creates an empty cache file if it does not exist
  }
}

function readCache() {
  ensureCacheFileExists(); // Makes sure the cache file is available before reading

  const cacheData = fs.readFileSync(CACHE_FILE, "utf-8"); // Reads the cache file as text

  return JSON.parse(cacheData); // Converts JSON text into a JavaScript object
}

function writeCache(cache) {
  ensureCacheFileExists(); // Makes sure the cache file is available before writing

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2)); // Saves the cache object as formatted JSON
}

function getCacheKey(req) {
  return `${req.method}:${req.originalUrl}`; // Creates a unique key using HTTP method and full URL
}

function getFromCache(key) {
  const cache = readCache(); // Loads the current cache from file

  return cache[key]; // Returns cached response if the key exists
}

function saveToCache(key, value) {
  const cache = readCache(); // Loads the existing cache

  cache[key] = value; // Adds or updates one cached response

  writeCache(cache); // Saves the updated cache back to the file
}

function clearCache() {
  writeCache({}); // Replaces the cache file with an empty object
}

module.exports = {
  getCacheKey,
  getFromCache,
  saveToCache,
  clearCache,
}; // Exports cache helpers for server.js and cli.js