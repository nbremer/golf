var data = [
    {
        "AttackAngle": "-4.62",
        "BallSpeed": "110.1916644",
        "Carry": "125.90",
        "ClubSpeed": "82.431239",
        "Side": "-2.99",
        "Time": "2015-05-21 13:35:28.534746",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 1
    },
    {
        "AttackAngle": "-4.94",
        "BallSpeed": "125.0010854",
        "Carry": "137.46",
        "ClubSpeed": "75",
        "Side": "8.95",
        "Time": "2015-05-21 13:35:37.533967",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 2
    },
    {
        "AttackAngle": "3.05",
        "BallSpeed": "90",
        "Carry": "60.56",
        "ClubSpeed": "93.4",
        "Side": "12.43",
        "Time": "2015-05-21 13:35:40",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 3
    },
    {
        "AttackAngle": "1.23",
        "BallSpeed": "155.43",
        "Carry": "186.93",
        "ClubSpeed": "45.64",
        "Side": "3.24",
        "Time": "2015-05-21 13:35:42",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 4
    },
    {
        "AttackAngle": "-2.45",
        "BallSpeed": "40.76",
        "Carry": "250.44",
        "ClubSpeed": "110.34",
        "Side": "34.35",
        "Time": "2015-05-21 13:35:44",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 5
    }
];

//Brush is the higher focus chart, All is the smaller context chart	
var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = $(".chartLeft").width() - margin.left - margin.right,
	height = $(window).height() - margin.top - margin.bottom - 80;
	
////////////////////////////////////////////////////////////// 
///////////////// Step 1 - Pulsating dot ///////////////////// 
////////////////////////////////////////////////////////////// 

	
//Create SVG
var svgGreenDot = d3.select(".chartLeft").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.attr("class", "greenDotWrapper")
	.on("click", setupPeergroup)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
d3.select(".stepOneText")
	.style("top", ((height/2 - 200)+"px"))
	.style("visibility", "visible");
	
var circleSize = 50;

//Create the two circles that will pulse
svgGreenDot.selectAll(".pulseCircle")
			.data([0,1]).enter()
			.append("circle")
			.attr("class", "pulseCircle")
			.attr("r", circleSize)
			.attr("cx", width / 2)
			.attr("cy", height / 2)
			.style("fill", "#81BC00")
			.each(pulse);

function pulse() {
	var circle = svgGreenDot.selectAll(".pulseCircle");
	(function repeat() {
		circle.transition()
			.duration(1500).delay(function(d,i) {return i*500;})
			.attr("r", circleSize*0.8)
			.style("opacity", 0.9)
		
		circle.transition().duration(1500).delay(function(d,i) {return 1500; })
			.attr("r", circleSize*1.75)
			.style("opacity", 0.2)
			.each("end", repeat);
	})();
}//pulse

//One steady circle in the center
var circleCenter = svgGreenDot.append("circle")
					.attr("class", "steadyCircle")
					.attr("cx", width/2)
					.attr("cy", height/2)
					.attr("r", circleSize)
					.style("fill", "#81BC00");

////////////////////////////////////////////////////////////// 
////////////// Step 2 - Select peer group //////////////////// 
////////////////////////////////////////////////////////////// 
					
function setupPeergroup() {

	//Increase size, decrease opacity then remove
	d3.selectAll(".steadyCircle")
		.transition().duration(750)
		.attr("r", 400)
		.style("opacity", 0)
		.remove();
		
	d3.selectAll(".pulseCircle")
		.transition().duration(750)
		.attr("r", 0)
		.style("opacity", 0)
		.remove();
		
	d3.selectAll(".stepOneText").style("display", "none");
	
	setTimeout(function() {
		d3.selectAll(".stepOneElements").style("display", "none");
		d3.select(".greenDotWrapper").remove();
		d3.selectAll(".stepTwoElements").style("display", "block");
		d3.selectAll(".btn.stepTwoElements").style("display", "inline-block");
	}, 1000);
	

	var widthCircle = 80,
		heightCircle = widthCircle;
	//Create SVG
	var svgGreenSubmitDot = d3.select(".submitButton").append("svg")
		.attr("width", widthCircle)
		.attr("height", heightCircle)
		.attr("class", "greenSubmitDot")
		//.on("click", setupCharts)
	  .append("g")
		.attr("transform", "translate(" + widthCircle/2 + "," + heightCircle/2 + ")");
		
	//Filter for the outside glow
	var filter = svgGreenSubmitDot.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','3.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
		
	svgGreenSubmitDot.append("circle")
			.attr("class", "submitCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", (widthCircle/2*0.8))
			.style("filter" , "url(#glow)")
			.style("fill", "#81BC00")
			.style("cursor","pointer")
			.on("click", moveTwoToThree);
			
	svgGreenSubmitDot.append("text")
			.attr("class", "submitText")
			.style("text-anchor", "middle")
			.style("fill", "white")
			.style("font-size", 13)
			.style("font-weight", 400)
			.attr("dy", "0.35em")
			.style("pointer-events", "none")
			.text("submit");
		
//Handicap: 0 - 54
}//setupPeergroup

