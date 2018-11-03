console.log('7-2');

/*Pay attention to the following:
1. Observe how button interactivity is implemented (line 37-)
*/

const popRanking1 = [
	{name: 'New York', population: 3437202},
	{name: 'Chicago', population: 1698575},
	{name: 'Philadelphia', population: 1293697}
];

const popRanking2 = [
	{name: 'New York', population: 8336697},
	{name: 'LA', population: 3857799},
	{name: 'Chicago', population: 2714856},
	{name: 'Houston', population: 2160821},
];

//  	{name: 'St Louis', population: 575238}
//   {name: 'Boston', population: 685094}

const scaleRadius = d3.scaleSqrt().domain([0, 1000000]).range([0,50]);

const margin = {t:50, r:200, b:50, l:200};
const W = d3.select('.chart').node().clientWidth;
const H = d3.select('.chart').node().clientHeight;
const w = W - margin.l - margin.r;
const h = H - margin.t - margin.b;

//chart-1: using for... loop
const plot1 = d3.select("#chart-1")
	.append('svg')
	.attr('width', W)
	.attr('height', H)
	.append('g')
	.attr('transform', `translate(${margin.l}, ${margin.t})`);


drawNodes(popRanking1);

//button interactivity
d3.select('#year-1900').on('tap click', function(){
  d3.event.preventDefault();
  drawNodes(popRanking1);
});

d3.select('#year-2000').on('click', function(){
	d3.event.preventDefault();
  drawNodes(popRanking2);
});

// chart-1

function drawNodes(data) {

  // update selection
  const cityNodesUpdate = plot1.selectAll('.node') // how many? 0, 3, or 4
    .data(data, function(d){
      return d.name;
    }); // how many? 0, 3, or 4
    
  // enter selection (defecit)
  const cityNodesEnter = cityNodesUpdate.enter()
    .append('g')
    .attr('class','node');
    
  cityNodesEnter.append('circle');
  cityNodesEnter.append('text');
  
  // enter and upate recalculate atrributes
  cityNodesUpdate.merge(cityNodesEnter)
    .transition()
    .duration(1000)
    .attr('transform', function(d,i){
          return `translate(${w/(data.length-1)*i}, ${h/2})`;
//          return `translate(${w/3*i}, ${h/2})`;
        });

  cityNodesUpdate.merge(cityNodesEnter)
    .select('circle')
    ;
//    .transition()
//    .duration(1000)
//    .attr('r',function(d){
//      return scaleRadius(d.population);
//    });

  cityNodesUpdate.merge(cityNodesEnter)
    .select('text')
    .text(function(d){
      return d.name;
    })
    .attr('text-anchor','middle');

  // exit selection (surplus)
  const cityNodesExit = cityNodesUpdate.exit()
    .remove();
  
}














