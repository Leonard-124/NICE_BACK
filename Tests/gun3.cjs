
// let events = require('events');
// let eventEmitter = new events.EventEmitter();

// //Create an event handler:
// let myEventHandler = function () {
//   console.log('I hear a scream!');
// }

// //Assign the event handler to an event:
// eventEmitter.on('scream', myEventHandler);

// //Fire the 'scream' event:
// eventEmitter.emit('scream');

//////////////////////////////

// const fs = require('fs');

// // Create a writable stream to a file
// const writableStream = fs.createWriteStream('output.txt');

// // Write data to the stream
// writableStream.write('Hello, ');
// writableStream.write('World!');
// writableStream.write('\nWriting to a stream is easy!');

// // End the stream
// writableStream.end();

// // Events for writable streams
// writableStream.on('finish', () => {
//   console.log('All data has been written to the file.');
// });

// writableStream.on('error', (err) => {
//   console.error('Error writing to stream:', err);
// });

///////////////////////////////////////

// const net = require('net');

// // Create a TCP server
// const server = net.createServer((socket) => {
//   // 'socket' is a duplex stream

//   // Handle incoming data (readable side)
//   socket.on('data', (data) => {
//     console.log('Received:', data.toString());

//     // Echo back (writable side)
//     socket.write(`Echo: ${data}`);
//   });

//   socket.on('end', () => {
//     console.log('Client disconnected');
//   });
// });

// server.listen(8080, () => {
//   console.log('Server listening on port 8080');
// });

////////////////////////////////

// const http = require('http');
// const fs = require('fs');

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//   // Handle different routes
//   if (req.url === '/') {
//     // Send a simple response
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end('<h1>Stream Demo</h1><p>Try <a href="/file">streaming a file</a> or <a href="/video">streaming a video</a>.</p>');
//   }
//   else if (req.url === '/file') {
//     // Stream a large text file
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     const fileStream = fs.createReadStream('largefile.txt', 'utf8');

//     // Pipe the file to the response (handles backpressure automatically)
//     fileStream.pipe(res);

//     // Handle errors
//     fileStream.on('error', (err) => {
//       console.error('File stream error:', err);
//       res.statusCode = 500;
//       res.end('Server Error');
//     });
//   }
//   else if (req.url === '/video') {
//     // Stream a video file with proper headers
//     const videoPath = 'video.mp4';
//     const stat = fs.statSync(videoPath);
//     const fileSize = stat.size;
//     const range = req.headers.range;

//     if (range) {
//       // Handle range requests for video seeking
//       const parts = range.replace(/bytes=/, "").split("-");
//       const start = parseInt(parts[0], 10);
//       const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//       const chunksize = (end - start) + 1;

//       const videoStream = fs.createReadStream(videoPath, { start, end });
//       res.writeHead(206, {
//         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//         'Accept-Ranges': 'bytes',
//         'Content-Length': chunksize,
//         'Content-Type': 'video/mp4'
//       });

//       videoStream.pipe(res);
//       } else {
//         // No range header, send entire video
//         res.writeHead(200, {
//           'Content-Length': fileSize,
//           'Content-Type': 'video/mp4'
//         });

//         fs.createReadStream(videoPath).pipe(res);
//       }
//   }   else {
//     // 404 Not Found
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('Not Found');
//   }
// });

// // Start the server
// server.listen(8080, () => {
//   console.log('Server running at http://localhost:8080/');
// });

/////////////////////////////////////////

// const fs = require('fs');
// const { Transform } = require('stream');
// const csv = require('csv-parser'); // npm install csv-parser

// // Create a transform stream to filter and transform CSV data
// const filterTransform = new Transform({
//   objectMode: true,
//   transform(row, encoding, callback) {
//     // Only pass through rows that meet our criteria
//     if (parseInt(row.age) > 18) {
//       // Modify the row
//       row.isAdult = 'Yes';
//       // Push the transformed row
//       this.push(row);
//     }
//     }
//     callback();
//   }
// });

// // Create a writable stream for the results
// const results = [];
// const writeToArray = new Transform({
//   objectMode: true,
//   transform(row, encoding, callback) {
//     results.push(row);
//     callback();
//   }
// });

// // Create the processing pipeline
// fs.createReadStream('people.csv')
//   .pipe(csv())
//   .pipe(filterTransform)
//   .pipe(writeToArray)
//   .on('finish', () => {
//     console.log(`Processed ${results.length} records:`);
//     console.log(results);
//   }
//   })
//   .on('error', (err) => {
//     console.error('Error processing CSV:', err);
//   }
//   });

