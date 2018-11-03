// Do measuring before the data is loaded

const W = d3.select('#plot-1').node().clientWidth;
const H = d3.select('#plot-1').node().clientHeight;
const margin = {t:50,r:50,b:50,l:50};
const w = W - margin.l - margin.r;
const h = H - margin.t - margin.b;
//console.log(`W=${W}`);
//console.log(`H=${H}`);

//Data import and parse
const data = d3.csv('../../data/nyc_permits.csv', parse);

// Question: is there a relationship between size and cost
data.then(function(rows){

  // data discovery
//  console.log(rows.length); // how many
  // possible values for boroughs
//  const permitsByBorough = d3.nest()
//    .key(function(d){
//      return d.borough;
//    })
//    .entries(rows);
  	   
//  permitsByBorough.forEach(function(boroough){
//    console.log(boroough.key);
//  });
	// Address
//  const permitsByAddress = d3.nest()
//  		.key(function(d){
//  			return d.address;
//  		})
//  		.entries(rows);
//  console.log(permitsByAddress);

	// Cost
  const costMin = d3.min(rows, function(d){return d.cost_estimate});
  const costMax = d3.max(rows, function(d){return d.cost_estimate});
  const costAvg = d3.mean(rows, function(d){return d.cost_estimate});
  const costMedian = d3.median(rows, function(d){return d.cost_estimate});
//  console.group("cost");
//  console.log(costMin);
//  console.log(costMax);
//  console.log(costAvg);
//  console.log(costMedian);
//  console.groupEnd();

	// Sqft
  const sqftMin = d3.min(rows, function(d){return d.square_footage});
  const sqftMax = d3.max(rows, function(d){return d.square_footage});
  const sqftAvg = d3.mean(rows, function(d){return d.square_footage});
  const sqftMedian = d3.median(rows, function(d){return d.square_footage});
//  console.group("sqft");
//  console.log(sqftMin);
//  console.log(sqftMax);
//  console.log(sqftAvg);
//  console.log(sqftMedian);
//  console.groupEnd();

//  const zeroSqft = rows.filter(function(d){
//    return d.square_footage === 0;
//  });
//  console.log(zeroSqft.length);

  // Scale functions
  const scaleX = d3.scaleLog()
    //.domain([sqftMin,sqftMedian * 2])
    .domain([1,sqftMax])
    .range([0,w]);
  const scaleY = d3.scaleLog() // can't have 0 as minimum
    //.domain([costMin,costMedian * 2])
    .domain([costMin,costMax])
    .range([h,0]);

//  console.group('Scale');
//  console.log(scaleX.domain());
//  console.log(scaleX.range());
//  console.log(scaleX(4000000));

  const plot1 = d3.select('#plot-1')
    .append('svg')
    .attr('width',W)
    .attr('height',H)
    .append('g')
    .attr('transform',`translate(${margin.l},${margin.t})`);

  const plot2 = d3.select('#plot-2')
    .append('svg')
    .attr('width',W)
    .attr('height',H)
    .append('g')
    .attr('transform',`translate(${margin.l},${margin.t})`);

  draw(plot1, rows, scaleX, scaleY);
  draw(plot2, rows, scaleX, scaleY);

});



function draw(selection, data, sX, sY) {
  // take data and draw scatterplot
  data.forEach(function(d) {
    selection.append('circle')
      .attr('cx',sX(d.borough))
      .attr('cy',sY(d.cost_estimate))
      .attr('r',6)
      .attr('opacity',0.2);
  });
}



function parse(d){
	return {
		applicant_business_name:d.applicant_business_name,
		borough:d.borough,
		community_board:d.community_board,
		cost_estimate:+d.cost_estimate,
		enlargement:d.enlargement_flag_yes_no === "true"?true:false,
		address:`${d.job_location_house_number} ${d.job_location_street_name}`,
		job_number:+d.job_number,
		job_type:d.job_type,
		job_type2:d.job_type2,
		permit_type:d.permit_type,
		permit_issuance_date: new Date(d.permit_issuance_date),
		square_footage:+d.square_footage
	}
}