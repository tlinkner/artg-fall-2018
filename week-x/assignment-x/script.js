//Data import and parse
const data = d3.csv('../../data/nyc_permits.csv', parse); //JS Promise
const m = {t:50, r:50, b:50, l:50};
const W = d3.select('.chart').node().clientWidth;
const H = d3.select('.chart').node().clientHeight;
const w = W - m.l - m.r;
const h = H - m.t - m.b;

const partitionPlot = d3.select('#partition')
  .append('svg')
  .attr('width', W)
  .attr('height', H)
  .append('g')
  .attr('transform', `translate(${m.l}, ${m.t})`);

const treePlot = d3.select('#treemap')
  .append('svg')
  .attr('width', W)
  .attr('height', H)
  .append('g')
  .attr('transform', `translate(${m.l}, ${m.t})`);

const depthScale = d3.scaleOrdinal()
	.domain([0,1,2,3,4])
	.range([null, 'red', '#03afeb', 'yellow', 'green']);

data.then(function(rows){

  // nest
  const permitsByBorough = d3.nest()
    .key(function(d){return d.borough;})
    .key(function(d){return d.job_type;})
    .entries(rows);

  // convert to heirarchy structure
  // why didn't we do this with flare.json?
  // children were named .children attrib
  const rootBoroughCount = d3.hierarchy({
      key: "root",
      values: permitsByBorough
    }, function(d){
      return d.values;
    })
    .count();

  // create root node because it was missing
  const rootBoroughSum = d3.hierarchy({
      key: "root",
      values: permitsByBorough
    }, function(d){
      return d.values;
    })
    .sum(function(d){
      return d.cost_estimate;
    });
    
  console.log(typeof(rootBoroughSum));
    

  // Problem: value is being overwritten when 
  //  const rootNodeByCount = rootBorough.count();
  //  const rootNodeBySum = rootNode.sum(function(d){
  //    return d.cost_estimate;
  //  });

  // log transform?

  renderPartition(rootBoroughSum, partitionPlot, "$");
  renderTree(rootBoroughSum, treePlot, "$");

  d3.select('#cost-vs-sqft').on('tap click', function(){
    d3.event.preventDefault();
    renderPartition(rootBoroughSum, partitionPlot, "$");
    renderTree(rootBoroughSum, treePlot, "$");
  });
  d3.select('#per-sqft-vs-borough').on('tap click', function(){
    d3.event.preventDefault();
    renderPartition(rootBoroughCount, partitionPlot);
    renderTree(rootBoroughCount, treePlot);
  });

})

function parse(d){
	return {
		applicant_business_name:d.applicant_business_name,
		borough:d.borough,
		community_board:d.community_board,
		cost_estimate:+d.cost_estimate, //convert string to number
		enlargement:d.enlargement_flag_yes_no === "true"?true:false, //convert string to boolean
		address: `${d.job_location_house_number} ${d.job_location_street_name}`,
		job_number:+d.job_number,
		job_type:d.job_type,
		job_type2:d.job_type2,
		permit_type:d.permit_type,
		permit_issuance_date:new Date(d.permit_issuance_date),
		square_footage:+d.square_footage,
		cost_per_sqft: +d.square_footage > 0 ? (+d.cost_estimate /+d.square_footage):0
	}
}

// look up permit types
// NB = new build

function renderPartition(rootNode, plot, unit){

  console.group("Partition")
  
  unit = (typeof(unit) === 'undefined')? '':unit;
  const partitionTransform = d3.partition()
    .size([w,h]);
  const dataTransformed = partitionTransform(rootNode);
  const nodesData = dataTransformed
    .descendants()
    .filter(function(d){
      return d.depth < 3;
    });
  const nodesLinks = dataTransformed.links();
  
    
	// Update
	const nodes = plot.selectAll('.node')
			.data(nodesData)
      
	// Enter
  const nodesEnter = nodes.enter()
		.append('g')
		.attr('class','node');
  nodesEnter.append('rect');
  nodesEnter.append('text');
		
	// Enter and Update
  nodesEnter.merge(nodes)
    .transition()
    .attr('transform', function(d){
      return `translate(${d.x0}, ${d.y0})`
    })
    .select('rect')
    .attr('width',function(d){
      return d.x1 - d.x0;
    })
    .attr('height',function(d){
      return d.y1 - d.y0;
    })
    .style('fill', function(d){
				return depthScale(d.depth+1);
    })
    .attr('stroke','black')
    .attr('data-depth',function(d){return d.depth });
		
  nodesEnter.merge(nodes)
    .select('text')
    .text(function(d){
      return `${d.data.key}:${unit}${d.value}`;
    })
    .attr('x', function(d){return (d.x1 - d.x0)/ 2;})
    .attr('y', function(d){return (d.y1 - d.y0)/ 2;})
    .attr('text-anchor','middle');
    
	// Exit
	const nodesExit = nodes.exit()
		.remove();

  console.groupEnd();
}

function renderTree(rootNode, plot, unit){

	console.group('Tree');

  unit = (typeof(unit) === 'undefined')? '':unit;
	const treeTransform = d3.tree()
		.size([w, h]);

	const treeData = treeTransform(rootNode);
	const nodesData = treeData
    .descendants()
    .filter(function(d){
      return d.depth < 3;
    });
	const linksData = treeData
    .links()
    .filter(function(d){
      return d.target.depth < 3;
    });

console.log(linksData);

  //Draw nodes
  const nodes = plot.selectAll('.node')
    .data(nodesData)
    ;
  const nodesEnter = nodes.enter()
    .append('g')
    .attr('class','node');
  nodesEnter.append('circle');
  nodesEnter.append('text');

  nodesEnter.merge(nodes)
    .attr('transform', function(d){
      return `translate(${d.x}, ${d.y})`
    })
    .select('circle')
    .attr('r', 4)
    .style('fill', function(d){
      return depthScale(d.depth);
    });

  nodesEnter.merge(nodes)
    .select('text')
    .text(function(d){ return `${d.data.key}:${unit}${d.value}`})
    .attr('dx', 6);

  //Draw links
  const links = plot.selectAll('.link')
    .data(linksData);
  const linksEnter = links.enter()
    .insert('line', '.node')
    .attr('class', 'link');
  linksEnter.merge(links)
    .attr('x1', function(d){ return d.source.x })
    .attr('x2', function(d){ return d.target.x })
    .attr('y1', function(d){ return d.source.y })
    .attr('y2', function(d){ return d.target.y })
    .attr('data-depth',function(d){
      return d.target.depth;
    });

	console.groupEnd();
}