//////////////////////////////////////////////////////////

// Create a buffer from a string
// const buf = Buffer.from('Hello, Node.js!');

// Buffers can be converted to strings
// console.log(buf.toString()); // 'Hello, Node.js!'

// Access individual bytes
// console.log(buf[0]); // 72 (ASCII for 'H')

// Buffers have a fixed length
// console.log(buf.length); // 15

/////////////////////////////////////////////////////////

// Create a buffer of 10 bytes filled with zeros
// const buffer1 = Buffer.alloc(10);
// console.log(buffer1);

///////
// Create an uninitialized buffer of 10 bytes
// const buffer2 = Buffer.allocUnsafe(10);
// console.log(buffer2);

// // Fill the buffer with zeros for security
// buffer2.fill(0);
// console.log(buffer2);

///////
// const buffer = Buffer.from('Hello, World!');

// // Create a slice from position 7 to the end
// const slice = buffer.slice(7);
// console.log(slice.toString());

// // Create a slice from position 0 to 5
// const slice2 = buffer.slice(0, 5);
// console.log(slice2.toString());

// // Important: slices share memory with original buffer
// slice[0] = 119; // ASCII for 'w' (lowercase)
// console.log(slice.toString());
// console.log(buffer.toString())

/////////////////////////////////
//Buffers + Streams

// const fs = require('fs');
// const { Transform } = require('stream');

// // Create a transform stream that processes data in chunks
// const transformStream = new Transform({
//   transform(chunk, encoding, callback) {
//    // Process each chunk (which is a Buffer)
//    const processed = chunk.toString().toUpperCase();
//    this.push(Buffer.from(processed));
//    callback();
//   }
// });
// // Create a read stream from a file
// const readStream = fs.createReadStream('input.txt');
// // Create a write stream to a file
// const writeStream = fs.createWriteStream('output.txt');
// // Process the file in chunks
// readStream.pipe(transformStream).pipe(writeStream);

///////////////////////////////////////////////

// const crypto = require('crypto');

// // Create a SHA-256 hash of a string
// const hash = crypto.createHash('sha256')
//   .update('Hello, Node.js!')
//   .digest('hex');
// console.log('SHA-256 Hash:', hash);

/////////////////////////////////////////////

// const crypto = require('crypto');

// // Create a hash object
// const hash = crypto.createHash('sha256');

// // Update the hash with data
// hash.update('Hello, World!');

// // Get the digest in hexadecimal format
// const digest = hash.digest('hex');
// console.log(digest);

///////////////////////////////////////////

// const crypto = require('crypto');
// const data = 'Hello, World!';

// // MD5 (not recommended for security-critical applications)
// const md5 = crypto.createHash('md5').update(data).digest('hex');
// console.log('MD5:', md5);

// // SHA-1 (not recommended for security-critical applications)
// const sha1 = crypto.createHash('sha1').update(data).digest('hex');
// console.log('SHA-1:', sha1);

// // SHA-256
// const sha256 = crypto.createHash('sha256').update(data).digest('hex');
// console.log('SHA-256:', sha256);

// // SHA-512
// const sha512 = crypto.createHash('sha512').update(data).digest('hex');
// console.log('SHA-512:', sha512);

////////////
//dns lookup

// const dns = require('dns');

// // Look up a domain name
// dns.lookup('nodejs.org', (err, address, family) => {
//   if (err) {
//     console.error('Lookup error:', err);
//     return;
//   }
//   console.log(`IP address: ${address}`);
//   console.log(`IP version: IPv${family}`);
// });
///
// const dns = require('dns');

// // Example usage
// dns.lookup('nodejs.org', (err, address, family) => {
//   if (err) throw err;
//   console.log(`Resolved: ${address} (IPv${family})`);
// });
//////

// const dns = require('dns');

// // Get all IPv4 addresses
// dns.resolve4('www.ibonnis.com', (err, addresses) => {
//   if (err) throw err;

//   console.log('IPv4 addresses:');
//   addresses.forEach(address => {
//     console.log(` ${address}`);
//   });

// // Perform a reverse lookup on the first IP
//   dns.reverse(addresses[0], (err, hostnames) => {
//     if (err) throw err;

