//Please read documentation here:
//https://github.com/d3/d3-hierarchy
console.log("Week 10: visualizing hierarchical data");

//Import data using d3.json: note similarity to d3.csv
const margin = {t:50, r:50, b:50, l:50};
const json = d3.json('./flare.json');
const depthScale = d3.scaleOrdinal()
	.domain([0,1,2,3,4])
	.range([null, 'red', '#03afeb', 'yellow', 'green']);

//Bonus content: tooltip
//Append DOM for tooltip
const tooltip = d3.select('.container')
	.append('div')
	.attr('class','tooltip')
	.style('position', 'absolute')
	.style('width', '180px')
	.style('min-height', '50px')
	.style('background', '#333')
	.style('color', 'white')
	.style('padding', '15px')
	.style('opacity', 0);
tooltip.append('p').attr('class', 'key');
tooltip.append('p').attr('class', 'value')

function enableTooltip(selection){
	selection
		.on('mouseenter', function(d){
			const xy = d3.mouse(d3.select('.container').node());
			tooltip
				.style('left', xy[0]+'px')
				.style('top', xy[1] + 20 +'px')
				.transition()
				.style('opacity', 1);
			tooltip
				.select('.key')
				.html(d.data.name);
			tooltip
				.select('.value')
				.html(d.value);
		})
		.on('mouseleave', function(d){
			tooltip
				.style('opacity',0);
		});
}

json.then(function(data){

	//Note the repeating structure of this data
  // console.log(data);

	//Data transformation:
	//Need to convert this into a d3-hierarchy object before further transformation
	const rootNode = d3.hierarchy(data)
		.sum(function(d){ return d.value });

	//After this data transformation, we can produce a few different visualizations based on hierarchical data
	renderCluster(rootNode, document.getElementById('cluster'));
	renderTree(rootNode, document.getElementById('tree'));
	renderTree(rootNode, document.getElementById('tree-radial'), true);
	renderPartition(rootNode, document.getElementById('partition'));
	renderTreemap(rootNode, document.getElementById('treemap'));
	renderPack(rootNode, document.getElementById('pack'));

})

function renderCluster(rootNode, rootDOM){

  console.group('Cluster');
//  console.log(rootNode);
//  console.log(rootNode.descendants());

	const W = rootDOM.clientWidth;
	const H = rootDOM.clientHeight;
	const w = W - margin.l - margin.r;
	const h = H - margin.t - margin.b;

	const plot = d3.select(rootDOM)
		.append('svg')
		.attr('width', W)
		.attr('height', H)
		.append('g')
		.attr('transform', `translate(${margin.l}, ${margin.t})`);

  const clusterTransform = d3.cluster().size([w,h]);
  const dataTransformed = clusterTransform(rootNode);
  const nodesData = dataTransformed.descendants();
  const nodesLinks = dataTransformed.links();
  
	// Update
	const nodes = plot.selectAll('.node')
			.data(nodesData);
  const links = plot.selectAll('.link')
    .data(nodesLinks);
		
	// Enter 
  const nodesEnter = nodes.enter()
		.append('g')
		.attr('class','node');
		nodesEnter.append('circle');
		nodesEnter.append('text');
    
  const linksEnter = links.enter()
    .insert('line', '.node')
    .attr('class', 'link');
		
	// Enter and Update -- only safe to append to enter
  // Update only for upating attributes
  nodesEnter.merge(nodes)
    .attr('transform', function(d){
      return `translate(${d.x}, ${d.y})`
    })
    .select('circle')
    .attr('r',5)
    .style('fill', function(d){
				return depthScale(d.depth);
    });
  nodesEnter.merge(nodes)
    .filter(function(d){
      return d.depth < 2; 
    })
    .select('text')
    .text(function(d){
      return `${d.data.name} : ${d.value}`;
    });
    
  linksEnter.merge(links)
    .attr('x1', function(d){ return d.source.x })
    .attr('x2', function(d){ return d.target.x })
    .attr('y1', function(d){ return d.source.y })
    .attr('y2', function(d){ return d.target.y });
		
	// Exit
	const nodesExit = nodes.exit()
		.remove();

  // console.log(nodesData);
  // console.log(nodesLinks);

  console.groupEnd();
}

