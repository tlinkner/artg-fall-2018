// plot setup
const W = d3.select('.plot').node().clientWidth;
const H = d3.select('.plot').node().clientHeight;
const margin = {t: 200, r: 50, b: 50, l: 50};
const w = W - margin.l - margin.r;
const h = H - margin.t - margin.b;



// create svg
const svg = d3.select('.plot')
  .append('svg')
  .attr('width', W)
  .attr('height', H);



// set margins
const plot = svg.append('g')
  .attr('transform', `translate(${margin.l}, ${margin.t})`);



// create tooltip holder
const tooltip = d3.select("body")
	.append("div")
  .attr("class","tip")
	.style("position", "absolute")
	.style("z-index", "+1")
	.style("visibility", "hidden");

tooltip.append('div').attr("class","tip_label");
tooltip.append('div').attr("class","tip_value");


// create year label placeholder
const yearlabel = d3.select("h1")
  .append('span')
  .attr("id","year");
  



// import data
const dataPromise = d3.csv('data/data-forest-ag.csv', parseData)
//const dataPromise = d3.csv('./data/data-sa-forest.csv', parseData)
  .then(function(rows){ 
    return rows.reduce(function(acc,val){
      return acc.concat(val)
    }, []); 
  });



// import metadata
const metadataPromise = d3.csv('data/countries-metadata.csv', parseMetadata);



// data loaded
Promise.all([dataPromise, metadataPromise])
  .then(function ([data, metadata]) {

    // select eyar and remove empty region values
		const dataCleaned = data.filter(d => d.countryCode !='');
    
    // nest data by year then region and prepare data for pie
    const dataByYearByRegion = d3.nest()
      .key(d => d.year)
      .key(d => d.countryCode)
      .entries(dataCleaned)
      .map(function(y){ // year
        y.values.forEach(function(r){
          // set total area for use in scaling the pies
          r.totalArea = r.values[0].value;
          r.regionName = r.values[0].country;
          let forest = r.values.filter(d => d.seriesCode == "AG.LND.FRST.K2")[0].value;
          let ag = r.values.filter(d => d.seriesCode == "AG.LND.AGRI.K2")[0].value;
          let total = r.values.filter(d => d.seriesCode == "AG.LND.TOTL.K2")[0].value
          let newValues = [];
          newValues[0] = {
            'id': 'Other Land', 
            'value': total - ag - forest
          };
          newValues[1] = {
            'id':'Forest Land', 
            'value': r.values.filter(d => d.seriesCode == "AG.LND.FRST.K2")[0].value
          };
          newValues[2] = {
            'id':'Agiculture Land',
            'value': ag
          };
          r.values = newValues;
          return r;
        })
        return y;
      });
      
    // make list of years
    const myyears = d3.nest()
      .key(d => d.year)
      .entries(data)
      .map(y => y.key);  
      
    // draw inital plot
    drawPlotGrid(dataByYearByRegion[0].values,plot);
    d3.select('#year').text(dataByYearByRegion[0].key);
  
    // slider
    svg.append('g')
      .attr('class', 'slider')
      .attr('transform', `translate(${margin.l},60)`)
      .call(slider, w, myyears, function (value) {
        console.groupCollapsed('Slider callback');
        console.log(value);
        console.groupEnd();
        const indicatorsByYear = myfilterByYear(dataByYearByRegion, value);
        drawPlotGrid(indicatorsByYear,plot);
      });
    
});



// --------------------------------------------------------

function myfilterByYear(data, year) {
  let dataByYear = data.filter(d => +d.key === year);
  return dataByYear[0].values;
}



// --------------------------------------------------------

function slider(selection, w, values, callback) {

  const HEIGHT = 24;
  
  const scale = d3.scaleLinear()
    .domain([
      values[0], 
      values[values.length - 1]
    ])
    .range([0, w]);
  
  selection.append('line')
    .attr('class', 'slider_range')
    .attr('x1', 0).attr('x2', w)
    .attr('y1', HEIGHT / 2)
    .attr('y2', HEIGHT / 2);
    
  const ticks = selection.selectAll('.slider_tick')
    .data(values)
    .enter()
    .append('circle')
    .attr('class', 'slider_tick')
    .attr('cx', d => scale(d))
    .attr('cy', HEIGHT / 2)
    .attr('r', HEIGHT / 4)
    
  const handle = selection
    .append('circle')
    .attr('class', 'slider_handle')
    .attr('r', HEIGHT / 2 + 3)
    .attr('cx', 0)
    .attr('cy', HEIGHT / 2);

  const dragBehavior = d3.drag()
    .on('start', handleDragStart)
    .on('drag', handleDrag)
    .on('end', handleDragEnd);
    
  handle.call(dragBehavior);

  function handleDragStart() {
    handle.classed("active", true);
  }

  function handleDrag() {
    let pos = d3.mouse(this)[0]
    if (pos < 0) {
      x = 0;
    } else if (pos > w) {
      x = w;
    } else {
      x = pos;
    }
    handle.attr('cx', x);
  }

  function handleDragEnd() {
    const year = Math.round(scale.invert(x));
    let pos = d3.mouse(this)[0];
    let y = d3.select("#year")
    if (pos < 0) {
      x = 0;
    } else if (pos > w) {
      x = w;
    } else {
      x = pos;
    }
    y.text(year)
    handle.attr('cx', scale(year));
    handle.classed("active", false);
    callback(year);
  }
}





