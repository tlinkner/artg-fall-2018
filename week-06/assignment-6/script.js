// Data import and parse
const data = d3.csv('../../data/nyc_permits.csv', parse);


// Layout constants
const W = d3.select('#plot-1').node().clientWidth;
const H = d3.select('#plot-1').node().clientHeight;
const margin = {t:50,r:50,b:50,l:50};
const w = W - margin.l - margin.r;
const h = H - margin.t - margin.b;


// Then
data.then(function(rows){

  // Remove nulls
  rows = rows.filter(function(d){
    // outliers in manhattan cause unreadable density at the low end
    if (d.square_footage > 0 && d.cost_per_sqft < 900000) {
      return d;
    }
  });

  // X
  const boroughs = d3.nest()
    .key(function(d){
      return d.borough;
    })
    .entries(rows);
  const b = [];
  boroughs.forEach(function(d){
    b.push(d.key);  
  });
  const scaleX = d3.scaleBand()
    .domain(b) // just an array?
    .range([0,w]);
    
  // console.log(scaleX("Manhattan"));

  const scaleOrd = d3.scaleOrdinal()
    .domain(0,b.length) // just an array?
    .range([0,w]);

   console.log(scaleOrd("Brooklyn"));


  // Y
  const costSqftMin = d3.min(rows, function(d){return d.cost_per_sqft});
  const costSqftMax = d3.max(rows, function(d){return d.cost_per_sqft});
  const scaleY = d3.scaleLinear()
    .domain([costSqftMin,costSqftMax])
    .range([h,0]);


  // attach to DOM
  const plot1 = d3.select('#plot-1')
    .append('svg')
    .attr('width',W)
    .attr('height',H)
    .append('g')
    .attr('transform',`translate(${margin.l},${margin.t})`);

  
  // call draw
  draw(plot1, rows, scaleX, scaleY, w, h);

});


// Draw
function draw(selection, data, sX, sY, w, h) {
  // take data and draw scatterplot
  data.forEach(function(d) {
    selection.append('circle')
      .attr('cx',sX(d.borough))
      .attr('cy',sY(d.cost_per_sqft))
      .attr('r',6)
      .attr('opacity',0.2)
      .attr('data-borough',d.borough);
  });
  
	//Bonus: draw axis
	const axisX = d3.axisBottom()
		.scale(sX)
		.tickSize(-h);
	const axisY = d3.axisLeft()
		.scale(sY)
		.tickSize(-w);
    
	selection.append('g')
		.attr('transform', `translate(0, ${h})`)
		.call(axisX)
		.selectAll('line')
		.style('stroke-opacity', .1);

	selection.append('g')
		.call(axisY)
		.selectAll('line')
		.style('stroke-opacity', .1);
    
  
}


// Parse
function parse(d) {
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