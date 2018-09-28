console.log('Assignment 3');

/*
 * Question 1: no code necessary, 
 * but feel free to use this space as a Javascript sandbox to check your answers
 */
console.log("1.0 ========================");

// 1. Answer = 14
console.log(3 * 4 + 2);

// 2. Answer = 1.5
console.log(4.5 % 3);

// 3. Answer = Infinity
console.log(92 / 0);

// 4. Answer = true
console.log(!(90 % 10));

// 5. Answer = 0 (Why?)
console.log(3 && 0)

// 6. Answer = true
console.log((8 >= 8) || (10 < 9));

// 7. Answer = 72
console.log("8" * 9);

// 8. Answer = "89" (string)
console.log("8" + 9);

// 9. Answer = false
console.log("8" === 8);

// 10. What output does the following code produce? 
// const number = 56; console.log('a' + number + 'b'); 
// Answer = "a56b" (string) 
const number = 56;
console.log('a' + number + 'b'); 

// 11. Bonus: can you rewrite 10 as a template literal?
console.log(`a${number}b`); 


/*
 * Question 2: control structures 
 */

//2.1 
console.log("2.1 ========================");

for (let i=0; i<10; i++) {
    console.log(10-i);
}

//2.2
console.log("2.2 ========================");

for (let i=0; i<500; i++) {
    if ((i+1) % 100 === 0) {
        console.log(i+1);
    }
}


//2.3
console.log("2.3 ========================");

const arr = [89, 23, 88, 54, 90, 0, 10];
//Log out the content of this array using a for loop

for (let i=0; i<arr.length; i++) {
    console.log(arr[i]);
}


/*
 * Question 3: no code necessary
 */

console.log("3.0 ========================");

// Arguments = v, n
// Return value = v ()
// Side effects = none. side effects are when a value is changed within the program outside a function itself 

function increment(v, n){
	//this function increments the v by n times
	for(let i = 0; i < n; i++){
		v += 1;
	}
	return v;
}

let initialValue = 10;
let finalValue = increment(initialValue, 10);

console.log(initialValue);
console.log(finalValue);
console.log(n); // Not defined. It is not in global scope.


/*
 * Question 4: objects and arrays
 */


//4.1
console.log("4.1 ========================");

const instructors = [
    {
        name: "Ashley", 
        role: "instructor", 
        department: "computer science",
        tenure: 10
    },
    {
        name: "Ben",
        role: "instructor",
        department: "design", 
        tenure: 2 
    },
    {
        name: "Carol",
        role: "instructor", 
        department: "design",
        tenure: 3
    }
];


//4.2 
console.log("4.2 ========================");

function computeAvgTenure(inst){
    // inst is an array of objects
    let total = 0;
    let count = inst.length;
    for (let i=0; i<inst.length; i++) {
        total += inst[i].tenure;
    }
	return total / count;
}

console.log(computeAvgTenure(instructors));


//4.3
console.log("4.3 ========================");

const dan = {
    name: "Dan",
    role: "instructor", 
    department: "humanities",
    tenure: 5
};

instructors.push(dan);

console.log(computeAvgTenure(instructors));

