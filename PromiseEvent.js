/*!
 * PromiseEvent.js v1.0.0
 * (c) 2025 Mossscript 
 * Released under the Apache 2.0 License
 */

function PromiseEvent(func) {
   let target = new EventTarget();
   let promise = validation(func).main ? new Promise(func) : undefined;
   
   // privet function 
   function dispatch(event, detail) {
      target.dispatchEvent(new CustomEvent(event, { detail }));
   }
   function validation(input) {
      return {
         get main() {
            if (!input) return false;
            if (typeof input !== 'function') {
               error(10);
               return false;
            }
            if (input.length < 2) {
               error(11);
               return false;
            }
            return true;
         },
         get all() {
            if (input === undefined) {
               error(20);
               return false;
            }
            if (!Array.isArray(input)) {
               error(21);
               return false;
            }
            if (input.length === 0) {
               error(22);
               return false;
            }
            if (!input.every(item => item instanceof Promise)) {
               error(23);
               return false;
            }
            return true;
         }
      }
   }
   function error(code) {
      const messages = {
         // PromiseEvent() Errors 
         10: "The provided argument is not a function.",
         11: "The provided function does not have two arguments.",
         // all() Errors 
         20: "No argument was provided.",
         21: "The provided argument is not an array.",
         22: "The provided array has no items.",
         23: "The items in the array are not valid promises.",
      }
      throw new Error(`[Code ${code}] ${messages[code] || "Unknown error."}`);
   }
   
   // API
   let api = {
      // method 
      all(promisesArray) {
         // validation
         validation(promisesArray).all;
         
         // variable 
         let target = new EventTarget();
         let total = promisesArray.length;
         let progress = 0;
         let errors = [];
         let results = [];
         
         // private function 
         function dispatch(event, detail) {
            target.dispatchEvent(new CustomEvent(event, { detail }));
         }
         
         // sup API
         let api = {
            // EventTarget method 
            addEventListener: target.addEventListener.bind(target),
            removeEventListener: target.removeEventListener.bind(target),
            dispatchEvent: target.dispatchEvent.bind(target),
            
            // event method 
            on(event, callback) {
               target.addEventListener(event, (e) => callback(e.detail), { once: true });
            },
            
            // event property 
            set onprogress(callback) {
               target.addEventListener('progress', (e) => callback(e.detail));
            },
            set onresolve(callback) {
               target.addEventListener('resolve', (e) => callback(e.detail));
            },
            set onreject(callback) {
               target.addEventListener('reject', (e) => callback(e.detail));
            },
            set onfinish(callback) {
               target.addEventListener('finish', (e) => callback(e.detail), { once: true });
            },
            
            // property
            get total(){
               return total;
            },
            get results(){
               return results;
            },
            get errors(){
               return errors;
            },
         };
         // run
         promisesArray.forEach((promise, index) => {
            promise.then((res) => {
                  queueMicrotask(() => {
                     results[index] = res;
                     progress++;
                     dispatch('progress', progress);
                     dispatch('resolve', { index, result: res });
                     
                     if (progress === total) {
                        dispatch('finish', { results, errors });
                     }
                  });
               })
               .catch((err) => {
                  queueMicrotask(() => {
                     results[index] = null;
                     errors[index] = err;
                     progress++;
                     dispatch('progress', progress);
                     dispatch('reject', { index, error: err });
                     
                     if (progress === total) {
                        dispatch('finish', { results, errors });
                     }
                  });
               });
         });
         // return 
         return api;
      },
      
      // EventTarget method 
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target),
      dispatchEvent: target.dispatchEvent.bind(target),
      
      // event method 
      on(event, callback) {
         target.addEventListener(event, (e) => callback(e.detail), { once: true });
      },
      
      // event property 
      set onresolve(callback) {
         target.addEventListener('resolve', (e) => callback(e.detail), { once: true });
      },
      set onreject(callback) {
         target.addEventListener('reject', (e) => callback(e.detail), { once: true });
      },
      
      // property 
      promise,
   }
   
   // run promise
   if (promise) {
      promise.then(resolve => {
         queueMicrotask(() => {
            dispatch('resolve', resolve);
         })
      }).catch(reject => {
         queueMicrotask(() => {
            dispatch('reject', reject);
         })
      });
   }
   
   // return 
   return api;
}
