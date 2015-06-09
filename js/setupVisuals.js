////////////////////////////////////////////////////////////// 
//////////////// Step 3 - Actual Visuals ///////////////////// 
////////////////////////////////////////////////////////////// 

//Small intermediary function to move between the peer group view and actual visuals view
function moveTwoToThree() {

	//Decrease size, decrease opacity then remove
	d3.selectAll(".submitCircle")
		.transition().duration(750)
		.attr("r", 0)
		.style("opacity", 0)
		.remove();

	d3.selectAll(".stepTwoElements")
		.transition().duration(750)
		.style("opacity", 0);
		
	//Hide previous section and display the swing visuals
	setTimeout(function(d) {
		d3.selectAll(".stepTwoElements").style("display", "none");
		d3.select(".greenSubmitDot").remove();
		d3.selectAll(".stepThreeElements")
			.style("opacity", 0)
			.style("display", "block")
			.transition().duration(750)
				.style("opacity", 1);
				
		setupVisuals();		
	}, 750);

}//moveTwoToThree	

//Create a small pulsating circle
function pulseCircle(wrapper) {
		var circle = wrapper.selectAll(".pulseCircle");
		(function repeat() {
			circle = circle.transition("pulse")
				.duration(2000)
				.attr("r", 15)
				//.style("opacity", 0.3)
				.transition()
				.duration(2000)
				.attr("r", 0)
				//.style("opacity", 1)
				.each("end", repeat);
		})();
}//pulseCircle

////////////////////////////////////////////////////////////// 
/////////////// Step 3 - Global variables //////////////////// 
////////////////////////////////////////////////////////////// 
var numSwings = 0; //The swing number we are at	
var paddingBetween = 0;

var	marginBallSpeed,
	widthBallSpeed,
	heightBallSpeed,
	ballSpeedScale,
	ballSpeedAxis,
	ballSpeed;
	
var	marginClubSpeed,
	widthClubSpeed,
	heightClubSpeed,
	clubSpeedScale,
	clubSpeedAxis,
	clubSpeed;

var	marginCarry,
	widthCarry,
	heightCarry,
	carryScale,
	carryAxis,
	carry;

var	marginAoA,
	widthAoA,
	heightAoA,
	AoAScale,
	AoA;
var lineLength;
	
var chosenPeerGroup,
	meanClubSpeed = 0,
	meanBallSpeed = 0,
	meanAoA = 0,
	meanCarry = 0,
	meanSide = 0,
	meanTriangle = 0,
	stdClubSpeed = 0,
	stdBallSpeed = 0,
	stdAoA = 0,
	stdCarry = 0,
	stdSide = 0;
	
	
