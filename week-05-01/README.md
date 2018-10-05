# Week 5 Assignment 1: The Basics of Data Manipulation

Week 5's assignment consists of two parts. Part 1, here, asks you to become familiar with JavaScript `array` methods and a number of d3 functions that helps with data manipulation. Part 2, in the "week-05" folder, requires you to put your capabilities to practice with the NYC construction permits dataset, which we'll work with for the remainder of the semester.

## Why?

As discussed week 4, data manipulation is a *fundamental* part of any data visualization process. Real world data is messy, and it frequently doesn't come in a format that is most conducive for visualization. We also must often perform some basic data discovery before deciding what, and how to visualize.

## Outline

There are two arrays at the start of the assignment. One is made up of numbers, another is made up of objects.

Become familiar with the following `array` methods and d3 function by working through the following exercises, using the two arrays as test subjects. At the end of the assignment, come back to and review this list.

- Part 1: `array` methods. These are a built-in part of JavaScript
  - `array.forEach`: iterating through each element in an array
  - `array.map`: transform each element in the array, and return a new array
  - `array.sort`: sorting elements in the array, and return a new array that is sorted
  - `array.filter`: filter elements in the array, and return a new array that is filtered

- Part 2: d3 functions for data manipulation and discovery
	- `d3.min`: returning the minimum value in an array
	- `d3.max`: returning the maximum value in an array
	- `d3.extent`: returning the min and max in an array
	- `d3.mean`: returning the average value of an array
	- `d3.nest`: group similar elements in an array

## Part 1: array methods (built into JavaScript)

### 1.0 `array.length`
First, play around with the arrays a little bit. Use `console.log` to log the arrays, and use `array.length` to discover how many elements there are.

### 1.1 `array.forEach`
`array.forEach(function)` will *iterate* through an array, and run the provided *function*, passing in each element as the argument. 

**`array.forEach` returns `undefined`.**

Observe how it is used on `arr_num`, and complete the rest as prompted.

### 1.2 `array.map`
`array.map(function)` will take each element in the array, run the provided *function* (passing in the current element as the argument), and *return* a new array.

Observe how it is used on `arr_num`, and complete the rest as prompted.

### 1.3 `array.sort`
`array.sort(function)` will take two elements in the array, run the provided *function*, and *return* a new array that is sorted.

### 1.4 `array.filter`
`array.filter(function)` will take each element in the array and run the provided *function*, which should produce a *boolean value*. If the boolean value is true, the element will be included in the filtered array. This will return a new array of filtered values.

## Part 2: d3 functions for data manipulation

### 2.1 `d3.min`
`d3.min(array)` returns the *smallest* value in that array. This is very simple for an array of just numbers, but what about an array of objects? How do we define *smallest*?

We can pass a second argument into `d3.min`, like so: `d3.min(array, accessor)`. The `accessor` is a function. This function takes each element in the array as an argument, and returns the value that we can use to get the smallest value. It's helpful to look at the example for how this works.

### 2.2 `d3.max`
### 2.3 `d3.extent`
### 2.4 `d3.mean`
These methods work in almost exactly the same way as `d3.min`, and they are used to find, respectively, the largest value, the min-max range, and the average of the array. Follow the examples in 2.1, complete the exercises as prompted.

### 2.5 Grouping similar elements (bonus)

Sometimes, we would like to group elements in an array based on similarity. For example, there are two *classes* of elements in `arr_obj`, and we could group elements with the same class together. When we do this, we will create a *hierarchical* structure.

We use `d3.nest` to accomplish this. Observe the example in the code file--can you try to make sense of it?


