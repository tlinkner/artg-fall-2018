console.log('Assignment 4');

//Append a <svg> element to .chart, and set its width and height attribute to be the same as .chart
//Hint: first, you have to find the width and height of .chart. See example for width below
const width = d3.select('.chart').node().clientWidth;
const height = 0; /* YOUR CODE HERE */

//Then append the following elements under <svg>:

//Horizontal and vertical grid lines, spaced 50px apart
//Hint: use a loop to do this

//Circle, radius 50px, center located at (50,50)

//Another circle, radius 75px, center located at (300,200)
//Do this without setting the "cx" and "cy" attributes

//A rectangle, offset from the left edge by 400px and anchored to the bottom
//with a width of 50px and a height of 70px

//Label the centers of the two circles with their respective coordinates

//Give the <rect> element a fill of rgb(50,50,50), and no stroke
//Do this without using CSS

//Give the two <circle> elements no fill, and a 2px blue outline
//Do this by giving them a class name and applying the correct CSS

//Uncomment the following block of code, and see what happens. Can you make sense of it?
/*d3.selectAll('circle')
	.transition()
	.duration(3000)
	.attr('r', 200);*/