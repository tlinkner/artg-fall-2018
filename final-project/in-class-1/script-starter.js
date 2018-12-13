//This example demonstrates how you might import data from different sources

const dataPromise = d3.csv('../data/data-test.csv', parseData)
.then(function(rows){ 
	return rows.reduce(function(acc,val){return acc.concat(val)}, []); 
});
const metadataPromise = d3.csv('../data/countries-metadata.csv', parseMetadata);
const geojsonPromise = d3.json('../data/countries.geojson');

Promise.all([dataPromise, metadataPromise, geojsonPromise])
	.then(function([data, metadata, geojson]){

	});

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