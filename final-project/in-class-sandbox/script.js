//This example demonstrates how you might import data from different sources
//Append <svg> and <g> in the right place
//Have a reference to it via the "plot" variable
const W = d3.select('.plot').node().clientWidth;
const H = d3.select('.plot').node().clientHeight;
const margin = {t:50, r:50, b:50, l:50};
const w = W - margin.l - margin.r;
const h = H - margin.t - margin.b;

const plot = d3.select('.plot')
	.append('svg')
	.attr('width',W)
	.attr('height',H)
	.append('g')
	.attr('transform', `translate(${margin.l}, ${margin.t})`);
plot.append('g').attr('class','axis axis-x').attr('transform',`translate(0, ${h})`);
plot.append('g').attr('class','axis axis-y');


const dataPromise = d3.csv('../data/data-test.csv', parseData)
.then(function(rows){ 
	return rows.reduce(function(acc,val){return acc.concat(val)}, []); 
});
const metadataPromise = d3.csv('../data/countries-metadata.csv', parseMetadata);
const geojsonPromise = d3.json('../data/countries.geojson');

Promise.all([dataPromise, metadataPromise, geojsonPromise])
	.then(function([data, metadata, geojson]){

		const selectMenu = d3.select('.container').append('select')
			.attr('class', 'custom-select');
		[2015, 2016, 2017].forEach(function(d){
			selectMenu
				.append('option')
				.attr('value', d)
				.html(d);
		});

		selectMenu.on('change', function(){
			const val = +d3.event.target.value;

			//Re-filter the data
			const nodesData = pickDataByYear(dataByYearByCountry, val);

			//Re-flatten the data
			drawChart(nodesData, plot);

		});

		//To create the year-country-indicator hierarchy
		const dataByYearByCountry = d3.nest()
			.key(function(d){ return d.year })
			.key(function(d){ return d.countryCode })
			.entries(data);

		const nodesData = pickDataByYear(dataByYearByCountry, 2016);

		drawChart(nodesData, plot)

	});

function pickDataByYear(dataByYearByCountry, year){

	//Pick one year, so we only have country-indicator hierarchy
	const dataByCountry2016 = dataByYearByCountry
		.filter(function(d){ return +d.key === year })[0].values;

	//Flatten the data to one level
	const nodesData = dataByCountry2016.map(function(country){

			const key = country.key; //"AFG"
			const indicators = country.values; //array of 3

			const output = {};
			output.key = key;

			indicators.forEach(function(indicator){
				output[indicator.series] = indicator.value;
			}); // 3 times

			return output;
		});

	return nodesData;

}

function drawChart(data, domSelection){

	const POP_INDICATOR_NAME = 'Population, total';
	const GDP_PER_CAP_INDICATOR_NAME = 'GDP per capita (constant 2010 US$)';
	const INFANT_MORT_INDICATOR_NAME = 'Mortality rate, infant (per 1,000 live births)';

	//Draw viz under domSelection, based on dataPromise
	const popExtent = d3.extent(data, function(d){ return d[POP_INDICATOR_NAME]});
	const gdpPerCapExtent = d3.extent(data, function(d){ return d[GDP_PER_CAP_INDICATOR_NAME]});
	const infantMortExtent = d3.extent(data, function(d){ return d[INFANT_MORT_INDICATOR_NAME]});


	//Scale
	const scaleX = d3.scaleLog().domain(gdpPerCapExtent).range([0,w]);
	const scaleY = d3.scaleLinear().domain(infantMortExtent).range([h,0]);
	const scaleSize = d3.scaleSqrt().domain(popExtent).range([5,50]);

	//enter exit update
	const nodes = plot.selectAll('.country-node')
		.data(data, function(d){ return d.key });

	const nodesEnter = nodes.enter()
		.append('g').attr('class','country-node');
	nodesEnter.append('circle');
	nodesEnter.append('text');

	//
	nodes.merge(nodesEnter) //UPDATE + ENTER
		.transition()
		.attr('transform', function(d){
			const x = scaleX(d[GDP_PER_CAP_INDICATOR_NAME]);
			const y = scaleY(d[INFANT_MORT_INDICATOR_NAME]);
			return `translate(${x}, ${y})`;
		})
	nodes.merge(nodesEnter)
		.select('circle')
		.transition()
		.attr('r', function(d){ return scaleSize(d[POP_INDICATOR_NAME]) })
		.style('fill-opacity', .2)
		.style('stroke', '#333')
		.style('stroke-width', '1.5px');
	nodes.merge(nodesEnter)
		.select('text')
		.text(function(d){ return d.key })
		.attr('text-anchor','middle')
		.style('font-size', '10px');

	//axes
	//create an axis generator function
	const axisX = d3.axisTop()
		.scale(scaleX)

	const axisY = d3.axisLeft()
		.scale(scaleY)
		.tickSize(-w)

	const axisXNode = plot.select('.axis-x')
		.transition()
		.call(axisX);

	const axisYNode = plot.select('.axis-y')
		.transition()
		.call(axisY);


}

function parseData(d){

	const country = d['Country Name'];
	const countryCode = d['Country Code'];
	const series = d['Series Name'];
	const seriesCode = d['Series Code'];

	delete d['Country Name'];
	delete d['Country Code'];
	delete d['Series Name'];
	delete d['Series Code'];

	const records = [];

	for(key in d){
		records.push({
			country:country,
			countryCode:countryCode,
			series:series,
			seriesCode:seriesCode,
			year:+key.split(' ')[0],
			value:d[key]==='..'?null:+d[key]
		})
	}

	return records;

}

function parseMetadata(d){

	//Minimal parsing required; return data as is
	return d;

}