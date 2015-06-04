////////////////////////////////////////////////////////////// 
////////////// Step 4 - Final Comparison ///////////////////// 
////////////////////////////////////////////////////////////// 

function moveThreeToFour() {

	//Decrease size, decrease opacity then remove
	d3.selectAll(".finishCircle")
		.transition().duration(750)
		.attr("r", 0)
		.style("opacity", 0)
		.remove();

	//Slowly make all the step 3 elements disappear
	d3.selectAll(".stepThreeElements")
		.transition().duration(750)
		.style("opacity", 0);
	
	//Hide previous section and display the swing visuals
	setTimeout(function(d) {
		d3.selectAll(".stepThreeElements").style("display", "none");
		d3.select(".svgGreenFinishDot").remove();
		d3.selectAll(".stepFourElements")
			.style("opacity", 0)
			.style("display", "block")
			.transition().duration(750)
				.style("opacity", 1);
				
		//Call function for creation of radar chart
		setupComparison();		
	}, 750);
	
}

function setupComparison() {

	var RadarChart = {
	  draw: function(id, d, options){
		var cfg = {
		 radius: 5,
		 w: 600,
		 h: 600,
		 margin: {top: 20, right: 20, bottom: 20, left: 20},
		 factor: 1,
		 factorLegendX: 1,
		 factorLegendY: 1,
		 levels: 3,
		 maxValue: 0,
		 radians: 2 * Math.PI,
		 opacityArea: 0.5,
		 opacityCircles: 0.5,
		 strokeWidth: 1,
		 color: d3.scale.category10()
		};
		
		if('undefined' !== typeof options){
		  for(var i in options){
			if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
		  }//for i
		}//if
		cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		var allAxis = (d[0].map(function(i, j){return i.axis}));
		var total = allAxis.length;
		var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
		var Format = d3.format('%');
		d3.select(id).select("svg").remove();
		
		//Initiate the radar chart SVG
		var svg = d3.select(id).append("svg")
				.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
				.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
				.attr("class", "radar"+id);
		//Append a g element		
		var g = svg.append("g")
				.attr("transform", "translate(" + cfg.margin.left + "," + cfg.margin.top + ")");
		
		//Filter for the outside glow
		var filter = svg.append('defs').append('filter').attr('id','glow'),
			feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
			feMerge = filter.append('feMerge'),
			feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
			feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
		
		//The background circles as the grid
		var levelFactor = cfg.factor*radius/cfg.levels;
		var backgroundColors;
		g.selectAll(".levels")
		   .data(d3.range(1,(cfg.levels+1)).reverse())
		   .enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("transform", "translate(" + (cfg.w/2) + ", " + (cfg.h/2) + ")")
			.attr("r", function(d, i){return levelFactor*d;})
			.style("fill", "#CDCDCD")
			.style("opacity", cfg.opacityCircles)
			.style("filter" , "url(#glow)");

		//Create the straight lines radiating outward from the center
		var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
				.attr("class", "axis");
		//Append the lines
		axis.append("line")
			.attr("x1", cfg.w/2)
			.attr("y1", cfg.h/2)
			.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
			.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
			.attr("class", "line")
			.style("stroke", "white")
			.style("stroke-width", cfg.strokeWidth+"px");

		//Append the labels
		axis.append("text")
			.attr("class", "legend")
			.style("font-size", "11px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("transform", function(d, i){return "translate(0, -5)"})
			.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegendX*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
			.attr("y", function(d, i){return cfg.h/2*(1-cfg.factorLegendY*Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);})
			.text(function(d){return d})
			.call(wrap, 60);

		//The path functions for the blobs
		var path = d3.svg.line()
			.interpolate("cardinal-closed")
			.x(function(d) { return d[0]; })
			.y(function(d) { return d[1]; });
					
		var series = 0;
		d.forEach(function(y, x){
			dataValues = [];
			g.selectAll(".nodes")
				.data(y, function(j, i){
				  dataValues.push([
					cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
					cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
				  ]);
				});
			//Create the blobs	
			g.selectAll(".area")
				.data([dataValues])
				.enter()
				.append("path")
					.attr("class", "radar-chart-serie"+series)
					.style("stroke-width", "2px")
					.style("stroke", function(d) {						
						if (typeof(cfg.color) != "function") return cfg.color;
						else return cfg.color(series);
					})
					.attr("d", path)
					.style("fill", function(d) {
						if (typeof(cfg.color) != "function") return cfg.color;
						else return cfg.color(series);
					})
					.style("filter" , "url(#glow)")
					.style("fill-opacity", cfg.opacityArea)
					.on('mouseover', function (d){
						g.selectAll("path").transition(200)
							.style("fill-opacity", 0.1); 
						g.selectAll("path."+d3.select(this).attr("class")).transition(200)
							.style("fill-opacity", .7);
									  })
					 .on('mouseout', function(){
						g.selectAll("path").transition(200)
							.style("fill-opacity", cfg.opacityArea);
					 });
			series++;
		});

	  }//draw
	};


	var margin = {top: 100, right: 100, bottom: 100, left: 100},
		width = Math.min(700, $(".radarChart").width()) - margin.left - margin.right,
		height = width;
			
	////////////////////////////////////////////////////////////// 
	////////////////////////// Data ////////////////////////////// 
	////////////////////////////////////////////////////////////// 

	//The factor analysis values resulting from the SOM segments
	var somCAPs = [
		[//frontrunners
			{axis:'Ball Speed', value:5.5},
			{axis:'Club Speed', value:4.9},
			{axis:'Carry', value:5.3},
			{axis:'Side', value:3.4},
			{axis:'Attack Angle', value:6.3}
		],
		[//observers
			{axis:'Ball Speed', value:4.6},
			{axis:'Club Speed', value:6.2},
			{axis:'Carry', value:4.5},
			{axis:'Side', value:4.5},
			{axis:'Attack Angle', value:2.3}
		],
		[//defensive line
			{axis:'Ball Speed', value:2.3},
			{axis:'Club Speed', value:2.7},
			{axis:'Carry', value:4.0},
			{axis:'Side', value:5.1},
			{axis:'Attack Angle', value:4.8}
		]	
	];

	////////////////////////////////////////////////////////////// 
	////////////////////// Big Chart ///////////////////////////// 
	////////////////////////////////////////////////////////////// 

	var color = [peerGroupColor, "#004A95", "#81BC00"];
		
	var radarChartOptions = {
	  w: width,
	  h: height,
	  margin: margin,
	  maxValue: 7,
	  levels: 7,
	  factorLegendX: 0.9,
	  factorLegendY: 1.2,
	  opacityArea: 0.4,
	  opacityCircles: 0.3,
	  strokeWidth: 2,
	  color: function(d){return color[d];}
	};
	//Call function to draw the Radar chart
	RadarChart.draw(".radarChart", somCAPs, radarChartOptions);

		

}//setupComparison

