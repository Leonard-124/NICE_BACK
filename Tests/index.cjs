

// import fs from "fs";

// console.log("Before file read");

// fs.readFile("Tests/min.txt", "utf8", (err, data) => {
//     if (err) throw err;
//     console.log(data)
// })

// console.log("After file read")

// console.log('Start of blocking code');
// const data = fs.readFileSync('Tests/myfile.txt', 'utf8'); // Blocks here
// console.log('Blocking operation completed');

// console.log("First");
// setTimeout(() => console.log("Third"), 0);
// Promise.resolve().then(() => console.log("Second"));
// console.log("Fourth");

////////////////////////////////////////////////////////////////////////////

// console.log('1. Start');

// // Next tick queue
// process.nextTick(() => console.log('2. Next tick'));

// // Microtask queue (Promise)
// Promise.resolve().then(() => console.log('3. Promise'));

// // Timer phase
// setTimeout(() => console.log('4. Timeout'), 0);

// // Check phase
// setImmediate(() => console.log('5. Immediate'));

// console.log('6. End');
/////////////////////////////////////////////////////////////////////////////
// getUser(userId)
//   .then(user => getOrders(user.id))
//   .then(orders => processOrders(orders))
//   .then(() => console.log('All done!'))
//   .catch(handleError);
/////////////////////////////////////////Async
// async function processUser(userId) {
//     try {
//         const user = await getDefaultResultOrder(UserId);
//         const orders = await getOrders(user.id);
//         await processOrders(orders)
//         console.log("All done!");
//     } catch (err) {
//         handleError(err);
//     }
// }
//////////////////////////////////////////
// const fs = require("fs").promises
// console.log("1. Reading file...");
// fs.readFile("min.txt", "utf8")
//     .then(data => {
//         console.log("3. File content:", data);
//     })
//     .catch(err => console.error('Error:', err));
// console.log("2. This runs before file is read!")
////////////////////////////////////////////
// const fs = require("fs")
// async function readFiles() {
//   try {
//     console.log('1. Starting to read files...');
//     const data1 = await fs.readFile('min.txt', 'utf8');
//     const data2 = await fs.readFile('myfile.txt', 'utf8');
//     console.log('2. Files read successfully!');
//     return { data1, data2 };
//   } catch (error) {
//     console.error('Error reading files:', error);
//   }
// }

// readFiles()
/////////////////////////////////////////////////

// async function getUserData(userId) {
//   try {
//     const user = await User.findById(userId);
//     const orders = await Order.find({ userId })
//     return { user, orders };
//   } catch (error) { console.error("Failed to fetch user data:", error)
//     throw error
//   }
// }

// getUserData()
///////////////////////////////////////////////////

// const http = require("http")

// const PORT = 4500

// const server = http.createServer((req, res) => {
//   res.writeHead(200, {"content-type": "text/plain"})
//   res.end("Hello World")
// })

// server.listen(PORT, 'localhost', () => {
//   console.log(`Server running at http://localhost:${PORT}`)
// })
//////////////////////////////////////////////////////////////

// const http = require("http")
// const url = require("url")

// const PORT = 4500

// const server =  http.createServer((req, res) => {

//   console.log("Request headers:", req.headers)

//   const userAgent = req.headers['user-agent']
//   const acceptLanguage = req.headers['accept-language']

//   // const { url, method } = req
//   const parsedUrl = url.parse(req.url, true);

//   const path = parsedUrl.pathname; //path without query string
//   const query = parsedUrl.query; //query string as an object

//   res.writeHead(200, {
//     // "content-type": "text/html",
//     "content-type": "application/json",
//     "X-Powered-By": "Node.js",
//     "cache-control": "no-cache, no-store, must-revalidate",
//     'set-cookie': 'sessionid=abc123; HttpOnly'
//   });

//   // res.end(`<h1>\nHola from Ibonnis \nUser-Agent: ${userAgent}\nacceptLanguage: ${acceptLanguage}</h1>`)
//   // res.end(`<h1> You have made ${method} to this ${url}<h1/>`)
//   res.end(JSON.stringify({
//     path,
//     query,
//     fullUrl: req.url
//   }, null, 2));
// })

// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`)
// })
////////////////////////////////////////////////////////////////query string

// const http = require('http');
// const { URL } = require('url');
// const querystring = require('querystring');

// const server = http.createServer((req, res) => {
//   const baseURL = 'http://' + req.headers.host + '/';
//   const parsedUrl = new URL(req.url, baseURL); //new URL API

//   const params = Object.fromEntries(parsedUrl.searchParams); //Get query params