//Set up all the 4 charts (without any data shown yet)
function setupVisuals() {

	//Dummy method to simulate swings 
	d3.select("body").on("click", function(d) {
		numSwings++; 
		
		d3.select(".stepThreeTitle").transition().duration(500)
			.style("opacity", 0)
			.each("end", function(d) { d3.select(".stepThreeTitle").text("Verwerken van slag " + numSwings) })
			.transition().duration(500)
			.style("opacity", 1);
			
		redrawSwing(numSwings);  
	})
	
	//Define the peer group means
	chosenPeerGroup = peerGroup.filter(function(d) { return d.Age === peerGroupAge & d.Gender ===	peerGroupGender & d.Handicap === peerGroupHandicap; });
	if (chosenPeerGroup.length > 0) {
		meanClubSpeed = chosenPeerGroup[0].Mean;
		meanBallSpeed = chosenPeerGroup[1].Mean;
		meanAoA = chosenPeerGroup[2].Mean;
		meanCarry = chosenPeerGroup[3].Mean;
		meanSide = chosenPeerGroup[4].Mean;
		meanTriangle = Math.sqrt(meanCarry*meanCarry - meanSide*meanSide);
		
		stdClubSpeed = chosenPeerGroup[0].StdDev;
		stdBallSpeed = chosenPeerGroup[1].StdDev;
		stdAoA = chosenPeerGroup[2].StdDev;
		stdCarry = chosenPeerGroup[3].StdDev;
		stdSide = chosenPeerGroup[4].StdDev;
	}//if
			
	////////////////////////////////////////////////////////////// 
	////////////////////// Ball Speed //////////////////////////// 
	////////////////////////////////////////////////////////////// 

	marginBallSpeed = {top: 30, right: 50, bottom: 30, left: 50};
	widthBallSpeed = $(".chart.ballSpeed").width() - marginBallSpeed.left - marginBallSpeed.right - paddingBetween;
	heightBallSpeed = 60;
		
	//Create axes for the Ball Speed chart
	ballSpeedScale = d3.scale.linear().domain([0, 185]).range([0, widthBallSpeed]);
	ballSpeedAxis = d3.svg.axis().scale(ballSpeedScale).orient("bottom").tickSize(5).outerTickSize(0).tickFormat(d3.format("d"));
		
	//Create Ball Speed SVG
	ballSpeed = d3.select(".chart.ballSpeed").append("svg")
		.attr("width", widthBallSpeed + marginBallSpeed.left + marginBallSpeed.right)
		.attr("height", heightBallSpeed + marginBallSpeed.top + marginBallSpeed.bottom)
	  .append("g")
		.attr("class", "ballSpeedWrapper")
		.style("filter", "url(#gooBallSpeed)")
		.attr("transform", "translate(" + marginBallSpeed.left + "," + marginBallSpeed.top + ")");
		
	//Append x axis to chart
	ballSpeed.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + 30 + ")")
	  .call(ballSpeedAxis);

	//SVG filter for the gooey effect
	var defsBallSpeed = ballSpeed.append('defs');
	var filterBallSpeed = defsBallSpeed.append('filter').attr('id','gooBallSpeed');
	filterBallSpeed.append('feGaussianBlur')
		.attr('in','SourceGraphic')
		.attr('stdDeviation','10')
		.attr('result','blur');
	filterBallSpeed.append('feColorMatrix')
		.attr('in','blur')
		.attr('mode','matrix')
		.attr('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
		.attr('result','goo');
	filterBallSpeed.append('feBlend')
		.attr('in','SourceGraphic')
		.attr('in2','goo');
		
	//Append small bar for peer group average
	if (chosenPeerGroup.length > 0) {
		ballSpeed.append("line")
			.attr("class", "meanBallSpeedLine")
			.attr("x1", ballSpeedScale(meanBallSpeed))
			.attr("y1", -15)
			.attr("x2", ballSpeedScale(meanBallSpeed))
			.attr("y2", 15)
			.style("stroke-width", "4")
			.style("shape-rendering", "crispEdges")
			.style("stroke", peerGroupColor);		
	}//if
	
	//Append circle at starting point
	ballSpeed.append("circle")
			.attr("class", "startCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 10)
			.style("fill", "#81BC00");

	//Append pulsating circle for previous strike
	ballSpeed.append("circle")
			.attr("class", "pulseCircle")
			.attr("r", 0)
			.attr("cx", 0)
			.attr("cy", 0)
			.style("opacity", 0.4)
			.style("fill", "#81BC00")
			.each(function(d) { pulseCircle(ballSpeed); });		
			
	////////////////////////////////////////////////////////////// 
	////////////////////// Club Speed //////////////////////////// 
	////////////////////////////////////////////////////////////// 

	marginClubSpeed = {top: 30, right: 50, bottom: 30, left: 50};
	widthClubSpeed = $(".chart.clubSpeed").width() - marginClubSpeed.left - marginClubSpeed.right - paddingBetween;
	heightClubSpeed = 60;
		
	//Create axes for the Club Speed chart
	clubSpeedScale = d3.scale.linear().domain([0, 125]).range([0, widthClubSpeed]);
	clubSpeedAxis = d3.svg.axis().scale(clubSpeedScale).orient("bottom").tickSize(5).outerTickSize(0).tickFormat(d3.format("d"));
		
	//Create Club Speed SVG
	clubSpeed = d3.select(".chart.clubSpeed").append("svg")
		.attr("width", widthClubSpeed + marginClubSpeed.left + marginClubSpeed.right)
		.attr("height", heightClubSpeed + marginClubSpeed.top + marginClubSpeed.bottom)
	  .append("g")
		.attr("class", "clubSpeedWrapper")
		.style("filter", "url(#gooClubSpeed)")
		.attr("transform", "translate(" + marginClubSpeed.left + "," + marginClubSpeed.top + ")");
		
	//Append x axis to chart
	clubSpeed.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + 30 + ")")
	  .call(clubSpeedAxis);
	
	//SVG filter for the gooey effect
	var defsClubSpeed = clubSpeed.append('defs');
	var filterClubSpeed = defsClubSpeed.append('filter').attr('id','gooClubSpeed');
	filterClubSpeed.append('feGaussianBlur')
		.attr('in','SourceGraphic')
		.attr('stdDeviation','10')
		.attr('result','blur');
	filterClubSpeed.append('feColorMatrix')
		.attr('in','blur')
		.attr('mode','matrix')
		.attr('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
		.attr('result','goo');
	filterClubSpeed.append('feBlend')
		.attr('in','SourceGraphic')
		.attr('in2','goo');

	//Append small bar for peer group average
	if (chosenPeerGroup.length > 0) {
		clubSpeed.append("line")
			.attr("class", "meanClubSpeedLine")
			.attr("x1", clubSpeedScale(meanClubSpeed))
			.attr("y1", -15)
			.attr("x2", clubSpeedScale(meanClubSpeed))
			.attr("y2", 15)
			.style("stroke-width", "4")
			.style("shape-rendering", "crispEdges")
			.style("stroke", peerGroupColor);
	}//if
	
	//Append circle at starting point
	clubSpeed.append("circle")
			.attr("class", "startCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 10)
			.style("fill", "#81BC00");	 
			
	//Append pulsating circle for previous strike
	clubSpeed.append("circle")
			.attr("class", "pulseCircle")
			.attr("r", 0)
			.attr("cx", 0)
			.attr("cy", 0)
			.style("fill", "#81BC00")
			.style("opacity", 0.4)
			.each(function(d) { pulseCircle(clubSpeed); });		

	////////////////////////////////////////////////////////////// 
	///////////////////// Carry & Side /////////////////////////// 
	////////////////////////////////////////////////////////////// 

	//Margins and dimensions
	marginCarry = {top: 30, right: 50, bottom: 30, left: 50};
	widthCarry = $(".chart.carry").width() - marginCarry.left - marginCarry.right - paddingBetween;
	heightCarry = 240;
		
	//Create axes for the chart
	carryScale = d3.scale.linear().domain([0, 290]).range([0, widthCarry]);
	carryAxis = d3.svg.axis().scale(carryScale).orient("bottom").tickSize(5).outerTickSize(0).tickFormat(d3.format("d"));
		
	//Create SVG
	carry = d3.select(".chart.carry").append("svg")
		.attr("width", widthCarry + marginCarry.left + marginCarry.right)
		.attr("height", heightCarry + marginCarry.top + marginCarry.bottom)
	  .append("g")
		.attr("class", "carryWrapper")
		.style("filter", "url(#gooCarry)")
		.attr("transform", "translate(" + marginCarry.left + "," + (marginCarry.top + heightCarry/2)  + ")");
		
	//Append x axis to chart
	carry.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + 130 + ")")
	  .call(carryAxis);
	  
	//Append zero line to chart 
	carry.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", widthCarry)
		.attr("y2", 0)
		.style("stroke-dasharray", "3 3")
		.style("shape-rendering", "crispEdges")
		.style("stroke", "#D3D3D3");

	//SVG filter for the gooey effect
	var defsCarry = carry.append('defs');
	var filterCarry = defsCarry.append('filter').attr('id','gooCarry');
	filterCarry.append('feGaussianBlur')
		.attr('in','SourceGraphic')
		.attr('stdDeviation','10')
		.attr('result','blur');
	filterCarry.append('feColorMatrix')
		.attr('in','blur')
		.attr('mode','matrix')
		.attr('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
		.attr('result','goo');
	filterCarry.append('feBlend')
		.attr('in','SourceGraphic')
		.attr('in2','goo');
		
	//Append two diamonds for the average of the peer group
	if (chosenPeerGroup.length > 0) {
		carry.selectAll(".meanCarrySymbol")
			.data([-1,1])
			.enter().append("path")
			.attr("class", "meanCarrySymbol")
			.attr("d", d3.svg.symbol().size(50).type("diamond"))
			.attr("transform", function(d) { return "translate(" + carryScale(meanTriangle)  + ", " + (d*carryScale(meanSide)) + ")"; })    
			.style("fill", peerGroupColor);
	}//if
	
	//Append line for the Side dash
	carry.append("line")
			.attr("class", "sideLine")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 0)
			.style("stroke-dasharray", "3 3")
			.style("fill", "none")
			.style("stroke", "#6B6B6B");	
	//Append text for the Side number
	carry.append("text")
			.attr("class", "sideText")
			.attr("x", 0)
			.attr("y", 0)
			.style("fill", "#292929")
			.text("");
						
	//Append line for the Carry dash
	carry.append("line")
			.attr("class", "carryLine")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 0)
			.style("stroke-dasharray", "3 3")
			.style("fill", "none")
			.style("stroke", "#6B6B6B");	
	//Append text for the Carry number
	carry.append("text")
			.attr("class", "carryText")
			.attr("x", 0)
			.attr("y", 0)
			.style("fill", "#292929")
			.style("text-anchor", "end")
			.text("");
			
	//Append circle at starting point
	carry.append("circle")
			.attr("class", "startCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 10)
			.style("fill", "#81BC00");	 
			
	//Append pulsating circle for previous strike
	carry.append("circle")
			.attr("class", "pulseCircle")
			.attr("r", 0)
			.attr("cx", 0)
			.attr("cy", 0)
			.style("fill", "#81BC00")
			.style("opacity", 0.4)
			.each(function(d) { pulseCircle(carry); });	

	////////////////////////////////////////////////////////////// 
	///////////////////// Angle of Attack ////////////////////////
	////////////////////////////////////////////////////////////// 

	//Margins and dimensions
	marginAoA = {top: 30, right: 50, bottom: 30, left: 50};
	widthAoA = $(".chart.aoa").width() - marginAoA.left - marginAoA.right - paddingBetween;
	heightAoA = 240;

	var imageWidth = 80;
	lineLength = 3 * imageWidth;
	
	//Create axes for the chart
	AoAScale = d3.scale.linear().domain([-5, 5]).range([30, -30]);
	
	//Create SVG
	AoA = d3.select(".chart.aoa").append("svg")
		.attr("width", widthAoA + marginAoA.left + marginAoA.right)
		.attr("height", heightAoA + marginAoA.top + marginAoA.bottom)
	  .append("g")
		.attr("class", "AoAWrapper")
		.attr("transform", "translate(" + (marginAoA.left + widthAoA/4) + "," + (marginAoA.top + heightAoA/2)  + ")");	

	/*//Streamlet
	AoA.append("path")
            //.attr("d", "M12.8,20c0,0,413.9,26.4,412.7,0.3S12.8,20,12.8,20z")
			.attr("d", "M-0.1,17.6c0,0,704.5,15.9,909.6,17.9c34.3,0.3,41.9-8.4,41.5-17.2c-0.4-8.5-11.4-18.9-44.5-17.8C709.5,6.6-0.1,17.6-0.1,17.6z")
			.attr("transform", "rotate(" + AoAScale(meanAoA) + ") scale(0.2)")
            .style("fill", "#D3D3D3");*/
	
	//Append zero line to chart 
	AoA.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", widthAoA/2)
		.attr("y2", 0)
		.style("stroke-dasharray", "3 3")
		.style("shape-rendering", "crispEdges")
		.style("stroke", "#D3D3D3");
		
	//Append small bar for peer group average
	if (chosenPeerGroup.length > 0) {
		AoA.append("line")
			.attr("class", "meanAoALine")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", Math.cos(AoAScale(meanAoA) * Math.PI/180) * lineLength)
			.attr("y2", Math.sin(AoAScale(meanAoA) * Math.PI/180) * lineLength)
			.style("stroke-width", "2")
			.style("stroke-linecap", "round")
			.style("stroke", peerGroupColor);
	}//if
	
	//Golf ball image
	AoA.append("svg:image")
		.attr("x", -imageWidth/2)
		.attr("y", -imageWidth/2)
		.attr("class", "golfball")
		.attr("xlink:href", "img/golfball-grey-white.png")
		.attr("width", imageWidth)
		.attr("height", imageWidth)
		.attr("text-anchor", "middle");	
	
	//Create lightgreen - darker green gradient to fill paths later on
	var gradientLinear = AoA
		.append("linearGradient")
		.attr("id", "gradientLinear")
		.attr("gradientUnits", "objectBoundingBox") 
		.attr("y1", "0")
		.attr("y2", "0")
		.attr("x1", "0")
		.attr("x2", "100%")
		.selectAll("stop") 
		.data([                             
				{offset: "0%", color: "#eaffbc"}, 			
				{offset: "90%", color: "#81BC00"}    
			])                  
		.enter().append("stop") 
		.attr("offset", function(d) { return d.offset; })   
		.attr("stop-color", function(d) { return d.color; });

	
	//Append path for the angle arc
	AoA.append("path")
			.attr("class", "AoAPath")
			.attr("x", 0)
			.attr("y", 0)
			.attr("d", describeArc(0, 0, lineLength*0.8, 0, 0))
			.style("stroke-dasharray", "3 3")
			.style("fill", "none")
			.style("stroke", "#6B6B6B");	
	//Append text for the angle number
	AoA.append("text")
			.attr("class", "AoAText")
			.attr("x", 0)
			.attr("y", 0)
			.style("fill", "#292929")
			.text("");
			
	////////////////////////////////////////////////////////////// 
	//////////////// Finished swings Button ////////////////////// 
	////////////////////////////////////////////////////////////// 
	
	//Create green finish circle
	var widthCircle = 80,
		heightCircle = widthCircle;
	//Create SVG
	var svgGreenFinishDot = d3.select(".finishButton").append("svg")
		.attr("width", widthCircle)
		.attr("height", heightCircle)
		.attr("class", "greenFinishDot")
		.on("click", moveThreeToFour)
	  .append("g")
		.attr("transform", "translate(" + widthCircle/2 + "," + heightCircle/2 + ")");
		
	//Filter for the outside glow
	var filterFinish = svgGreenFinishDot.append('defs').append('filter').attr('id','glowFinish'),
		feGaussianBlur = filterFinish.append('feGaussianBlur').attr('stdDeviation','3.5').attr('result','coloredBlur'),
		feMerge = filterFinish.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
	
	//Add the circle	
	svgGreenFinishDot.append("circle")
			.attr("class", "finishCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0)
			.style("filter" , "url(#glowFinish)")
			.style("fill", "#81BC00")
			.style("cursor","pointer")
			.transition().duration(1000)
			.attr("r", (widthCircle/2*0.8));
	//Add the text		
	svgGreenFinishDot.append("text")
			.attr("class", "finishText")
			.style("text-anchor", "middle")
			.style("fill", "white")
			.style("font-size", 13)
			.style("font-weight", 400)
			.attr("dy", "0.35em")
			.style("pointer-events", "none")
			.text("finished")
			.style("opacity", 0)
			.transition().duration(1000)
			.style("opacity", 1);

	////////////////////////////////////////////////////////////// 
	/////////////////// Peer Group Legend //////////////////////// 
	////////////////////////////////////////////////////////////// 
	
	//Create SVG
	var svgPeerGroupLegend = d3.select(".peerGroupLegend").append("svg")
		.attr("width", $(".peerGroupLegend").width())
		.attr("height", heightCircle)
		.attr("class", "peerGroupLegendSVG")
	  .append("g")
		.attr("transform", "translate(" + 30 + "," + heightCircle/2 + ")");
	  
	var rectWidth = 16;
	svgPeerGroupLegend.append("rect")
		.attr("x", 0)
		.attr("y", -rectWidth/2)
		.attr("width", rectWidth)
		.attr("height", rectWidth)
		.style("fill", peerGroupColor);
		
	svgPeerGroupLegend.append("text")
		.attr("x", rectWidth+12)
		.attr("y", -rectWidth/2)
		.attr("dy", "1em")
		.style("font-size", "12px")
		.text("Gemiddelde van jouw referentie groep");
		
		
}//setupVisuals