//     console.log(`Reverse lookup for ${addresses[0]}:`);
//     hostnames.forEach(hostname => {
//       console.log(` ${hostname}`);
//     });
//   });
// });
//////////////////Assert
// const assert = require('assert').strict;

// // Function to test
// function add(a, b) {
//   if (typeof a !== 'number' || typeof b !== 'number') {
//     throw new TypeError('Inputs must be numbers');
//   }
//   return a + b;
// }
// // Test cases
// assert.strictEqual(add(2, 3), 5, '2 + 3 should equal 5');
// // Test error case
// assert.throws(
//   () => add('2', 3),
//   TypeError,
//   'Should throw TypeError for non-number input'
// );
// console.log('All tests passed!');
///////

// const assert = require('assert');

// // These will pass (coercive equality)
// assert.equal(1, 1);
// assert.equal('1', 1); // String is coerced to number
// assert.equal(true, 1); // Boolean is coerced to number

// try {
//   // This will throw an error
//   assert.equal(1, 2, '1 is not equal to 2');
// } catch (err) {
//   console.error(`Error: ${err.message}`);
// }
////
// This will pass
// assert.match('I love Node.js', /Node\.js/);

// try {
//   // This will throw an AssertionError
//   assert.match('Hello World', /Node\.js/, 'String does not match the pattern');
// } catch (err) {
//   console.error(`Error: ${err.message}`);
// }

//////////////////
//Util
// const util = require('util');
// const fs = require('fs');

// // Convert callback-based fs.readFile to Promise-based
// const readFile = util.promisify(fs.readFile);
// // Format strings with placeholders
// const greeting = util.format('Hello, %s! Today is %s', 'Developer', new Date().toDateString());
// console.log(greeting);
// // Inspect an object with custom options
// const obj = {
//   name: 'Test',
//   nested: { a: 1, b: [2, 3] },
//   fn: function() { return 'test'; }
// };
// console.log(util.inspect(obj, { colors: true, depth: 2 }));
// // Use debug logging
// const debug = util.debuglog('app');
// debug('This will only show if NODE_DEBUG=app');
// // Example of using promisify with async/await
// async function readConfig() {
//   try {
//     const data = await readFile('package.json', 'utf8');
//     console.log('Package name:', JSON.parse(data).name);
//   } catch (err) {
//     console.error('Error reading config:', err);
//   }
// }
// readConfig();

///////////////////////////////////////////

// const util = require('util');

// // Basic formatting
// const formatted = util.format('Hello, %s!', 'World');
// console.log(formatted); // 'Hello, World!'

// // Multiple placeholders
// const multiFormatted = util.format(
//   'My name is %s. I am %d years old and I love %s.',
//   'Kai',
//   30,
//   'Node.js'
// );
// console.log(multiFormatted);
// // 'My name is Kai. I am 30 years old and I love Node.js.'

// // Available specifiers
// const specifiers = util.format(
//   'String: %s, Number: %d, JSON: %j, Character: %c',
//   'hello',
//   42,
//   { name: 'Object' },
//   65  // ASCII code for 'A'
// );
// console.log(specifiers);

// // Extra arguments are concatenated with spaces
// const extra = util.format('Hello', 'World', 'from', 'Node.js');
// console.log(extra);

////////////////////

// const util = require('util');

// // Class with custom inspection
// class Person {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//     this._private = 'hidden information';
//   }
  
//   // Custom inspect method
//   [util.inspect.custom](depth, options) {
//     return `Person(${this.name}, ${this.age})`;
//   }
// }
// const kai = new Person('Kai', 30);

// // Custom inspection is used
// console.log(util.inspect(kai)); // Person(Kai, 30)

// // Directly using console.log also uses custom inspection
// console.log(kai);

///////////////////////////////////

// const util = require('util');
// const fs = require('fs');

// // Convert fs.readFile from callback-based to Promise-based
// const readFilePromise = util.promisify(fs.readFile);

// // Now we can use it with async/await or Promise chaining
// async function readFileExample() {
//   try {
//     // Using the promisified function
//     const data = await readFilePromise('package.json', 'utf8');
//     console.log('File content:', data.substring(0, 100) + '...');
    
//     // Error handling with try/catch
//     return 'File read successfully';
//   } catch (err) {
//     console.error('Error reading file:', err.message);
//     return 'Error reading file';
//   }
// }

// readFileExample().then(result => {
//   console.log('Result:', result);
// });

