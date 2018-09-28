# Week 4 Assignment

This (very quick) assignment tests your knowledge of DOM manipulation using the `d3-selection` module. The assignment itself is fairly explanatory. Should you encounter any issues, it's a good idea to revisit the in-class material.

## Quick note about the first few lines

In order to set the proper `width` and `height` attributes, it's necessary to get the "computed" width and height of the containing `div.chart` element. (We call them "computed", because depending on the CSS rules and the size of the browser window, these might change).

First, we select the container element, which gives us a selection
```
d3.select('.chart')
```

Recall that selections are merely a "pointer" or a reference to one or more DOM nodes. To get the actual measured width and height, we'll need to access the node itself:
```
d3.select('.chart').node()
```

From there, we can access its width and height using its `.clientWidth` and `.clientHeight` properties. Note that this is not part of d3, but rather part of the browser's built-in DOM API:
```
const width = d3.select('.chart').node().clientWidth
```

## Setting svg element `transform` properties

SVG elements can be transformed (translate, rotate, scale) with the following syntax:
```
<circle transform='translate(50,50'></circle>
```

Note that the whole property is a string. To concatenate strings and numbers together, you might recall the use of template literals:
```
const x = 50, y = 50;
d3.select('circle')
	.attr('transform', `translate(${x}, ${y})`)
```