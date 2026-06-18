

const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!');
}).listen(8081);

const fs = require("fs")

fs.readFile("Tests/min.txt", "utf8", (err, data) => {
  if(err) {
    console.log("Sth went wrong really bad!")
  } else {
    console.log(data)
  }
})

console.log(`this is v8 ${process.versions.v8}`)


const v8 = require('v8');
const heapStats = v8.getHeapStatistics();

console.log('Heap size limit:', (heapStats.heap_size_limit / 1024 / 1024).toFixed(2), 'MB');
console.log('Total heap size:', (heapStats.total_heap_size / 1024 / 1024).toFixed(2), 'MB');
console.log('Used heap size:', (heapStats.used_heap_size / 1024 / 1024).toFixed(2), 'MB');
