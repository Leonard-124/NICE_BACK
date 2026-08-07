
// const http = require('http')

// http.createServer((req, res) => {
//     res.writeHead(200, {'content-type': 'text/html'})
//     res.end("Hello World From Ibonnis!")
// }).listen(8081)
/////////////////////
// const getCurrentDate = () => new Date().toISOString();

// const formatCurrency = (amount, currency = 'USD') => {
//     return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: currency
//     }).format(amount)
// }

// // Method 1: Exporting multiple items
// exports.getCurrentDate = getCurrentDate;
// exports.formatCurrency = formatCurrency

////////////////////////
//Exporting single Item

// class Logger {
//     constructor(name) {
//         this.name = name;
//     }
//     log(message) {
//         console.log(`[${this.name}] ${message}`)
//     }
    
//     error(error) {
//         console.error(`[${this.name}] ERROR:`, error.message);
//     }
// }
// //Exporting a single class
// module.exports = Logger
/////////////////////////////
//Using modules
const http = require('http')
const path = require('path')

//Import custom modules
const { getCurrentDate, formatCurrency } = require('./main')
const Logger = new Logger('App') //create logger instance

//Create server
const server = http.createServer((req, res) => {
    try {
        Logger.log(`Request received for ${req.url}`)

        res.writeHead(200, {'content-type': 'text/html'});
        res.write(`<h1>Welcome to Ibonnis</h1>`);
        res.write(`<p>Current date: ${getCurrentDate()}</p>`);
        res.write(`<p>Formatted amount: ${formatCurrency(99.99)}</p>`);
        res.end();
    } catch (error) {
        Logger.error(error);
        res.writeHead(500, { 'content-type': 'text/plain'});
        res.end("Internal server error")
    }
});

//Start server
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    Logger.log(`Server running at http://localhost:${PORT}`)
})

const fs = require('fs');

// Read file asynchronously with callback
fs.readFile('myfile.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});

// For binary data (like images), omit the encoding
fs.readFile('image.png', (err, data) => {
  if (err) throw err;
  // data is a Buffer containing the file content
  console.log('Image size:', data.length, 'bytes');
});

/////////////////////////////////////////////////////

// Using fs.promises (Node.js 10.0.0+)
const fs = require('fs').promises;

async function readFileExample() {
  try {
    const data = await fs.readFile('myfile.txt', 'utf8');
    console.log('File content:', data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

readFileExample();

// Or with util.promisify (Node.js 8.0.0+)
const { promisify } = require('util');
const readFileAsync = promisify(require('fs').readFile);

async function readWithPromisify() {
  try {
    const data = await readFileAsync('myfile.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

readWithPromisify();
//////////////////////////////////////////////
// You can write large files with streams]

const fs = require('fs');
const { pipeline } = require('stream/promises');
const { Readable } = require('stream');

async function writeLargeFile() {
  // Create a readable stream (could be from HTTP request, etc.)
  const data = Array(1000).fill().map((_, i) => `Line ${i + 1}: ${'x'.repeat(100)}\n`);
  const readable = Readable.from(data);

  // Create a writable stream to a file
  const writable = fs.createWriteStream('large-file.txt');

  try {
    // Pipe the data from readable to writable
    await pipeline(readable, writable);
    console.log('Large file written successfully');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

writeLargeFile();

/////////////////////////////////////////////
// const fs = require('fs').promises;

async function deleteFile() {
  const filePath = 'file-to-delete.txt';

  try {
    // Check if file exists before deleting
    await fs.access(filePath);

    // Delete the file
    await fs.unlink(filePath);
    console.log('File deleted successfully');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File does not exist');
    } else {
      console.error('Error deleting file:', err);
    }
  }
}

deleteFile();

////////
//You can get IP address with OS
//OS can even give system info

//URL Module for URL parsing.

//////////
//Events
//everything in Node.js is an event
// Import the events module
const EventEmitter = require('events');

// Create an event emitter instance
const myEmitter = new EventEmitter();

// Register an event listener
myEmitter.on('greet', () => {
  console.log('Hello there!');
});

// Emit the event
myEmitter.emit('greet'); // Outputs: Hello there!

///////////////////////////
//Streams
//Streams are collections of data, which might not be available in full at once and don't have to fit in memory.
//Allow one to process data in chunks
//Streams allow efficient data handling.

///////////////////
//Buffers are used to handle binary data directly

// Avoid using Buffer.allocUnsafe() unless performance is critical and you immediately fill the buffer
// Zero-fill buffers after use when they contained sensitive information
// Be careful when sharing buffer instances or slices, as changes are reflected across all references
// Validate buffer inputs when receiving binary data from external sources
// Buffers can be manipulated with methods like write(), toString(), slice(), and copy()
// Buffers support various encodings including UTF-8, Base64, and Hex
// Buffers are commonly used in file I/O, network operations, and binary data processing


///Crypto
// User authentication and password storage
// Secure data transmission
// File encryption and decryption
// Secure communication channels
// Password storage
// Data integrity verification
// Digital signatures
// Content addressing (e.g., Git, IPFS)

////////////////////////////////////////
//Timeout module
//setTimeout, setInterval, setImmediate
//setImmediate executes before any timers.//
// Always clear intervals and timeouts when they're no longer needed
// Store timer IDs in a way that allows for cleanup
// Be cautious with closures in timer callbacks
// Use clearTimeout() and clearInterval() in cleanup function

//DNS Module'
//provides functionality for name resolution in Node.js

// Resolving domain names to IP addresses (A/AAAA records)
// Performing reverse DNS lookups (PTR records)
// Querying various DNS record types (MX, TXT, SRV, etc.)
// Creating custom DNS resolvers with specific settings
// Configuring DNS server settings programmatically

//Assert module
//Provides a simple yet powerful set of assertion tests for validating invariants in your code.
// Simple truthy/falsy assertions
// Strict and loose equality checks
// Deep object comparison
// Error throwing and handling
// Support for async/await patterns
// Working on larger projects
// You need features like test runners, reporters, and mocking
// Building applications that require comprehensive test coverage
// You need better error reporting and test organization

//Util module
//is a core Node.js module that provides collection of utility functions for common tasks
// Common Use Cases
// Formatting strings with placeholders
// Inspecting objects for debugging
// Converting between callbacks and Promises
// Type checking and validation
// Handling deprecation warnings
// Debugging and logging

// Key Benefits
// No external dependencies
// Performance-optimized utilities
// Consistent with Node.js core
// Great for debugging and development
// Useful for production code
// Format Specifiers:

// %s - String
// %d - Number (both integer and float)
// %i - Integer
// %f - Floating point value
// %j - JSON (replaced with '[Circular]' if the argument contains circular references)
// %o - Object (inspect the object)
// %O - Object (inspect the object, with full detail)
// %% - Single percent sign ('%')
////////////////

//Readline Module --> provides an interface for reading data from a Readable stream  one line at a time (process.stdin)
//
// Common Use Cases
// Interactive command-line applications
// Configuration wizards and setup tools
// Command-line games
// REPL (Read-Eval-Print Loop) environments
// Processing large text files line by line
// Building custom shells and CLIs

// Key Features
// Line-by-line input processing
// Customizable prompts and formatting
// Tab completion support
// History management
// Event-driven interface
// Promise-based API support

// Creating interactive command prompts
// Building CLI applications with user input
// Processing files line by line
// Implementing custom REPL environments
// Developing text-based interfaces and games

/////////////////////////
// npm install -g typescript
// npm install --save-dev @types/node
// touch app.js
////////////////////////

