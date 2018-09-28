# Week 5: Working with Data

This week's assignment is intended to help you become more confident with data manipulation. In almost all data visualization problems, we need to:
- _Acquire_ data: getting data from some data store (databases or a simple .csv file) into the working environment (the browser)
- _Parse_ data: transform data into formats that are easy to work with; deal with corrupt or missing values
- _Mine_ and _transform_ data: perform basic discovery of the data (such as size, max, and min), and transform the structure of the data in preparation for further steps down the data visualization workflow

You will perform these tasks on the NYC construction permits dataset.

## How to:
Perform each task as directed by the prompts, paying particular attention to `/* YOUR CODE HERE */`, and log the result into console. 

Note the use of `console.groupCollapsed()` and `console.groupEnd()`. These two commands nicely collapse a lengthy output into a condensed message. You can observe how they work in the console.

## Question 1: Acquire and parse data
Use `d3.csv(url, parse)` to import data. Parameter `url` is a *string*, and `parse` is a *function*. This import command returns a `Promise`--essentially a placeholder for a future value as we complete the data import and parse process. To access this value from the `Promise`, we use `Promise.then()`. All of this is pre-filled in--but it's good for you to understand what's going on.

Now, the parsing function. The parsing function is of the form
```
function(a){
	return b;
}
```
First, understand that this function is executed once _for each element in the imported array of data_ (i.e. one row in the .csv). Also, observe that this function takes one argument `a`, and returns another object (`b`), where `a` is one row/object in the imported data, *pre-parse*. The returned object, `b`, will replace `a` in the final output.

Let's examine the placeholder code:
```
function(d){
	return {
		job_type: d.job_type,
		square_footage: +d.square_footage
		...
	}
}
```
Here, the incoming, pre-parse row/object (`a` in the previous example) has attributes `job_type` and `square_footage`, and the outgoing, post-parse object (`b`) has the same attributes. But changes have occurred: namely, the incoming object's `square_footage` attribute is of the type *string*, but the outgoing object's corresponding attribute is of the type *number*, which is easier to work with for the tasks following. This is one example of something that we do in the parsing process.

Following this example, complete the parsing function as prompted. Take note of two things:
- You have complete freedom in terms of how parsing works, including which attributes from the incoming object to pass onto the outgoing one.
- This is also a good opportunity to spot and deal with unexpected/trivial/error values, such as empty fields (`undefined`).

## Question 2: basic array and object properties
Frequently, one of the first questions we ask is "how much data we are dealing with". One of the basic array properties is its `length` property. Using `array.length`, discover the number of individual records in the permits dataset.

Another common question is "what are the fields or attributes available for each record in the dataset?" Using `Object.keys()`, list out all the attributes in the dataset, as prompted.

## Question 3: array iteration
Think of `array.forEach()` as "for each element in the array, do something". The "do something" part is represented by a function, as follows
```
array.forEach(function(element, i, array){
	//This is a function with three parameters: 
	//	element: each element in the array
	//	i: the 0-based index of this element
	//	array: the entire array
	//you can do any number of things with these two parameters here
});
```
Use `array.forEach` to complete the task as prompted

## Question 4: array mapping
Questions 4.1-4.5 are about working with *continuous* data dimensions (i.e. numbers). Follow the prompts, paying particular attention to `array.map` and `array.filter`

### `array.map` vs `array.forEach`
_How they are similar_
- Both iterate through each element in the array
- Both accept a function as an argument, and the input paramters into the function are `element` and `i` in both cases
_How they are different_
- Think of `forEach` as "for each array element, do something". In constrast, think of `map` as "for each array element, swap it out with something else". The difference is that `array.map` takes one array and returns a second array where each element has been swapped/modified in someway, while `array.forEach` returns `undefined`.

## Question 5: nesting
Questions 5.1-5.3 involves the concept of "nesting", which creates hierarchies in data by grouping like with like. It can be a nuanced idea at first, and it helps to visualize what happens.

Before nesting, we have a "flat" array of objects:
```
[
	record, //each record is an object
	record,
	record,
	...
]
```
After nesting, records are grouped into array of objects (each object also containing an array)
```
[
	{
		key: ...,
		values: [
			record,
			record
			...
		]
	},{
		key: ...,
		values: [
			record,
			record
			...
		]
	},{
		key: ...,
		values: [
			record,
			record
			...
		]
	},
	...
]
```
The `key` in each group is shared among all the records in that group (for example, all the permit records in that group may have the same `permit_type`).

Use nesting to explore the permit dataset, particularly the categorical dimensions. Refer to the `d3.nest` API reference for further information.

## Additional practice with data structures
Being able to effectively work with data (and basic data structures such as arrays) is a _fundamental_ skill. In the past, one of the main bottlenecks students encounter as they build their data visualization practice is a lack of facility with data manipulation. Therefore, I _highly_ encourage you to get additional practice (and reach out to me if you encounter difficulties):

- [A list of array exercises](https://www.w3resource.com/javascript-exercises/javascript-array-exercises.php)
- [d3 nesting exercises](http://learnjsdata.com/group_data.html)