/////////////
// const util = require('util');

// // JavaScript built-in types
// console.log('util.types.isDate(new Date()):',
//   util.types.isDate(new Date()));
// console.log('util.types.isRegExp(/test/):',
//   util.types.isRegExp(/test/));
// console.log('util.types.isPromise(Promise.resolve()):',
//   util.types.isPromise(Promise.resolve()));

// // Node.js-specific types
// console.log('util.types.isArrayBuffer(new ArrayBuffer(0)):',
//   util.types.isArrayBuffer(new ArrayBuffer(0)));
// console.log('util.types.isSharedArrayBuffer(new SharedArrayBuffer(0)):',
//   util.types.isSharedArrayBuffer(new SharedArrayBuffer(0)));
// console.log('util.types.isUint8Array(new Uint8Array()):',
//   util.types.isUint8Array(new Uint8Array()));

// // More advanced types
// console.log('util.types.isProxy(new Proxy({}, {})):',
//   util.types.isProxy(new Proxy({}, {})));
// console.log('util.types.isExternal(Requiring C++ binding):',
//   'Not demonstrated in this example');

/////////
// const readline = require('readline');

// // Create interface for input/output
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Ask a question and handle the response
// rl.question('What is your name? ', (name) => {
//   console.log(`Hello, ${name}!`);

//   // Ask follow-up question
//   rl.question('How old are you? ', (age) => {
//     console.log(`In 5 years, you'll be ${parseInt(age) + 5} years old.`);

//     // Close the interface when done
//     rl.close();
//   });
// });

// // Handle application exit
// rl.on('close', () => {
//   console.log(`Goodbye! ${rl.output.name}`);
//   process.exit(0);
// });
//
// const readline = require('readline');
// const fs = require('fs');

// // // Create an interface with advanced options
// const rl = readline.createInterface({
//   input: fs.createReadStream('myfile.txt'), // Read from file
//   output: process.stdout, // Write to console
//   terminal: false, // Input is not a terminal
//   historySize: 100, // Larger history
//   removeHistoryDuplicates: true, // Don't store duplicate commands
//   prompt: 'CLI> ', // Custom prompt
//   crlfDelay: Infinity, // Handle all CR/LF as single line break
//   escapeCodeTimeout: 200 // Faster escape code detection
// });

// // Handle each line from the file
// rl.on('line', (line) => {
//   console.log(`Processing: ${line}`);
// });

// // Handle end of file
// rl.on('close', () => {
//   console.log('Finished processing file');
// });

// function askQuestion(query) {
//   return new Promise(resolve => {
//     rl.question(query, resolve);
//   });
// }

// async function userSurvey() {
//   try {
//     const name = await askQuestion('What is your name? ');
//     const age = await askQuestion('How old are you? ');
//     const email = await askQuestion('What is your email? ');

//     console.log('\n=== User Information ===');
//     console.log(`Name: ${name}`);
//     console.log(`Age: ${age}`);
//     console.log(`Email: ${email}`);

//   } catch (error) {
//     console.error('An error occurred:', error);
//   } finally {
//     rl.close();
//   }
// }

// userSurvey();
//////

// const readline = require('readline');

// // Create interface
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Menu options
// const menu = {
//   1: 'Show current time',
//   2: 'Show system info',
//   3: 'Show memory usage',
//   4: 'Exit'
// };

// // Function to display menu
// function displayMenu() {
//   console.log('\n===== MAIN MENU =====');
//   for (const [key, value] of Object.entries(menu)) {
//     console.log(`${key}: ${value}`);
//   }
//   console.log('=========\t===========\n');
// }

// // Function to handle menu selection
// async function handleMenu() {
//   let running = true;

//   while (running) {
//     displayMenu();

//     const answer = await askQuestion('Select an option: ');

//     switch (answer) {
//       case '1':
//         console.log(`Current time: ${new Date().toLocaleTimeString()}`);
//         break;

//       case '2':
//         console.log('System info:');
//         console.log(`Platform: ${process.platform}`);
//         console.log(`Node.js version: ${process.version}`);
//         console.log(`Process ID: ${process.pid}`);
//         break;

//       case '3':
//         const memory = process.memoryUsage();
//         console.log('Memory usage:');
//         for (const [key, value] of Object.entries(memory)) {
//           console.log(`${key}: ${Math.round(value / 1024 / 1024 * 100) / 100} MB`);
//         }
//         break;

