// import { Order } from "@getbrevo/brevo"
// import User from "../models/User"

// const { resolve } = require('dns');

// async function fetchAllData() {
//     try {
//         const [users, products, orders] =  await Promise.all([ //Promise.all runs independent operations in parallel
//             User.find(),
//             product.find(),
//             Order.find()
//         ]);
//         return { users, products, orders };
//     } catch (error) {
//         console.error("Error fetching data:", error)
//     }
// }
////////////////////
// getUserById(id)
// .then(user => GetOrders(user.id))
// .then(orders => processOrders(orders))
// .catch(handleError)
/////////////////////
// const myPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         const success = Math.random() >0.5;
//         if (success) {
//             resolve('Operation completed successfully');
//         } else {
//             reject(new Error('Operation failed'));
//         }
//     }, 1000)
// });

// myPromise.then(result => console.log('Success:', result))
// .catch(error => console.error('Error:', error.message));
////////////////////////////Reading file with promises
// const fs = require('fs').promises;
// const promise1 = Promise.resolve('First result');
// const promise2 = new Promise((resolve) => setTimeout(() => resolve("Second result"), 1000))
// const promise3 = fs.readFile('min.txt', 'utf8');

// Promise.all([promise1, promise2, promise3])
// .then(results => {
//     console.log('Results:', results)
// })
// .catch(error => {
//     console.error("Error in one of the promises:", error)
// })
////////////////////////////////
// function getUser(userId) {
//     return  new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve({id: userId, name: "John"});
//         }, 1000)
//     });
// }

// function getUserPosts(user) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(['Post 1', 'Post 2', 'Post 3']);
//         }, 1000)
//     });
// }

// getUser(121)
// .then(user => {
//     console.log("User:", user);
//     return getUserPosts(user)
// })
// .then(posts => {
//     console.log('Posts:', posts)
// })
// .finally(() => console.log('Operation completed'));
////////////////////////////////////////////////////////
// async function fetchParallel() {
//   console.time('parallel');
//   const results = await Promise.all([
//     fetchData(1),
//     fetchData(2),
//     fetchData(3)
//   ]);
//   console.timeEnd('parallel');
//   return results;
// }
//////////////////////////////////////
// const http = require("http");
// const req = http.get("http://mo.com", (res) => {});
// req.on('error', (err) => {
//     console.error(err.code)
// })
///////////////////////////////////////
// const fs = require("fs");

// function readConfigFile(filename, callback) {
//     fs.readFile(filename, 'utf8', (err, data) => {
//         if (err) {
//             if(err.code === "ENOENT") {
//                 return callback(new Error(`Config file ${filename} not found`));
//             } else if (err.code === 'EACCESS') {
//                 return callback(new Error(`No permission to read ${filename}`));
//             }
//             return callback(err); //For all errors
//         }

//         try {
//             const config = JSON.parse(data)
//             callback(null, config);
//         } catch (parseError) {
//             callback(new Error(`Invalid JSON in ${filename}`));
//         }
//     });
// }

// readConfigFile('config.json', (err, config) => {
//     if (err) {
//         console.error('Failed to read config:', err.message);
//         return
//     }
//     console.log('Config loaded successfully:', config);
// });
/////////////////////////////////////////////////////

// const fs = require('fs').promises;

// async function loadUserData(userId) {
//     try {
//         const data = await fs.readFile(`users/${userId}.json`, 'utf8');
//         const user = JSON.parse(data)

//         if(!user.email) {
//             throw new Error("Invalid user data: missing email");
//         }

//         return user;
//     } catch (error) {
//         //Handle different error types
//         if (error.code === 'ENOENT') {
//             throw new Error(`User ${userId} not found`);;
            
//         } else if (error instanceof SyntaxError) {
//             throw new Error("Invalid user data format");
//         }
//         // Re-throw other errors
//         throw error;
//     } finally {
//         //Cleanup code that runs whether successful or not
//         console.log(`Finished processing user ${userId}`);
//     }
// }

// //Usage
// (async () => {
//     try {
//         const user = await loadUserData(123);
//         console.log('User loaded', user);
//     } catch (error) {
//         console.error('Failed to load user:', error.message);
//         //Handle error (e.g, show to user, retry, etc)
//     }
// })();
//////////////////////////////////
//Global Error Handlers

// process.on('uncaughtException', (error) => {
//     console.error('UNCAUGHT EXCEPTION! Shutting down...')
//     console.error(error.name, error.message);

//     //Perform cleanup (close database connections)
//     server.close(() => {
//         console.log('Process terminated due to uncaught exception');
//         proces.exit(1) //Exit with failure
//     }) 
// })
// //Handle unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//     console.error('UNHANDLED REJECTION! Shutting down...')
//     console.error('Unhandled Rejection at:', promise, 'Reason:', reason);

//     //Close server and exit
//     server.close(() => {
//         process.exit(1)
//     });
// });

// //Exe
// Promise.reject(new Error('Something went wrong'));

// //Example of uncaught exception
// setTimeout(() => {
//     throw new Error('Uncaught exception after timeout');
// }, 1000)
///////////////////////////////

//Custom Error Types

class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.statusCode = 400;
    }
}

class NotFoundError extends Error {
    constructor(resource) {
        super(`${resource} not found`);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

//Usage
function getUser(id) {
    if (!id) {
        throw new ValidationError("User ID is required", "id");
        
    }
}