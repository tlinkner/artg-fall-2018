# Pie chart

The pie chart entails some additional complexity related to data manipulation. Conceptually, pie charts represent the relative proportion of different "slices", so typical data manipulation will look like something like this:

## Grouping data into slices
This often involves using `d3.nest` to cluster data into groups.

## `d3.pie`
The "pie" generator function takes the array of groups, and computes what the pie slices will look like. Specifically, it calculates the "angles" of each slice. Note that these angles are specified in radians, not degrees (360 degrees == 2 PI radians).

It's a *very* good idea to look at the `d3.pie` [API here](https://github.com/d3/d3-shape#pies)

## `d3.arc`
Now that we have the angles, we still need to generate the `<path>` elements to visually represent these slices. To generate these, we need to rely on another generator, `arc`. 

`arc` is similar to `d3.line`: it takes in data, and produces the "d" (shape) attribute to `<path>` elements.

Again, it's a *very* good idea to look at the `d3.arc` [API here](https://github.com/d3/d3-shape#arc)


## DOM-data binding
Note that the relationship here is many-to-many. Use `selection.data()` instead of `selection.datum()`.

*The best strategy here is to look at the example pie chart, and try to work through the permits dataset in a similar fashion.*