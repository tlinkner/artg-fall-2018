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

//global variable
const INDICATOR = 'Population, total';
let YEAR = 2017;


const dataPromise = d3.csv('../data/data-test.csv', parseData)
.then(function(rows){ 
	return rows.reduce(function(acc,val){return acc.concat(val)}, []); 
});
const metadataPromise = d3.csv('../data/countries-metadata.csv', parseMetadata);
const geojsonPromise = d3.json('../data/countries.geojson');

Promise.all([dataPromise, metadataPromise, geojsonPromise])
	.then(function([data, metadata, geojson]){

		console.log(data)
		console.log(metadata)

		//let's say we want to group population by income group
		//"map" is a data structure for lookup, e.g. dictionary
		const metadataMap = d3.map(metadata, function(d){ return d.Code });

		data.forEach(function(d){
			if(metadataMap.get(d.countryCode)){
				const incomeGroup = metadataMap.get(d.countryCode)['Income Group'];
				d.incomeGroup = incomeGroup;
			}else{
				return;
			}
		});	

		//Group by year and then by income group
		//filter for only the indicator that we want, which is population total

		const filteredData = data.filter(function(d){
			return d.series === INDICATOR && d.year === YEAR
		}); //217 (217 x 1 x 1)

		const dataByIncomeGroup = d3.nest()
			.key(function(d){return d.incomeGroup})
			.entries(filteredData);

		//Use enter exit update to create 4 subplots
		const subplots = plot.selectAll('.treemap-plot')
			.data(dataByIncomeGroup);
		const subplotsEnter = subplots.enter()
			.append('g')
			.attr('class', 'treemap-plot')

		//selection.each
		subplots.merge(subplotsEnter)
			.each(function(d, i){
				//run 4 times, one for each incomeGroup
				//d ==> the data for each incomegroup
				//i ==> index
				//"this" ==> DOM element, i.e. <g>
				d3.select(this)
					.attr('transform', `translate(${(w/4 + 5)*i}, 0)`)
				drawTreemapChart(d, this);
			})




	});

function drawTreemapChart(data, rootDOM){

	//create hierarchy out of data
	const rootNode = d3.hierarchy({
		key:'root',
		values:data.values
	}, function(d){ return d.values}).sum(function(d){return d.value});

	//put it through treemap layout
	const treemap = d3.treemap()
		.size([w/4, h]);

	treemap(rootNode);

	//use enter exit update to draw
	const countryNode = d3.select(rootDOM)
		.selectAll('.country-node')
		.data(rootNode.descendants());
	const countryNodeEnter = countryNode.enter()
		.append('rect').attr('class', 'country-node');

	countryNode.merge(countryNodeEnter)
		.attr('x', function(d){ return d.x0 })
		.attr('y', function(d){ return d.y0 })
		.attr('width', d => d.x1 - d.x0)
		.attr('height', function(d){ return d.y1 - d.y0 })
		.style('fill-opacity', 0.05)
		.style('stroke', '#666')
		.style('stroke-width', '1px');

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