# PromiseEvent.js v1.0.0

A lightweight utility that converts Promise-based workflows into event-driven flows.

---

## Overview

**PromiseEvent.js** allows you to work with native JavaScript Promises while exposing an EventTarget-based API to listen for progress, resolution, rejection, and completion events.  
This is useful when you want a more flexible event-driven approach around Promise operations without losing native Promise functionality.

---

## Features

- Wrap a Promise executor function into an event-driven object.
- Aggregate multiple Promises with progress tracking.
- Dispatch custom events for `progress`, `resolve`, `reject`, and `finish`.
- Minimal and dependency-free.
- Supports event listeners and event properties (`onresolve`, `onreject`, etc).
- Thorough input validation with meaningful error codes and messages.

---

## Usage

### Creating a PromiseEvent instance

``` JavaScript 
const promiseEvent = PromiseEvent((resolve, reject) => {
  // Your asynchronous code here
  setTimeout(() => resolve("Done!"), 1000);
});

// Listening for events
promiseEvent.onprogress = (progress) => console.log("Progress:", progress);
promiseEvent.onresolve = (result) => console.log("Resolved with:", result);
promiseEvent.onreject = (error) => console.error("Rejected with:", error);
promiseEvent.onfinish = ({ results, errors }) => {
  console.log("Finished all:", results, errors);
};
``` 

### Handling multiple Promises with .all()

``` JavaScript 
const promises = [
  fetch('/api/data1'),
  fetch('/api/data2'),
  fetch('/api/data3'),
];

const multi = PromiseEvent().all(promises);

multi.onprogress = (progress) => console.log(`Progress: ${progress}/${multi.total}`);
multi.onresolve = ({ index, result }) => console.log(`Promise ${index} resolved:`, result);
multi.onreject = ({ index, error }) => console.log(`Promise ${index} rejected:`, error);
multi.onfinish = ({ results, errors }) => {
  console.log("All done!", results, errors);
}; 
``` 

---

## API Reference

### PromiseEvent(func)

func: A function with two arguments (resolve, reject) to create a new Promise.

### Returns an object with the following properties and methods:


| Category           | Property/Method                         | Description                                                                                          |     
|--------------------|-----------------------------------------|------------------------------------------------------------------------------------------------------|
| **Main Property**  | `.promise`                              | The underlying native Promise instance (if any).                                                     |
| **Methods**        | `.all(promisesArray)`                   | Takes an array of Promises and returns an event-driven API object for tracking progress and results. |
|                    | `.addEventListener(event, callback)`    | Add event listener to events like progress, resolve, reject, finish.                                 |
|                    | `.removeEventListener(event, callback)` | Remove event listener.                                                                               |
|                    | `.dispatchEvent(event)`                 | Dispatch an event manually.                                                                          |
|                    | `.on(event, callback)`                  | Add a one-time event listener for an event.                                                          |
| **Event Handlers** | `.onprogress (setter)`                  | Set handler for progress updates.                                                                    |
|                    | `.onresolve (setter)`                   | Set handler for successful resolution events.                                                        |
|                    | `.onreject (setter)`                    | Set handler for rejection events.                                                                    |
|                    | `.onfinish (setter)`                    | Set handler for when all Promises complete.                                                          |
| **Properties**     | `.results`                              | Array of resolved results from the promises processed by `.all()`.                                   |
|                    | `.errors`                               | Array of rejection errors from the promises processed by `.all()`.                                   |

---

## License

This project is released under the Apache License 2.0.
For full license details, see the LICENSE file included in the repository.

---

© 2025 Mossscript  
All rights reserved.

See the full license details in the [LICENSE](./LICENSE) file.

---