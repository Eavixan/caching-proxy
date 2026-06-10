#!/usr/bin/env node

const { Command } = require("commander");

const program = new Command();

program
  .name("caching-proxy")
  .description("Start a caching proxy server")
  .version("1.0.0");

program
  .option("-p, --port <number>", "Port on which the proxy server will run")
  .option("-o, --origin <url>", "Origin server URL")
  .option("--clear-cache", "Clear all cached responses");

program.parse(process.argv);

const options = program.opts();

console.log(options);