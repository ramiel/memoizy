const memoize = require('./index');

// const tests = [/* 100, 1000, 10000, 100000,  */1000000];
// const promises = [];
// for (let j = 0; j < tests.length; j++) {
//   const test = tests[j];
//   for (let i = 0; i < test; i++) {
//     const m = memoize(a => a, { maxAge: 100 });
//     m(1);
//   }
//   const date = Date.now();
//   promises.push(new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(Date.now() - date);
//     }, 100);
//   }));
// }

// Promise.all(promises)
//   .then((values) => {
//     const table = {};
//     for (let k = 0; k < values.length; k++) {
//       table[tests[k]] = values[k];
//     }
//     console.table(table);
//   });

for (let i = 0; i < 100000; i++) {
  const m = memoize(a => a, { maxAge: 100 });
  m(1);
}

console.time('here');
setTimeout(() => {
  console.timeEnd('here');
  // console.log('I can run');
}, 100);
