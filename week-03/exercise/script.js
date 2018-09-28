
{
    // Testing, testing, 123
    console.log("Hello world!");
    const name = "Todd";
    console.log("Hi, " + name);
    //
    let age = 30;
    age += 2;
    console.log(age);
}

// Note: braces segment code so vars don't collide
{
    console.log(3 > 1);
    console.log(3 < 1);
    console.log(typeof(3 + 3));
    console.log(typeof("3" + 3));
    console.log(typeof(3 + "abc"));
    console.log(typeof(3 < "abc"));
}

// Objects
const person = {
    name: "Todd",
    "instructor": false, // Optional quotes
    "home town": "Ann Arbor", // Quote if spaces
    id: 123
}; // Good practice, close with semicolon
console.log(person); // Or type "person" in the console

// Use it like a dictionary, look up a value
console.log(person.name);
/* 
Go back to pointer model.
This is a const. Can only change if part of an object.
Content of the memory an change but place can't.
*/

// Add a property
person.city = "Providence";
console.log(person.city);

// Template literals (note back ticks innstead of quotes)
console.log(`${person.name} lives in ${person.city}`);

// Logical modification
person.faculty = true;
person.faculty = !(person.faculty); // change status
console.log(person.faculty);

person.department = {
    name: "CAMD",
    count: 20
};
// There is explicity no order to an object so can't select first
console.log(person.department.count);

{
    department1 = {
        name: "CAMD"
    };
    // Referece another opbject and include it
    person1 = {
        department: department1
    };
    person2 = {
        department: department1
    };
    // Can reference from object
    console.log(person1.department.name);
}

// Arrays
// A list of parallels
const cities = [
    "Boston",
    "New York",
    "DC",
    "Chicago"
];

// Length of array
console.log("Cities has " + cities.length + " elements.");

// Can do this, but a bad idea
const mess = ["Foo",123,false];
console.log(mess);
console.log(typeof(mess[2]));

multimess = [
    {
        "foo": 123,
        "bar:": 456
    }
];

{
    myArr = [1,2,3];
    myArr.push(4);
    console.log(myArr);
    console.log(myArr[0]);
    // From the back
    console.log(myArr[myArr.length-1]);
}

// Control stuctures

let num = 8/21;

if (num > 1) {
    console.log("Greater than 1");
} else {
    console.log("Not greater than 1");
}

num += 1;

if (num > 1) {
    console.log("Greater than 1");
}

// Loops

for (let i=0; i<10; i += 2) {
    console.log(`Loop ${i + 1}`);
}

for (let i=0; i<10; i++) {
    console.log(i+1);
}

// Practice problems
console.log("============");

const arr2 = [67, 8913, -100];

for (let i=0; i< arr2.length; i++) {
    console.log(arr2[i]);
}

let sum = 0;
for (let i=0; i< arr2.length; i++) {
    sum += arr2[i];
}
console.log(`Sum is ${sum}.`);

// Proactice problem
console.log("Testing Math.random() ============");

Math.random(); // a number between 0 and 1

/*
for (loop of 1000 iterations) {
    generate a random value in one of 4 buckets.
    0–0.25
    0.25-0.5
    0.5-0.75
    0.75-1.0
}
*/

const sums = {
    quartile1: 0,
    quartile2: 0,
    quartile3: 0,
    quartile4: 0
};

for (let i=0; i<100000; i++) {
    let num = Math.random();
    if (num <= 0.25) {
        sums.quartile1++;
    } else if (num <= 0.5) {
        sums.quartile2++;
    } else if (num <= 0.75) {
        sums.quartile3++;
    } else {
        sums.quartile4++;
    }    
}

// Regression to the mean.
console.log(`The summary:\nQ1=${sums.quartile1} \nQ2=${sums.quartile2} \nQ3=${sums.quartile3} \nQ4=${sums.quartile4}`);

// Math.random is a uniform distribution!

// Function mental model: a microwave
// Encapsulation of individual operations
// Input cold food
// Output warm food

const multiply = function(a,b) {
    return a*b;
}
var n = multiply(5,8,);
console.log(n); // 40

// Argumets = inputs
// Return value = outputs

// External
const multiplier = 5;
const multiplyByTen = function(a) {
    // Internal: try uncommenting
    // const multiplier = 10;
    return a*multiplier;
}
console.log(multiplyByTen(5));


// Variable a pointer. In this case to a funciton.

let sayHello = function(name) {
    console.log("Hello " + name);
}

console.log(name);
console.log(sayHello);

// Ask for closure readings

// Assignment: file + 10 key concepts at end of presentation
// Note: delete braces because can't access vars in console.


{
    let foo = "bar";
}