//       case '4':
//         console.log('Exiting program. Goodbye!');
//         running = false;
//         break;

//       default:
//         console.log('Invalid option. Please try again.');
//       }

//       if (running) {
//         await askQuestion('\nPress Enter to continue...');
//         console.clear(); // Clear console for better UX
//       }
//   }
// }

// // Promise-based question function
// function askQuestion(query) {
//   return new Promise(resolve => {
//     rl.question(query, resolve);
//   });
// }

// // Start the interactive menu
// handleMenu()
//   .finally(() => {
//     rl.close();
//   });
///////

// const fs = require('fs');
// const readline = require('readline');

// // Create a readable stream for the file
// const fileStream = fs.createReadStream('min.txt');

// // Create the readline interface
// const rl = readline.createInterface({
//   input: fileStream,
//   crlfDelay: Infinity // Recognize all instances of CR LF as a single line break
// });

// // Counter for line numbers
// let lineNumber = 0;

// // Process file line by line
// rl.on('line', (line) => {
//   lineNumber++;
//   console.log(`Line ${lineNumber}: ${line}`);
// });

// // Handle end of file
// rl.on('close', () => {
//   console.log(`Finished reading file with ${lineNumber} lines.`);
// });

//////////

// const readline = require('readline');
// const fs = require('fs');
// const path = require('path');

// // Available commands for autocompletion
// const commands = ['help', 'exit', 'list', 'clear', 'info', 'version', 'history'];

// // Create the readline interface with a completer function
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   prompt: 'myapp> ',
//   completer: function(line) {
//     // Command completion
//     if (!line.includes(' ')) {
//       const hits = commands.filter(c => c.startsWith(line));

//       // Show all completions if none matches
//       return [hits.length ? hits : commands, line];
//     }

//     // File path completion (for commands like "list ")
//     if (line.startsWith('list ')) {
//       const dir = line.split(' ')[1] || '.';
//       try {
//         let completions = fs.readdirSync(dir);

//         // Add trailing slash to directories
//         completions = completions.map(file => {
//           const fullPath = path.join(dir, file);
//           return fs.statSync(fullPath).isDirectory() ? file + '/' : file;
//         });

//         const hits = completions.filter(c => c.startsWith(line.split(' ')[1] || ''));
//         return [hits.length ? hits : completions, line.split(' ')[1] || ''];
//       } catch (err) {
//         return [[], line];
//       }
//     }

//     return [[], line];
//   }
// });

// // Set the prompt
// rl.prompt();

// // Handle commands
// rl.on('line', (line) => {
//   line = line.trim();

//   switch (true) {
//     case line === 'help':
//       console.log('Available commands:');
//       commands.forEach(cmd => console.log(` ${cmd}`));
//       break;

//     case line === 'exit':
//       console.log('Goodbye!');
//       rl.close();
//       return;

//     case line.startsWith('list'):
//       const dir = line.split(' ')[1] || '.';
//       try {
//         const files = fs.readdirSync(dir);
//         console.log(`Contents of ${dir}:`);
//         files.forEach(file => {
//           const stats = fs.statSync(path.join(dir, file));
//           console.log(` ${file}${stats.isDirectory() ? '/' : ''}`);
//         });
//       } catch (err) {
//         console.error(`Error listing directory: ${err.message}`);
//       }
//       break;

//     case line === 'clear':
//       console.clear();
//       break;

//     case line === 'info':
//       console.log('Node.js CLI Example');
//       console.log(`Version: 1.0.0`);
//       break;

//     case line === 'version':
//       console.log(`Node.js version: ${process.version}`);
//       break;

//     case line === 'history':
//       // Note: This requires storing history manually
//       console.log('History feature not fully implemented.');
//       break;

//     case line === '':
//       // Do nothing for empty lines
//       break;

//     default:
//       console.log(`Unknown command: ${line}`);
//       console.log('Type "help" for available commands');
//     }

//     rl.prompt();
// }).on('close', () => {
//     console.log('CLI terminated.');
//     process.exit(0);
// });

// // Handle Ctrl+C
// rl.on('SIGINT', () => {
//     rl.question('Are you sure you want to exit? (y/n) ', (answer) => {
//       if (answer.toLowerCase() === 'y') {
//         rl.close();
//       } else {
//         rl.prompt();
//       }
//   });
// });

////////

