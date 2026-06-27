

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

async function getUserData(userId) {
  try {
    const user = await User.findById(userId);
    const orders = await Order.find({ userId })
    return { user, orders };
  } catch (error) { console.error("Failed to fetch user data:", error)
    throw error
  }
}

getUserData()
///////////////////////////////////////////////////