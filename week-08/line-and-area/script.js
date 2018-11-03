console.log('Line and pie chart');

const margin = {t:50, r:20, b:50, l:20};

/*
 * Chart 1: observe how this line / area chart is generated, 
 * and try to replicate the example with the permits dataset
 */

//For chart 1, observe how we generate a line chart (and an area chart, which is similar) from dummy data
//Call the function below to generate 
function generateDummyData(n){
	const offset = Math.random();
	return Array.from({length:n}).map(function(d,i){
		return {
			index: i,
			value: Math.sin((offset + i/n) * Math.PI * 1) * 2 + 10 + Math.random() * 1.5 
		}
	})
}

const dummyData = generateDummyData(200);
//call the function to draw chart 1
drawChart1(dummyData);

//console.log(dummyData);

//console.log(dummyData);

function drawChart1(lineData){
	const W = d3.select('#chart-1').node().clientWidth;
	const H = d3.select('#chart-1').node().clientHeight;
	const w = W - margin.l - margin.r;
	const h = H - margin.t - margin.b;

	//Mine dummyData for max and min, and create scales to map data from domain to range
	const extentX = d3.extent(lineData, function(d){return d.index});
	const extentY = d3.extent(lineData, function(d){return d.value});
	const scaleX = d3.scaleLinear().domain(extentX).range([0, w]);
	const scaleY = d3.scaleLinear().domain(extentY).range([h, 0]);

	//Create line generator and area generator functions
	//These generators need to be configured such that they can access x and y coordinates from an input array
	//Once configured, they can transform these arrays into the "d" (shape) attribute for <path> elements
	const line = d3.line() // returns a function
		.x(function(d){ return scaleX(d.index) })
		.y(function(d){ return scaleY(d.value) })
		//feel free to explore these additional parameters below by commenting / uncommenting each line
//		.curve(d3.curveBasis)
		.curve(d3.curveNatural)
//		.curve(d3.curveStep)

//console.log( line(lineData) );

	const area = d3.area()
		.x(function(d){ return scaleX(d.index) })
		.y1(function(d){ return scaleY(d.value) })
		.y0(h)
		//feel free to explore these additional parameters below by commenting / uncommenting each line
		.curve(d3.curveBasis)
		//.curve(d3.curveNatural)
		//.curve(d3.curveStep)

	//Draw
	const plot1 = d3.select('#chart-1')
		.append('svg')
		.attr('width', W).attr('height', H)
		.append('g')
		.attr('transform', `translate(${margin.l}, ${margin.t})`);

	//The line
	//Append a single <path> element, and bind the entire array of (index, value) objects to it
	plot1
		.append('path')
		.attr('class', 'line')
		.datum(lineData)
		.attr('d', function(d){
			return line(d)
		})
		.style('fill', 'none')
		.style('stroke', '#333')
		.style('stroke-width', 2);

	//The filled area
	//Works the exact same way
	plot1
		.insert('path', '.line')
		.attr('class', 'area')
		.datum(lineData)
		.attr('d', function(d){
			return area(d)
		})
		.style('fill-opacity', 0.05);

	//Finally, draw the axes
	const axisX = d3.axisBottom()
		.scale(scaleX);

	const axisY = d3.axisLeft()
		.scale(scaleY)
		.tickSize(-w);

	plot1.append('g')
		.attr('class', 'axis axis-x')
		.attr('transform', `translate(0, ${h})`)
		.call(axisX)
		.selectAll('line')
		.style('stroke-opacity', 0.2);

	plot1.append('g')
		.attr('class', 'axis axis-y')
		.call(axisY)
		.selectAll('line')
		.style('stroke-opacity', 0.2);

}

/*
 *Chart 2: replicate the example above, this time with the permit dataset
 */
 
// ============================================== 

d3.csv('../../data/nyc_permits.csv', parse)
	.then(aggregateByMonth)
	.then(function(data){

		//THIS IS THE MAIN BODY OF THE ASSIGNMENT
		//1.1: append <svg> and <g> to <div.#plot-2>
    const W = d3.select('#chart-2').node().clientWidth;
    const H = d3.select('#chart-2').node().clientHeight;
    const w = W - margin.l - margin.r;
    const h = H - margin.t - margin.b;


    const plot2 = d3.select('#chart-2')
      .append('svg')
      .attr('width', W).attr('height', H)
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);


		//1.2 Data discovery
		//What is the time range in the incoming "data" array?
    // let weekMin =  d3.min(data, function(d){return d.week});
    // let weekMax =  d3.max(data, function(d){return d.week});
    const extentX = d3.extent(data, function(d){return d.week});
    
		//What is the max and min number of permits per week in this array?
    data.map(function(d){
      return d.permitCount = d.permits.length;
    });
    // let permitMin =  d3.min(data, function(d){return d.permitCount});
    // let permitMax = d3.max(data, function(d){return d.permitCount})
    const extentY = d3.extent(data, function(d){return d.permitCount});


		//1.3 Set up two scales
		//scaleX is a linear time scale
		const scaleX = d3.scaleTime().domain(extentX).range([0, w]);
		//scaleY is a linear scale
		const scaleY = d3.scaleLinear().domain(extentY).range([h, 0]);

		//1.4 Set up a line generator and an area generator function
		//These generator functions will take the "data" array, 
		//and transform it into the "d" (shape) attribute for <path> elements
    const line = d3.line()
      .x(function(d){ return scaleX(d.week) })
		  .y(function(d){ return scaleY(d.permitCount) })
    const area = d3.area()
      .x(function(d){ return scaleX(d.week) })
      .y1(function(d){ return scaleY(d.permitCount) })
      .y0(h)

		//1.5 Draw the chart
    plot2.append('path')
      .attr('class', 'line')
      .datum(data)
      .attr('d', function(d){
        return line(d)
      })
      .style('fill', 'none')
      .style('stroke', '#333')
      .style('stroke-width', 2);
      
    plot2.insert('path', '.line')
      .attr('class', 'area')
      .datum(data)
      .attr('d', function(d){
        return area(d)
      })
      .style('fill-opacity', 0.05);


		//1.6 Draw axes
    const axisX = d3.axisBottom()
      .scale(scaleX);

    const axisY = d3.axisLeft()
      .scale(scaleY)
      .tickSize(-w);

    plot2.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${h})`)
      .call(axisX)
      .selectAll('line')
      .style('stroke-opacity', 0.2);

    plot2.append('g')
      .attr('class', 'axis axis-y')
      .call(axisY)
      .selectAll('line')
      .style('stroke-opacity', 0.2);
      
      
    const points = plot2.selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function(d){ return scaleX(d.week) })
      .attr('cy', function(d){ return scaleY(d.permitCount) })
      .attr('r',6)
      .attr('class','point');
      
    points.on('click', function(d){
      alert(`There are ${d.permitCount} this week.`);
    })

	});

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
		square_footage:+d.square_footage
	}
}

//You can ignore this function for now. Basically it groups permits by month/year of filing
function aggregateByMonth(rows){
	const timeRange = d3.extent(rows, function(d){return d.permit_issuance_date});
	const weeks = d3.timeWeek.range(timeRange[0], timeRange[1], 1); //these are the week dividers within the time range

	const groupByWeek = d3.histogram()
		.domain(timeRange)
		.thresholds(weeks)
		.value(function(d){return d.permit_issuance_date});

	return groupByWeek(rows).map(function(d){
		return {
			week: d.x0,
			permits: d
		}
	})
}