// const readline = require('readline');

// // Create interface
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   prompt: '> '
// });

// console.log('Enter your multi-line input. Type ".end" on a new line to finish:');
// rl.prompt();

// // Store lines
// const lines = [];

// // Handle input
// rl.on('line', (line) => {
//    // Check for end command
//    if (line.trim() === '.end') {
//      console.log('\nYour complete input:');
//      console.log('-'.repeat(30));
//      console.log(lines.join('\n'));
//      console.log('-'.repeat(30));

//      // Process the input (example: count words)
//      const text = lines.join(' ');
//      const wordCount = text.split(/\s+/).filter(Boolean).length;
//      const charCount = text.length;

//      console.log(`\nStatistics:`);
//      console.log(`Lines: ${lines.length}`);
//      console.log(`Words: ${wordCount}`);
//      console.log(`Characters: ${charCount}`);

//      rl.close();
//      return;
//   }

//   // Add line to collection
//   lines.push(line);
//   rl.prompt();
// });
///////

// const readline = require('readline');
// const vm = require('vm');

// // Create interface
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   prompt: 'js> '
// });

// // Create context for evaluating code
// const context = vm.createContext({
//   console,
//   Number,
//   String,
//   Array,
//   Object,
//   // Add any other global variables you want to make available
//   // You can also add your own functions
//   add: (a, b) => a + b,
//   multiply: (a, b) => a * b
// });

// console.log('Simple JavaScript REPL (Press Ctrl+C to exit)');
// console.log('Type JavaScript code and press Enter to evaluate');

// // Show the prompt
// rl.prompt();

// // Track multi-line input
// let buffer = '';

// // Handle input
// rl.on('line', (line) => {
//   // Add the line to our buffer
//   buffer += line;

//   try {
//     // Try to evaluate the code
//     const result = vm.runInContext(buffer, context);

//     // Display the result
//     console.log('\x1b[33m%s\x1b[0m', '=> ' + result);

//     // Reset the buffer after successful evaluation
//     buffer = '';
//   } catch (error) {
//     // If it's a syntax error and might be due to incomplete input,
//     // continue collecting input
//     if (error instanceof SyntaxError &&
//       error.message.includes('Unexpected end of input')) {
//       // Continue in multi-line mode
//       rl.setPrompt('... ');
//     } else {
//       // It's a real error, show it and reset buffer
//       console.error('\x1b[31m%s\x1b[0m', 'Error: ' + error.message);
//       buffer = '';
//       rl.setPrompt('js> ');
//     }
//   }

//   rl.prompt();
// });

// // Handle Ctrl+C
// rl.on('SIGINT', () => {
//   if (buffer.length > 0) {
//     // If there's pending input, clear it
//     console.log('\nInput cleared');
//     buffer = '';
//     rl.setPrompt('js> ');
//     rl.prompt();
//   } else {
//     // Otherwise exit
//     rl.question('\nAre you sure you want to exit? (y/n) ', (answer) => {
//       if (answer.toLowerCase() === 'y') {
//         console.log('Goodbye!');
//         rl.close();
//       } else {
//         rl.prompt();
//       }
//     });
//   }
// });

// rl.on('close', () => {
//   console.log('REPL closed');
//   process.exit(0);
// });

////////////
// Process identification
// console.log('Process ID (PID):', process.pid);

// // Platform information
// console.log('Platform:', process.platform);
// console.log('Node.js version:', process.version);

// // Memory usage (in bytes)
// console.log('Memory usage:', process.memoryUsage());

// // Command line arguments
// console.log('Arguments:', process.argv);

///////////////////////////////////////////////

// const startUsage = process.cpuUsage();

// // Do some CPU-intensive work
// for (let i = 0; i < 1000000000; i++) {}

// const endUsage = process.cpuUsage(startUsage);
// console.log('CPU usage (user):', endUsage.user / 1000, 'ms');
// console.log('CPU usage (system):', endUsage.system / 1000, 'ms');

/////////////////////////////////////////////
// Route with parameters
app.get('/users/:userId/books/:bookId', (req, res) => {
  // Access parameters using req.params
  res.send(`User ID: ${req.params.userId}, Book ID: ${req.params.bookId}`);
});
////////
app.get('/search', (req, res) => {
  // Access query parameters using req.query
  const { q, category } = req.query;
  res.send(`Search query: ${q}, Category: ${category || 'none'}`);
});