function renderTree(rootNode, rootDOM, radial){

	const W = rootDOM.clientWidth;
	const H = rootDOM.clientHeight;
	const w = W - margin.l - margin.r;
	const h = H - margin.t - margin.b;

	const plot = d3.select(rootDOM)
		.append('svg')
		.attr('width', W)
		.attr('height', H)
		.append('g')
		.attr('class','plot')
		.attr('transform', `translate(${margin.l}, ${margin.t})`);

	console.group('Tree');

	const treeTransform = d3.tree()
		.size([w, h]);

	const treeData = treeTransform(rootNode);
	const nodesData = treeData.descendants();
	const linksData = treeData.links();
  //	console.log(rootNode);
  //	console.log(nodesData);
  //	console.log(linksData);

	if(!radial){

		//Draw nodes
		const nodes = plot.selectAll('.node')
			.data(nodesData);
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
			.filter(function(d){ return d.depth < 2})
			.select('text')
			.text(function(d){ return `${d.data.name}: ${d.value}`})
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
			.attr('y2', function(d){ return d.target.y });

	}else{
		//If "radial" parameter is true, render this as a radial tree

		function polarToCartesian(angle, r){
			return [r * Math.cos(angle), r * Math.sin(angle)]
		}

		//Translate center of coordinate system
		plot
			.attr('transform', `translate(${W/2}, ${H/2})`);

		//Draw nodes
		const nodes = plot.selectAll('.node')
			.data(nodesData);
		const nodesEnter = nodes.enter()
			.append('g')
			.attr('class','node');
		nodesEnter.append('circle');
		nodesEnter.append('text');

		nodesEnter.merge(nodes)
			.attr('transform', function(d){
				const cartesian = polarToCartesian(d.x/w*Math.PI*2, d.y/2);
				return `translate(${cartesian[0]}, ${cartesian[1]})`
			})
			.select('circle')
			.attr('r', 4)
			.style('fill', function(d){
				return depthScale(d.depth);
			});

		nodesEnter.merge(nodes)
			.filter(function(d){ return d.depth < 2})
			.select('text')
			.text(function(d){ return `${d.data.name}: ${d.value}`})
			.attr('dx', 6);

		//Draw links
		const links = plot.selectAll('.link')
			.data(linksData);
		const linksEnter = links.enter()
			.insert('line', '.node')
			.attr('class', 'link');
		linksEnter.merge(links)
			.each(function(d){
				const source = polarToCartesian(d.source.x/w*Math.PI*2, d.source.y/2);
				const target = polarToCartesian(d.target.x/w*Math.PI*2, d.target.y/2);

				d3.select(this)
					.attr('x1', function(d){ return source[0] })
					.attr('x2', function(d){ return target[0] })
					.attr('y1', function(d){ return source[1] })
					.attr('y2', function(d){ return target[1] });
			})
	}


	console.groupEnd();

}

function renderPartition(rootNode, rootDOM){

  console.group("Partition")
  
	const W = rootDOM.clientWidth;
	const H = rootDOM.clientHeight;
	const w = W - margin.l - margin.r;
	const h = H - margin.t - margin.b;
  
	const plot = d3.select(rootDOM)
		.append('svg')
		.attr('width', W)
		.attr('height', H)
		.append('g')
		.attr('transform', `translate(${margin.l}, ${margin.t})`);

  const partitionTransform = d3.partition()
    .size([w,h]);
    //.padding();
  const dataTransformed = partitionTransform(rootNode);
  // actuall editing the same object, that is why x and y in addion to x1, x0
  // be careful when editing same object from multiple functions
  const nodesData = dataTransformed.descendants();
  const nodesLinks = dataTransformed.links();
  
  console.log(nodesData);
  
	// Update
	const nodes = plot.selectAll('.node')
			.data(nodesData);
		
	// Enter
  const nodesEnter = nodes.enter()
		.append('g')
		.attr('class','node')
    .on('mouseenter', function(d){
        d3.select(this)
          .select('rect')
          .style('fill-opacity',1);
    })
    .on('mouseleave', function(d){
        d3.select(this)
          .select('rect')
          .style('fill-opacity',0.5);
    });
    

    nodesEnter.append('rect');
		nodesEnter.append('text');
		
	// Enter and Update
  nodesEnter.merge(nodes)
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
				return depthScale(d.depth);
    });
		
  nodesEnter.merge(nodes)
    .filter(function(d){
      return d.depth < 2; 
    })
    .select('text')
    .text(function(d){
      return `${d.data.name} : ${d.value}`;
    })
    .attr('x', function(d){return (d.x1 - d.x0)/ 2;})
    .attr('y', function(d){return (d.y1 - d.y0)/ 2;})
    .attr('text-anchor','middle');


  // hover smaller nodes
  
  
    
	// Exit
	const nodesExit = nodes.exit()
		.remove();

  

  
  console.groupEnd();
}

