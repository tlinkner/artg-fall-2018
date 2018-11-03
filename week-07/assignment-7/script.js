//Data import and parse
const data = d3.csv('../../data/nyc_permits.csv', parse);
const m = {t:50, r:50, b:50, l:50};
const w = d3.select('.plot').node().clientWidth - m.l - m.r;
const h = d3.select('.plot').node().clientHeight - m.t - m.b;

//Scales
const scaleCost = d3.scaleLog().range([h, 0]);
const scaleSqft = d3.scaleLog().range([0, w]);
const scalePerSqft = d3.scaleLog().range([h, 0]);
const scaleBorough = d3.scaleOrdinal();
const scaleSize = d3.scaleSqrt().range([0,30]);

//Append <svg>
const plot = d3.select('.plot')
	.append('svg')
	.attr('width', w + m.l + m.r)
	.attr('height', h + m.t + m.b)
	.append('g')
	.attr('transform', `translate(${m.l}, ${m.t})`);
plot.append('g')
	.attr('class', 'axis-y');
plot.append('g')
	.attr('class', 'axis-x')
	.attr('transform', `translate(0, ${h})`);

data.then(function(rows){
	//Data discovery
	//Range of cost_estimate
	const costMin = d3.min(rows, function(d){ return d.cost_estimate });
	const costMax = d3.max(rows, function(d){ return d.cost_estimate });
  //console.log(costMin, costMax);
	//Range of square_footage
	const sqftMin = d3.min(rows, function(d){ return d.square_footage });
	const sqftMax = d3.max(rows, function(d){ return d.square_footage });
  //console.log(sqftMin, sqftMax);
	//Range of cost_per_sqft
	const perSqftMin = d3.min(rows, function(d){ return d.cost_per_sqft });
	const perSqftMax = d3.max(rows, function(d){ return d.cost_per_sqft });
  //console.log(perSqftMin, perSqftMax);
	//The boroughs
	const boroughs = d3.nest()
		.key(function(d){ return d.borough })
		.entries(rows)
		.map(function(d){ return d.key });
  //console.log(boroughs);

	//Use the data gathered during discovery to set the scales appropriately
	scaleCost.domain([1, costMax]);
	scaleSqft.domain([1, sqftMax]);
	scalePerSqft.domain([1, perSqftMax]);
	scaleBorough.domain(boroughs).range( d3.range(boroughs.length).map(function(d){
		return (w-100)/(boroughs.length-1)*d + 50;
	}));
	scaleSize.domain([0, costMax]);

	//Plot per sqft cost vs. borough
  // perSqftChart(rows);

	//Plot cost vs. sqft
	 costVsSqftChart(rows);

	//PART 2: toggle between the two plots
	d3.select('#cost-vs-sqft')
		.on('click', function(){
			d3.event.preventDefault();
      costVsSqftChart(rows);
		});

	d3.select('#per-sqft-vs-borough')
		.on('click', function(){
			d3.event.preventDefault();
      perSqftChart(rows);
		})

});

function perSqftChart(data){

	const nodesUpdate = plot.selectAll('.node')
		.data(data, function(d){
      return d.name;
    })
    
  // enter
  const nodesEnter = nodesUpdate.enter()
    .append('g')
    .attr('class','node');

  nodesEnter.append('circle');
   
  // update
  nodesUpdate.merge(nodesEnter)
    .select('circle')
    .attr('cx', function(d){ 
      return scaleBorough(d.borough);
    })
    .attr('cy', function(d){ 
      return scalePerSqft(d.cost_estimate);
    })
    .attr('r', 1.5)
    .style('fill-opacity', .4);

  // exit
  const nodesExit = nodesUpdate.exit()
    .remove();	 

	//Draw axes
	//This part is already complete, but please go through it to see if you understand it
	const axisY = d3.axisLeft()
		.scale(scalePerSqft)
		.tickSize(-w);
	const axisX = d3.axisBottom()
		.scale(scaleBorough);

	plot.select('.axis-y')
		.transition()
		.call(axisY)
		.selectAll('line')
		.style('stroke-opacity', 0.1);
	plot.select('.axis-x')
		.transition()
		.call(axisX);
}

function costVsSqftChart(data){

	const nodesUpdate = plot.selectAll('.node')
		.data(data, function(d){
      return d.name;
    })
    
  // enter
  const nodesEnter = nodesUpdate.enter()
    .append('g')
    .attr('class','node');

  nodesEnter.append('circle');
   
  // update
  nodesUpdate.merge(nodesEnter)
    .select('circle')
		.transition()
    .attr('cx', function(d){ 
      // when sqft is zero scaler is returning -Infinfity
      return scaleSqft(d.square_footage) > 0?scaleSqft(d.square_footage):0;
    })
    .attr('cy', function(d){ 
      return scaleCost(d.cost_estimate);
    })
    .attr('r', 1.5)
    .style('fill-opacity', .4);

  // exit
  const nodesExit = nodesUpdate.exit()
    .remove();	 

	//Draw axes
	//This part is already complete, but please go through it to see if you understand it
	const axisY = d3.axisLeft()
		.scale(scaleCost)
		.tickSize(-w);
	const axisX = d3.axisBottom()
		.scale(scaleSqft);

	plot.select('.axis-y')
		.transition()
		.call(axisY)
		.selectAll('line')
		.style('stroke-opacity', 0.1);
	plot.select('.axis-x')
		.transition()
		.call(axisX);
}

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
		cost_per_sqft: +d.square_footage > 0?(+d.cost_estimate / +d.square_footage):0
	}
}