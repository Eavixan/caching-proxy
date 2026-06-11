#!/usr/bin/env node

const { clearCache } = require("./cache"); // Imports the function that clears saved cache data

const { startServer } = require("./server"); // Imports the function that starts the Express server

const { Command } = require("commander"); // Imports Commander so we can define and parse CLI options
const {
  validatePort,
  validateOrigin,
} = require("./validateOptions"); // Imports our custom validation functions

const program = new Command(); // Creates the CLI application

program
  .name("caching-proxy") // Sets the command name shown in the help menu
  .description("Start a caching proxy server") // Describes what the CLI tool does
  .version("1.0.0"); // Adds the built-in --version option

program
  .option(
    "-p, --port <number>",
    "Port on which the proxy server will run"
  ) // Defines the required value for the proxy server port
  .option(
    "-o, --origin <url>",
    "Origin server URL"
  ) // Defines the required value for the origin server
  .option(
    "--clear-cache",
    "Clear all cached responses"
  ); // Defines a boolean flag for clearing the cache

program.parse(process.argv); // Reads and parses the arguments entered in the terminal

const options = program.opts(); // Stores the parsed options in a JavaScript object

if (options.clearCache) {
  clearCache(); // Clears the saved cache file
  console.log("Cache cleared successfully."); // Confirms the cache was cleared
  process.exit(0); // Exits because clearing cache does not need to start the server
}

if (!options.port || !options.origin) {
  console.error("Error: --port and --origin are required."); // Explains which arguments are required
  process.exit(1); // Stops the program with a failure exit code
}

try {
  const port = validatePort(options.port); // Validates the port and converts it from a string to a number
  const origin = validateOrigin(options.origin); // Validates and normalizes the origin URL

  startServer(port, origin); // Starts the server using the validated CLI values
} catch (error) {
  console.error(`Error: ${error.message}`); // Displays the validation error without a full stack trace
  process.exit(1); // Stops the program because invalid input should not reach the server
}