// --------------------------------------------------------

function drawPlotGrid(data, domSelection) {

  console.group('drawPlotGrid');
  
  // maximum pie size
  const maxPieDaimeter = w/4;

  // scale for pie chart radius
  const extent = d3.extent(data, d => d.totalArea);
  const scaleRadius = d3.scaleSqrt()
    .domain(extent)
    .range([0,maxPieDaimeter]);

  // grid setup
  const offset = maxPieDaimeter / 2;
  const colNumber = 4;
  const colWidth = w / 4; // divide plot
  const rowHeight = maxPieDaimeter;
  let x = 0;
  let y = 0;
  
  // enter/update/exit
	// update
	const nodesUpdate = plot.selectAll('.pie')
		.data(data);
		
	// enter: append
	const nodesEnter = nodesUpdate.enter()
    .append('g')
    .attr('class', 'pie');
    
  nodesEnter.append('text')
    .attr('class', 'region-label');
		
	// enter and update: attr
	nodesUpdate.merge(nodesEnter)
    .each(function(d, i){
      // layout the grid
      x = (i % colNumber === 0) ? 0 : (x + colWidth);
      y = (i > 0 && i % colNumber === 0) ? (y + rowHeight + 30) : y;
      d3.select(this)
        .attr('transform', `translate(${x + offset}, ${y + offset})`)
        .attr('data-i',i)
      drawPie(d, scaleRadius(d.totalArea)/2 - 20, this);
    })
    .select('.region-label')
    .text(d=>d.regionName)
		.attr('transform',`translate(${-offset},${-offset})`);
    
	// Exit
	const nodesExit = nodesUpdate.exit()
		.remove();
    
  console.groupEnd();
		
}




// ========================================================

function drawPie(data, radius, rootDOM){

  console.groupCollapsed('drawPie');
    // console.log(data);

  // select the subplot
  const subplot = d3.select(rootDOM);
  // console.log(data.key);
  // console.log(data.values);
  
 	// pie function
	const pie = d3.pie()
		.value(d => d.value)
    .sort(null);
    
  let colorScale = d3.scaleOrdinal()
    .range(["slategrey", "limegreen", "khaki"]);
    
  // transform data
	const dataTransformed = pie(data.values);
  // console.log(dataTransformed);

  // arc function
	const arc = d3.arc()
		.innerRadius(0)
		.outerRadius(radius);
    
    // why is there a negative radius?
    console.log(radius);
    
	// Update
	const nodesUpdate = subplot.selectAll('.arc')
		.data(dataTransformed);
		
	// Enter: append
	const nodesEnter = nodesUpdate.enter()
    .append('path')
  
	// Enter and Update: attr
	nodesUpdate.merge(nodesEnter)
    .attr('class', 'arc')
		.attr('d', function(datum){
      console.log(datum);
      console.log(arc(datum));
      return arc(datum);
    })
		.attr('fill', function(d, i){
			return colorScale(i);
		})
    .on("mouseover", function(d){
      d3.select('.tip_label').text(d.data.id);
      d3.select('.tip_value').text(d.data.value);    
      return tooltip
        .style("visibility", "visible");
    })
    .on("mousemove", function(d){
      return tooltip
        .style("top", (event.pageY-10)+"px")
        .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function(d){
      return tooltip
        .style("visibility", "hidden");
    });
    
		
	// Exit
	const nodesExit = nodesUpdate.exit()
		.remove();    
    
  console.groupEnd();

}




// ========================================================

function parseData(d) {
  const country = d['Country Name'];
  const countryCode = d['Country Code'];
  const series = d['Series Name'];
  const seriesCode = d['Series Code'];
  delete d['Country Name'];
  delete d['Country Code'];
  delete d['Series Name'];
  delete d['Series Code'];
  const records = [];
  for (key in d) {
    records.push({
      country: country
      , countryCode: countryCode
      , series: series
      , seriesCode: seriesCode
      , year: +key.split(' ')[0]
      , value: d[key] === '..' ? null : +d[key]
    })
  }
  return records;
}




// ========================================================

function parseMetadata(d) {
  return d;
}