function renderTreemap(rootNode, rootDOM){

	const W = rootDOM.clientWidth;
	const H = rootDOM.clientHeight;
	const w = W - margin.l - margin.r;
	const h = H - margin.t - margin.b;

	const plot = d3.select(rootDOM)
		.append('svg')
		.attr('width', W)
		.attr('height', H)
		.append('g')
		.attr('class','plot')
		.attr('transform', `translate(${margin.l}, ${margin.t})`);

	console.group('TreeMap');
  
	const treeTransform = d3.treemap() // 
		.size([w, h]);
	const treeData = treeTransform(rootNode);
	const nodesData = treeData.descendants();
	const linksData = treeData.links();
  
  console.log(nodesData);

	// Update
	const nodesUpdate = plot.selectAll('.node')
		.data(nodesData);
		
	// Enter
	const nodesEnter = nodesUpdate.enter()
    .append('g')
    .attr('class','node');
  nodesEnter.append('rect');
  nodesEnter.append('text');
		
	// Enter and Update
	nodesUpdate.merge(nodesEnter)
    .attr('transform', function(d){
      return `translate(${d.x0}, ${d.y0})`
    })
    .select('rect')
    .attr('width',function(d){return d.x1 - d.x0;})
    .attr('height',function(d){return d.y1 - d.y0;})
		.style('fill', function(d){
			return depthScale(d.depth);
		})
		.style('fill-opacity', 1);
    
	nodesUpdate.merge(nodesEnter)
		.select('text')
		.text(function(d){ return `${d.data.name}: ${d.value}`});

	// Exit
	const nodesExit = nodesUpdate.exit()
		.remove();

  console.groupEnd();
}

function renderPack(rootNode, rootDOM){

	const W = rootDOM.clientWidth;
	const H = rootDOM.clientHeight;
	const w = W - margin.l - margin.r;
	const h = H - margin.t - margin.b;

	const plot = d3.select(rootDOM)
		.append('svg')
		.attr('width', W)
		.attr('height', H)
		.append('g')
		.attr('class','plot')
		.attr('transform', `translate(${margin.l}, ${margin.t})`);

	console.group('Pack');
  console.log("hi");
  
	const treeTransform = d3.pack() // 
		.size([w, h]);
	const treeData = treeTransform(rootNode);
	const nodesData = treeData.descendants();
	const linksData = treeData.links();
  
  console.log(nodesData);

	// Update
	const nodesUpdate = plot.selectAll('.node')
		.data(nodesData);
		
	// Enter
	const nodesEnter = nodesUpdate.enter()
    .append('g')
    .attr('class','node');
  nodesEnter.append('circle');
  nodesEnter.append('text');
		
	// Enter and Update
	nodesUpdate.merge(nodesEnter)
    .attr('transform', function(d){
      return `translate(${d.x}, ${d.y})`
    })
    .select('circle')
    .attr('r',function(d){return d.r;})
		.style('fill', function(d){
			return depthScale(d.depth+1);
		})
		.style('fill-opacity', 1);
    
	// Exit
	const nodesExit = nodesUpdate.exit()
		.remove();

  console.groupEnd();
}


// Bonus radial partition
// d3.arc

// Do treemap layout
// pack layout
// 
