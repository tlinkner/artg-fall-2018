//First, create a corresponding website scaffolding with index.html

console.log('Hello world');

{
	//Values and operators
  let a = 1 + 2;
  console.log(typeof(a));

	//Type coersion
  let b = toString(a)
  console.log(typeof(b));
  
  let c = +b
  console.log(typeof(c));

	//Assignment operations
  var d = 1;
  let e = "string";
  const f = [];
}

//Objects
const department1 = {
	name: "camd",
	facultyCount: 20
}

const person1 = {
	name: "Siqi",
	age: 32,
	faculty: true,
	department: department1
};

const person2 = {
	department: department1
}

//Add a property
person1.city = "New York City";

//Modify
person1.age = 33;
person1.faculty = !(person1.faculty);

//How many faculty members in CAMD
console.log(person1.department.facultyCount);

//A simple array
const arr1 = [3, 4, 5, 6, -9];
console.log('Simple array has a length of ' + arr1.length);

arr1.push(10);
//indices start at 0, ends at length-1
console.log(arr1[0]);

//if...else
const a = 9 > 7;
if(a){
	console.log('9 greater than 7 is true')
}else{
	console.log('9 greater than 7 is false')
}

for(let i=0; i<100; i++){
	console.log(i+1);
}

//How to solve the library problem
/*
	for(every book in libary){
		if(book.yearPublished > 1980){
			put it aside
		}else{
			leave it in place
		}
	}
*/
console.log('---------------')

const arr2 = [67, 8913, -100];
let sum = 0;
for(let i=0; i<arr2.length; i++){
	sum += arr2[i];
}
console.log('Sum of arr2 is ' + sum);

console.log('-- Testing math.random() ----------')
/*
	for(loop of 1000 iterations){
		generate a random value
		let's put random value in one of 4 buckets
		0 - 0.25
		0.25 - 0.5
		0.5 - 0.75
		0.75 - 1
	}

	in the end, check how many out of 1000 values fell into each bucket
*/
const sums = {
	bucketQuartile1: 0,
	bucketQuartile2: 0,
	bucketQuartile3: 0,
	bucketQuartile4: 0
};
for(let i=0; i<1000000; i++){
	const num = Math.random();
	if(num < 0.25){
		sums.bucketQuartile1 += 1;
	}else if(num < 0.5){
		sums.bucketQuartile2 += 1;
	}else if(num < 0.75){
		sums.bucketQuartile3 += 1;
	}else{
		sums.bucketQuartile4 += 1;
	}
}
console.log("The numbers in each bucket is: "
	+ sums.bucketQuartile1 + " / "
	+ sums.bucketQuartile2 + " / "
	+ sums.bucketQuartile3 + " / "
	+ sums.bucketQuartile4 + " / "
);

{
	//Exercise 2: repeat exercise 1, but create a function for it
	//Beware of side effects
}

{
	//Exercise 3: create a charAt function
}

function charAt(str,pos){ 
}