//Data import and parse
const data = d3.csv('../../data/nyc_permits.csv', parse);
const W = d3.select('#plot-1').node().clientWidth;
const H = d3.select('#plot-1').node().clientHeight;
const margin = {t:50,r:50,b:50,l:50};
const w = W - margin.l - margin.r;
const h = H - margin.t - margin.b;

data.then(function(rows){
  // how does construction cost per square foot differ 
  // across the 5 boroughs?

  //The plan is that we will map the data as follows:
  //- On the x-axis: the 5 boroughs
  //- On the y-axis: cost_per_sqft
  const costSqftMin = d3.min(rows, function(d){return d.cost_per_sqft});
  const costSqftMax = d3.max(rows, function(d){return d.cost_per_sqft});
  
  const boroughs = d3.nest()
    .key(function(d){
      return d.borough;
    })
    .entries(rows);
  
  d.cost_per_sqft});
  const boroughs = d3.scaleOrdinal().range([
      '#f26633', //red
      'blue',
      'white',
      '#00a651', //green
      'yellow'
    ]);


    
    console.log(boroughs);

  const scaleX = d3.scaleOrdinal()
    .domain([0,boroughs.length])
    .range([0,w]);
  const scaleY = d3.scaleLinear()
    .domain([costSqftMin,costSqftMax])
    .range([h,0]);

  const plot1 = d3.select('#plot-1')
    .append('svg')
    .attr('width',W)
    .attr('height',H)
    .append('g')
    .attr('transform',`translate(${margin.l},${margin.t})`);

  draw(plot1, rows, scaleX, scaleY);

});

function draw(selection, data, sX, sY) {
  console.log(selection.node());
  selection.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr('cx',function(d){return sX(d.borough)})
    .attr('cy',function(d){return sY(d.cost_per_sqft)})
    .attr('r',6)
    .attr('opacity',0.2);
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
		cost_per_sqft: +d.cost_estimate / +d.square_footage
	}
}