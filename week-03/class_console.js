3+2
// 5
3*2
// 6
5%3
// 2
8%2
// 0
8%2 == 0
// true
8%2 === 0
// true
8/0
// Infinity
0/0
// NaN
1+3*4
// 13
(1+3) * 4
// 16
var a
// undefined
"hello" + "world"
// "helloworld"
9 >= 10
// false
0/0 == 0/0
// false
"foo" > 123
// false
NaN == NaN
// false
3*4 >= 12
// true
clear()
// Console was cleared
(8 > 7) && (8<2)
// false
(8 > 7) || (8<2)
// true

// type coercion
8 + "abc"
// "8abc"

/*
Two types of value coercion that matter
1. numbers become strings
2. numbers converted to logical vals
*/
"5" * 2
// 10
0 && true
// 0

// Exclaim forces a logical comparison
!(true && 0)
// true

"5" == 5
// true
"5" === 5
// false

// ! Always use === comparison

// Values are te building blocks.
// We know what they are. Now we need to store and save them.

// Assignment

const someValue = 5
// undefined
someValue
// 5
someValue + 4
// 9
const someValue2 = someValue * 6
// undefined
someValue2
// 30
someValue2 > 30
// false

// const is a new thing.
// var is the old way

let greeting
// undefined
greeting = "hello"
// "hello"

// only use const or let

// const vs. let
// const stands for "constant", value doesnt change, safeguard
// let is a var that can change

// benefit of var: "hoisting", can use var assignments above order in source!

// variable, a container mental model
// variable names are a pointer to a place in memory

// Encourage the pointer mental model

// creating vars in JS is fast and inexpensive in memory

const name = "Siqi"
// undefined
let age = 32
// undefined
age += 1

// 33
// numbers added to strings gives you a big string
name + " teaches " + 9 + " students"
// "Siqi teaches 9 students"
age = age + 1
// 34
age +=1
// 35
age++
