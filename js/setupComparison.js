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

	////////////////////////////////////////////////////////////// 
	/////////////// Calculate averages of swings ///////////////// 
	////////////////////////////////////////////////////////////// 
	var avgs = d3.nest()
		.rollup(function(d) {
			return {
				AttackAngle: d3.mean(d,function(g) {return g.AttackAngle;}),
				BallSpeed: d3.mean(d,function(g) {return g.BallSpeed;}),
				Carry: d3.mean(d,function(g) {return g.Carry;}),
				ClubSpeed: d3.mean(d,function(g) {return g.ClubSpeed;}),
				Side: d3.mean(d,function(g) {return g.Side;})
			}
		})
		.entries(data);	
		
	//Adjust the numbers on the screen
	d3.select(".golferBallSpeed").text(Math.round(avgs.BallSpeed));
	d3.select(".golferClubSpeed").text(Math.round(avgs.ClubSpeed));
	d3.select(".golferAttackAngle").text(Math.round(avgs.AttackAngle*100)/100);
	d3.select(".golferCarry").text(Math.round(avgs.Carry));
	d3.select(".golferSide").text(Math.round(avgs.Side));

	////////////////////////////////////////////////////////////// 
	/////////////////// Initiate Radar chart ///////////////////// 
	////////////////////////////////////////////////////////////// 
	
	var margin = {top: 80, right: 80, bottom: 80, left: 80},
		width = Math.min(600, $(".radarChart").width(), $(window).height()-515) - margin.left - margin.right,
		height = width;

	//Initiate the radar chart SVG
	var svg = d3.select(".radarChart").append("svg")
				.attr("width",  width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("class", "radar radarChart");	

	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = svg.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
		
	//Filter for the outside glow
	var filterS = svg.append('defs').append('filter').attr('id','glowSmall'),
		feGaussianBlurS = filterS.append('feGaussianBlur').attr('stdDeviation','1.5').attr('result','coloredBlur'),
		feMergeS = filterS.append('feMerge'),
		feMergeNodeS_1 = feMergeS.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNodeS_2 = feMergeS.append('feMergeNode').attr('in','SourceGraphic');
	////////////////////////////////////////////////////////////// 
	/////////////////// Radar chart function ///////////////////// 
	////////////////////////////////////////////////////////////// 
	var RadarChart = {
	  draw: function(id, d, options){
		var cfg = {
		 radius: 4,
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
		
		/////////////////////////////////////////////////////////
		//////////// Create the container SVG and g /////////////
		/////////////////////////////////////////////////////////
		
		//Append a g element		
		var g = svg.append("g")
				.attr("transform", "translate(" + cfg.margin.left + "," + cfg.margin.top + ")");

		/////////////////////////////////////////////////////////
		/////////////// Draw the Circular grid //////////////////
		/////////////////////////////////////////////////////////
		
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

		/////////////////////////////////////////////////////////
		/////////////////// Draw the labels /////////////////////
		/////////////////////////////////////////////////////////
		
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
	
		/////////////////////////////////////////////////////////
		///////////// Draw the radar chart blobs ////////////////
		/////////////////////////////////////////////////////////
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
		
		/////////////////////////////////////////////////////////
		/////// Draw the circles at the exact positions /////////
		/////////////////////////////////////////////////////////
		//Circles
		var series = 0;
		d.forEach(function(y, x){
			g.selectAll(".nodes")
				.data(y).enter()
				.append("svg:circle")
				.attr("class", "radar-chart-serie"+series)
				.attr('r', cfg.radius)
				.attr("alt", function(j){return Math.max(j.value, 0)})
				.attr("cx", function(j, i){
					dataValues.push([
						cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
						cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
					]);
					return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
				})
				.attr("cy", function(j, i){
					return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
				})
				.attr("data-id", function(j){return j.axis})
				.style("fill", function(d) {
					if (typeof(cfg.color) != "function") return cfg.color;
					else return cfg.color(series);
				})
				.style("fill-opacity", .9);

		  series++;
		});
	
	  }//draw
	};//RadarChart
			
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
	/////////// Call the creation of the radar chart ///////////// 
	////////////////////////////////////////////////////////////// 

	var color = [peerGroupColor, "#004A95", "#81BC00"];
		
	var radarChartOptions = {
	  w: width,
	  h: height,
	  margin: margin,
	  maxValue: 7,
	  levels: 7,
	  factorLegendX: 0.9,
	  factorLegendY: 1,
	  opacityArea: 0.35,
	  opacityCircles: 0.3,
	  strokeWidth: 2,
	  color: function(d){return color[d];}
	};
	//Call function to draw the Radar chart
	RadarChart.draw(".radarChart", somCAPs, radarChartOptions);

	////////////////////////////////////////////////////////////// 
	////////////////////// Make a legend ///////////////////////// 
	////////////////////////////////////////////////////////////// 
	
	var legendWrapper = svg
		.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(" + (10) + "," + (margin.top + height + margin.bottom - 70) + ")");
		
	//Initiate Legend	
	var legend = legendWrapper.append("g")
		.attr("class", "legend");
	//Create colour squares
	legend.selectAll("circle")
	  .data(["#81BC00", "#004A95", peerGroupColor])
	  .enter().append("circle")
	  .attr("cx", 0)
	  .attr("cy", function(d, i){ return i * 25;})
	  .attr("r", 8)
	  .style("opacity", 0.8)
	  .style("filter" , "url(#glowSmall)")
	  .style("fill", function(d){ return d;});
	//Create text next to squares
	legend.selectAll("text")
	  .data(["Jij", "Pro <<naam>>", "Referentie groep"])
	  .enter().append("text")
	  .attr("x", 25)
	  .attr("y", function(d, i){ return i * 25;})
	  .attr("dy", "0.38em")
	  .attr("font-size", "12px")
	  .text(function(d) { return d; });			
}//setupComparison

