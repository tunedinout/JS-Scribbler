// prototype related things

// what does new do ??
/*
    New creates an empty object as this or the context object
    Any property assigned to this will reflect in returned object
    also new fn() will return this object even if it not explicitly
    returned in the function body
    
*/


// what is type of foo.prototype ?

/**
 * Type of foo.prototype is object 
 * {constructor: foo, [__proto__]: Object}
 */
function foo(){
    console.log(`foo was called`);
}


console.log(foo.prototype);
function FooConstructor() {
    this.name = 'Narottam';
    console.log(`Foo constructor was called`)
}
const obj = new FooConstructor();

// In the above, returned obj what is the .prototype ??
// obj.prototype = foo.prototype I think


console.log(Object.getPrototypeOf(obj)== FooConstructor.prototype);

//console.log(Object.getPrototypeOf(FooConstructor) == FooConstructor.prototype);
// above line equates false why ? 

/**
 Object.getPrototypeOf(obj) --
  * returns the protoype of this object 
  * what does that mean ?
  * or does it give the object that created it
  * or does the behavior of this function is different when function is used 
  * 
  * for objects when we say return the prototype we are talking about obj.__proto__
  * 
  * A good definition : 
  * The prototype in JavaScript is a mechanism by which objects inherit properties and methods 
  * from other objects which is also know as prototypal inheritance. 
  * 
  * What are the use cases for prototypal inheriatnce ?
  * 
  * In JavaScript, every function has a prototype property, which is an object that 
  * serves as the prototype for instances created by that function when used as a 
  * constructor with the new keyword. Objects created with the same constructor 
  * function share the same prototype object. Additionally, every object in JavaScript 
  * has a __proto__ property that points to its prototype.
  * 
  * Absolutely! Here are a few tricky prototype-related questions to test your understanding:

1. **What is the difference between `obj.__proto__` and `Object.getPrototypeOf(obj)`?**
   - Both `obj.__proto__` and `Object.getPrototypeOf(obj)` provide access to an object's prototype. However, `obj.__proto__` is an accessor property that directly accesses the prototype of `obj`, while `Object.getPrototypeOf(obj)` is a method that returns the prototype of `obj`.

2. **How does JavaScript handle circular references in the prototype chain?**
   - JavaScript is capable of handling circular references in the prototype chain without causing infinite loops. When a circular reference exists, JavaScript's internal algorithms detect and handle it appropriately, ensuring that prototype traversal does not enter an infinite loop.

3. **Explain the difference between `Object.prototype` and `Function.prototype`.**
   - `Object.prototype` is the prototype object for all JavaScript objects. It contains common properties and methods inherited by all objects, such as `toString()` and `hasOwnProperty()`. On the other hand, `Function.prototype` is the prototype object for all JavaScript functions. It contains methods that are inherited by all function objects, such as `call()`, `apply()`, and `bind()`.

4. **Can you modify the prototype of built-in JavaScript objects like `Array` or `String`? If yes, should you do it?**
   - Yes, you can modify the prototype of built-in JavaScript objects like `Array` or `String`. However, it's generally not recommended to do so because it can lead to unexpected behavior and compatibility issues with other code. Modifying built-in prototypes can also make your code harder to understand and maintain. It's often better to use composition or subclassing instead of modifying built-in prototypes.

5. **What happens if you assign a new object to a function's `prototype` property after instances have already been created using that constructor?**
   - Assigning a new object to a function's `prototype` property after instances have already been created does not affect existing instances. Existing instances still retain their original prototype. However, new instances created after the assignment will inherit from the new prototype object.

These questions should help deepen your understanding of prototype-related concepts in JavaScript. Feel free to ask for clarification on any of them!
 */
 
 
 
 
 console.log(Object.getPrototypeOf(FooConstructor) === Function.prototype)
 
 
 
 
 
 
 
 
 
 
 
 
 
 
