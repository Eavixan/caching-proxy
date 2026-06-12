# Caching Proxy CLI

A command-line tool that starts a caching proxy server. It forwards requests to an origin server and caches `GET` responses so repeated requests can be served from cache instead of calling the origin server again.

## Features

- Start a proxy server from the terminal
- Forward requests to an origin server
- Cache `GET` responses
- Return cache status using the `X-Cache` response header
- Clear saved cache from the CLI
- Support multiple HTTP methods

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/caching-proxy.git
cd caching-proxy
```

Install dependencies:

```bash
npm install
```

Link the CLI locally:

```bash
npm link
```

This allows you to run the command globally on your machine:

```bash
caching-proxy
```

## Usage

Start the proxy server:

```bash
caching-proxy --port 3000 --origin https://dummyjson.com
```

Then make a request through the proxy:

```bash
curl.exe -i http://localhost:3000/products
```

The first request will be fetched from the origin server:

```text
X-Cache: MISS
```

If you make the same request again, it will be returned from cache:

```text
X-Cache: HIT
```

## Clear Cache

To clear all cached responses:

```bash
caching-proxy --clear-cache
```

After clearing the cache, the next request to the same URL will be a cache miss again.

## Example

Start the proxy:

```bash
caching-proxy --port 3000 --origin https://dummyjson.com
```

Request products:

```bash
curl.exe -i http://localhost:3000/products
```

This forwards the request to:

```text
https://dummyjson.com/products
```

Request the same URL again:

```bash
curl.exe -i http://localhost:3000/products
```

This time, the response is served from cache.

## How It Works

The CLI reads the port and origin URL from the terminal. The Express server receives client requests and forwards them to the origin server using Axios.

For `GET` requests, the proxy first checks whether the response already exists in the cache.

If the response exists, the proxy returns the cached response with:

```text
X-Cache: HIT
```

If the response does not exist, the proxy fetches the response from the origin server, saves it in the cache, and returns it with:

```text
X-Cache: MISS
```

Non-`GET` requests are forwarded to the origin server but are not cached.

## Cache Behavior

Only `GET` requests are cached.

```text
GET     /products      -> cached
GET     /users         -> cached
POST    /products/add  -> not cached
PUT     /products/1    -> not cached
PATCH   /products/1    -> not cached
DELETE  /products/1    -> not cached
```

Cached responses are stored locally in a `.cache` folder. This folder is ignored by Git because cached API responses should not be pushed to GitHub.

## Project Structure

```text
caching-proxy/
├── src/
│   ├── cli.js
│   ├── server.js
│   ├── cache.js
│   └── validateOptions.js
├── .gitignore
├── package.json
└── README.md
```

## Commands

Start the proxy server:

```bash
caching-proxy --port <number> --origin <url>
```

Example:

```bash
caching-proxy --port 3000 --origin https://dummyjson.com
```

Clear the cache:

```bash
caching-proxy --clear-cache
```

Show help:

```bash
caching-proxy --help
```

Show version:

```bash
caching-proxy --version
```

## Tech Stack

- Node.js
- Express
- Axios
- Commander

https://roadmap.sh/projects/caching-server

## Status

This project is a learning project for understanding how caching proxy servers work.