//   const queryObj = {
//     name: "Mayor",
//     age: 40,
//     interests: ['programming', 'music']
//   };
//   const queryStr = querystring.stringify(queryObj)
//   res.writeHead(200, { 'Content-Type': 'application/json'});
//   res.end(JSON.stringify({
//     path: parsedUrl.pathname,
//     params,
//     exampleQueryString: queryStr
//   }, null, 2));
// });

// server.listen(3000, () => {
//   console.log("Server running on http://localhost:3000")
// })

////////////////////////////////////////////////////////////////////
//requests
// const http = require('http');
// const { URL } = require('url');

// // In-memory data store (for demonstration)
// let todos = [
//   { id: 1, task: 'Learn Node.js', completed: false },
//   { id: 2, task: 'Build an API', completed: false }
// ];

// const server = http.createServer((req, res) => {
//   const { method, url } = req;
//   const parsedUrl = new URL(url, `http://${req.headers.host}`);
//   const pathname = parsedUrl.pathname;

//   //Set CORS headers (for dev)
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   //Handle preflight requests
//   if(method === 'OPTIONS') {
//     res.writeHead(204);
//     res.end();
//     return;
//   }

//   //Route: GET /todos
//   if (method === 'GET' && pathname === '/todos') {
//     res.writeHead(200, {'Content-Type': 'application'});
//     res.end(JSON.stringify(todos));
//   }

//   //Route: POST /todos
//   else if (method === 'POST' && pathname === '/todos') {
//     let body = '';
//     req.on('data', chunk => {
//       body += chunk.toString(); //
//     });

//     req.on('end', () => {
//       try {
//         const newTodo = JSON.parse(body);
//         newTodo.id = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
//         todos.push(newTodo);
//         res.writeHead(201, { "Content-Type": "application/json" });
//         res.end(JSON.stringify(newTodo))
//       } catch (error) {
//         res.writeHead(400, { 'Content-Type': 'application/json'});
//         res.end(JSON.stringify({ error: 'Invalid JSON'}));
//       }
//     })
//   }

//   // Route: PUT /todos/:id
//   else if (method === 'PUT' && pathname.startsWith('/todos/')) {
//     const id = parseInt(pathname.split('/')[2]);
//     let body = '';

//     req.on('data', chunk => {
//       body += chunk.toString();
//     });

//     req.on('end', () => {
//       try {
//         const updatedTodo = JSON.parse(body);
//         const index = todos.findIndex(t => t.id === id);

//         if (index === -1) {
//           res.writeHead(404, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify({ error: 'Todo not found' }));
//         } else {
//           todos[index] = { ...todos[index], ...updatedTodo };
//           res.writeHead(200, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify(todos[index]));
//         }
//       } catch (error) {
//         res.writeHead(400, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ error: 'Invalid JSON' }));
//       }
//     });
//   }

//   //Route: DELETE /todos/:id
//     else if (method === 'DELETE' && pathname.startsWith('/todos/')) {
//     const id = parseInt(pathname.split('/')[2]);
//     const index = todos.findIndex(t => t.id === id);

//     if (index === -1) {
//       res.writeHead(404, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify({ error: 'Todo not found' }));
//     } else {
//       todos = todos.filter(t => t.id !== id);
//       res.writeHead(204);
//       res.end();
//     }
//   }

//   // 404 Not Found
//     // 404 Not Found
//   else {
//     res.writeHead(404, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ error: 'Not Found' }));
//   }

// }); //

// server.listen(3000, () => {
//   console.log("Server running on http://localhost:3000")
// })

//////////////////////
//Streaming

// const http = require('http');
// const fs = require('fs');
// const path = require('path');


// const server = http.createServer( (req, res) => {

//   //Get file path
//   const filePath = path.join(__dirname, req.url);

//   //Check file exist
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       res.statusCode = 404
//       res.end('File Not found')
//       return;
//     }

//     // Get file stats
//     fs.stat(filePath, (err, stats) => {
//       if(err) {
//         res.statusCode = 500
//         res.end('Server error');
//         return;
//       }

//       //Set header
//       res.setHeader('Content-Length', stats.size);
//       res.setHeader('Content-Type', 'application/octet-stream');

//       //create read stream and pipe to response
//       const stream = fs.createReadStream(filePath);

//       //Handle errors
//       stream.on('error', (err) => {
//         console.error("Errror reading file", err);
//         if (!res.headersSent) {
//           res.statusCode = 500;
//           res.end('Error reading file');
//         }
//       });
//       //Pipe the file to the response
//       stream.pipe(res);
//     })
//   })
// })

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`File server running at http://localhost:${PORT}/`);
// });

// File uploads/downloads
// Real-time data processing
// Proxying requests
// Video/audio streaming
// Log processing

/////////////////////////