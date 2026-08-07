// import * as math from './math.mjs';
//Dynamic imports
//////////////////////////////////////
// app.mjs
// async function loadModule(moduleName) {

//   try {
//     // Dynamic import returns a promise
//     const module = await import(`./${moduleName}.mjs`);
//     return module;
//   } catch (error) {
//     console.error(`Failed to load ${moduleName}:`, error);
//   }
// }

// // Load a module based on a condition
// const moduleName = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

// loadModule(moduleName).then(module => {
//   module.default(); // Call the default export
// });

// // Or with simpler await syntax
// (async () => {
//   const mathModule = await import('./math.mjs');
//   console.log(mathModule.add(10, 5)); // 15
// })();
////////////////////////////////////////////////////////
//Top-level await.
// data-loader.mjs
// This would cause an error in CommonJS or in a script
// But works at the top level in an ES Module

// console.log('Loading data...');

// Top-level await - the module's execution pauses here
// const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
// const data = await response.json();

// console.log(data, 'Data loaded!');

// export { data };

// When another module imports this one, it will only get the exports
// after all the top-level await operations have completed
/////////////////////////////////////////////
// export * from './string-utils.mjs';
/////////////////////////////////////////////
(async() => {
    const { default : myModule} = await import("./gun.cjs");
})()