////////////////////////////////////////////////////////////// 
//////////////// Step 3 - Actual Visuals ///////////////////// 
////////////////////////////////////////////////////////////// 

function moveTwoToThree() {

	//Decrease size, decrease opacity then remove
	d3.selectAll(".submitCircle")
		.transition().duration(500)
		.attr("r", 0)
		.style("opacity", 0)
		.remove();
	
	//Hide previous section and display the swing visuals
	setTimeout(function(d) {
		d3.selectAll(".stepTwoElements").style("display", "none");
		d3.select(".greenSubmitDot").remove();
		d3.selectAll(".stepThreeElements").style("display", "block");
		setupVisuals();		
	}, 500);

}//moveTwoToThree	



var numSwings = 0; //The swing number we are at	

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
	

function setupVisuals() {

	//Decrease size, decrease opacity then remove
	d3.selectAll(".submitCircle")
		.transition().duration(500)
		.attr("r", 0)
		.style("opacity", 0)
		.remove();
	
	//Hide previous section and display the swing visuals
	setTimeout(function(d) {
		d3.selectAll(".stepTwoElements").style("display", "none");
		d3.select(".greenSubmitDot").remove();
		d3.selectAll(".stepThreeElements").style("display", "block");
	}, 500);

	//Dummy method to simulate swings 
	d3.select("body").on("click", function(d) {
		numSwings++; 
		d3.select(".stepThreeTitle").text("Verwerken van slag " + numSwings);
		redrawSwing(numSwings);  
	})
		
	////////////////////////////////////////////////////////////// 
	////////////////////// Ball Speed //////////////////////////// 
	////////////////////////////////////////////////////////////// 

	marginBallSpeed = {top: 30, right: 50, bottom: 30, left: 50};
	widthBallSpeed = $(".chart.ballSpeed").width() - marginBallSpeed.left - marginBallSpeed.right;
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
	widthClubSpeed = $(".chart.clubSpeed").width() - marginClubSpeed.left - marginClubSpeed.right;
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
	widthCarry = $(".chart.carry").width() - marginCarry.left - marginCarry.right;
	heightCarry = 300;
		
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
	  .attr("transform", "translate(0," + 100 + ")")
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
			.style("fill", "#4D4D4D")
			.text("");
			
}//setupVisuals

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
////////////// Redraw functions for each swing /////////////// 
////////////////////////////////////////////////////////////// 
function redrawSwing(timeStamp) {

	//Take only those datapoints from data which happened after the start
	var subset = data.filter(function(d) { return d.id <= timeStamp; });
	//Convert the data to numeric
	subset.forEach(function(d,i) {
		d.AttackAngle = +d.AttackAngle;
		d.BallSpeed = +d.BallSpeed;
		d.Carry = +d.Carry;
		d.ClubSpeed = +d.ClubSpeed;
		d.Side = +d.Side;
	})
	
	var index = timeStamp-1;
	
	////////////////////////////////////////////////////////////// 
	/////////////////////// Ball Speed /////////////////////////// 
	////////////////////////////////////////////////////////////// 	

	var ballSpeedDelay = 1000,
		ballSpeedDuration = 2000;
		
	ballSpeedScale.domain([0, d3.max(subset, function(d) { return d.BallSpeed; })*1.2]);
	ballSpeedAxis.scale(ballSpeedScale);
	//Update the x axis
	ballSpeed.select(".x.axis")
		.transition().duration(ballSpeedDuration).delay(ballSpeedDelay)
		.call(ballSpeedAxis);
	
	//Increase size of circle at 0,0 (then the swing is "ejected" and then decrease size again
	ballSpeed.select(".startCircle")
		.transition("startCircleGrow").duration(1000).delay((ballSpeedDelay-1000))
		.attr("r", 20)
		.transition("startCircleBounce").duration(ballSpeedDuration*1.5).delay((ballSpeedDelay+500)).ease("elastic")
		.attr("r", 10);
		
  	//DATA JOIN
	//Join new data with old elements, if any
	var ballSpeedWrapper = ballSpeed.selectAll(".ballSpeedCircle")
		.data(subset, function(d) { return d.id; });
	  
	//UPDATE
	ballSpeedWrapper
		.transition().duration(ballSpeedDuration).delay(ballSpeedDelay)
			.style("opacity", 0.5)
			.attr("r", 5)
			.attr("cx", function(d) { return ballSpeedScale(d.BallSpeed); });;	
	
	//ENTER 
	ballSpeedWrapper
		.enter().append("circle")
			.attr("class", "ballSpeedCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0)
			.style("fill", "#81BC00")
			.transition().duration(1000).delay((ballSpeedDelay-1000))
			.attr("r", 20)
			.transition().duration(ballSpeedDuration)
			.attr("r", 8)
			.attr("cx", function(d) { return ballSpeedScale(d.BallSpeed); });

	//EXIT
	ballSpeedWrapper.exit().remove();	
	
	//Move the pulsating dot that shows the current swing to the most recent swing
	ballSpeed.selectAll(".pulseCircle")
			.transition("move").duration(1000).delay(ballSpeedDelay-1000)
			.style("opacity", 0)
			.transition("move").duration(ballSpeedDuration)
			.attr("cx", ballSpeedScale(subset[index].BallSpeed))
			.transition("move").duration(2000)
			.style("opacity", 0.4); 

	////////////////////////////////////////////////////////////// 
	/////////////////////// Club Speed /////////////////////////// 
	////////////////////////////////////////////////////////////// 

	var clubSpeedDelay = 3000,
		clubSpeedDuration = 2000;

	clubSpeedScale.domain([0, d3.max(subset, function(d) { return d.ClubSpeed; })*1.2]);
	clubSpeedAxis.scale(clubSpeedScale);
	//Update the x axis
	clubSpeed.select(".x.axis")
		.transition().duration(clubSpeedDuration).delay(clubSpeedDelay)
		.call(clubSpeedAxis);
		
	//Increase size of circle at 0,0 (then the swing is "ejected" and then decrease size again
	clubSpeed.select(".startCircle")
		.transition("startCircleGrow").duration(1000).delay((clubSpeedDelay-1000))
		.attr("r", 20)
		.transition("startCircleBounce").duration(clubSpeedDuration*1.5).delay((clubSpeedDelay+500)).ease("elastic")
		.attr("r", 10);
	
  	//DATA JOIN
	//Join new data with old elements, if any
	var clubSpeedWrapper = clubSpeed.selectAll(".clubSpeedCircle")
		.data(subset, function(d) { return d.id; });
	  
	//UPDATE
	clubSpeedWrapper
		.transition().duration(clubSpeedDuration).delay(clubSpeedDelay)
			.style("opacity", 0.5)
			.attr("r", 5)
			.attr("cx", function(d) { return clubSpeedScale(d.ClubSpeed); });	
	
	//ENTER 
	clubSpeedWrapper
		.enter().append("circle")
			.attr("class", "clubSpeedCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0)
			.style("fill", "#81BC00")
			.transition().duration(1000).delay((clubSpeedDelay-1000))
			.attr("r", 20)
			.transition().duration(clubSpeedDuration)
			.attr("r", 8)
			.attr("cx", function(d) { return clubSpeedScale(d.ClubSpeed); });

	//EXIT
	clubSpeedWrapper.exit().remove();	
	
	//Move the pulsating dot that shows the current swing to the most recent swing
	clubSpeed.selectAll(".pulseCircle")
			.transition("move").duration(1000).delay(clubSpeedDelay-1000)
			.style("opacity", 0)
			.transition("move").duration(clubSpeedDuration)
			.attr("cx", clubSpeedScale(subset[index].ClubSpeed))
			.transition("move").duration(2000)
			.style("opacity", 0.4); 
			
	////////////////////////////////////////////////////////////// 
	////////////////////// Cary & Side /////////////////////////// 
	////////////////////////////////////////////////////////////// 

	var carryDelay = 5000,
		carryDuration = 2000;

	//Save the zero-line distance of the last swing in a variable
	var triangle = Math.sqrt(subset[index].Carry*subset[index].Carry - subset[index].Side*subset[index].Side);

	carryScale.domain([0, d3.max(subset, function(d) { return Math.sqrt(d.Carry*d.Carry - d.Side*d.Side); })*1.2]);
	carryAxis.scale(carryScale);
	//Update the x axis
	carry.select(".x.axis")
		.transition().duration(carryDuration).delay(carryDelay)
		.call(carryAxis);
		
	//Increase size of circle at 0,0 (then the swing is "ejected" and then decrease size again)
	carry.select(".startCircle")
		.transition("startCircleGrow").duration(1000).delay((carryDelay-1000))
		.attr("r", 20)
		.transition("startCircleBounce").duration(carryDuration*1.5).delay((carryDelay+500)).ease("elastic")
		.attr("r", 10);
	
  	//DATA JOIN
	//Join new data with old elements, if any
	var carryWrapper = carry.selectAll(".carryCircle")
		.data(subset, function(d) { return d.id; });
	  
	//UPDATE
	carryWrapper
		.transition().duration(carryDuration).delay(carryDelay)
			.style("opacity", 0.5)
			.attr("r", 5)
			.attr("cx", function(d) { return carryScale(Math.sqrt(d.Carry*d.Carry - d.Side*d.Side)); })
			.attr("cy", function(d) { return carryScale(d.Side); });
	
	//ENTER 
	carryWrapper
		.enter().append("circle")
			.attr("class", "carryCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0)
			.style("fill", "#81BC00")
			.transition().duration(1000).delay((carryDelay-1000))
			.attr("r", 20)
			.transition().duration(carryDuration)
			.attr("r", 8)
			.attr("cx", function(d) { return carryScale(Math.sqrt(d.Carry*d.Carry - d.Side*d.Side)); })
			.attr("cy", function(d) { return carryScale(d.Side); });

	//EXIT
	carryWrapper.exit().remove();	
	
	//Move the pulsating dot that shows the current swing to the most recent swing
	carry.selectAll(".pulseCircle")
			.transition("move").duration(1000).delay(carryDelay-1000)
			.style("opacity", 0)
			.transition("move").duration(carryDuration)
			.attr("cx", carryScale(triangle))
			.attr("cy", carryScale(subset[index].Side))
			.transition("move").duration(2000)
			.style("opacity", 0.4); 
			
	//Move the line to show the actual side
	carry.selectAll(".sideLine")
		.attr("x1", carryScale(triangle) + 0.1*carryScale.domain()[1])
		.attr("x2", carryScale(triangle) + 0.1*carryScale.domain()[1])
		.attr("y2", 0)
		.transition().duration(1000).delay(carryDelay+carryDuration)
		.attr("y2", carryScale(subset[index].Side));
	//Move the text to print the side
	carry.selectAll(".sideText")
		.style("opacity", 0)
		.attr("x", carryScale(triangle) + 0.1*carryScale.domain()[1] + 10)
		.attr("y", carryScale(subset[index].Side))
		.text("Side: " + Math.round(carryScale(subset[index].Side),2) + " m")
		.transition().duration(1000).delay(carryDelay+carryDuration+1000)
		.style("opacity", 1);
		
	
	////////////////////////////////////////////////////////////// 
	///////////////////////// Finish ///////////////////////////// 
	////////////////////////////////////////////////////////////// 
	setTimeout(function() {
		d3.select(".stepThreeTitle").text("Klaar voor slag " + (numSwings+1));
	}, 5000);
}//redrawSwing