var data = [
    {
        "AttackAngle": "4.62",
        "BallSpeed": "48.1916644",
        "Carry": "125.90",
        "ClubSpeed": "48.431239",
        "Side": "-12.99",
        "Time": "2015-05-21 13:35:28.534746",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 1
    },
    {
        "AttackAngle": "-4.94",
        "BallSpeed": "68.0010854",
        "Carry": "80.46",
        "ClubSpeed": "33",
        "Side": "8.95",
        "Time": "2015-05-21 13:35:37.533967",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 2
    },
    {
        "AttackAngle": "3.05",
        "BallSpeed": "55",
        "Carry": "175.56",
        "ClubSpeed": "41.4",
        "Side": "12.43",
        "Time": "2015-05-21 13:35:40",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 3
    },
    {
        "AttackAngle": "1.23",
        "BallSpeed": "32.43",
        "Carry": "168.93",
        "ClubSpeed": "45.64",
        "Side": "3.24",
        "Time": "2015-05-21 13:35:42",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 4
    },
    {
        "AttackAngle": "-2.45",
        "BallSpeed": "40.76",
        "Carry": "134.44",
        "ClubSpeed": "28.34",
        "Side": "20.35",
        "Time": "2015-05-21 13:35:44",
        "UID": "7ed5f514-3abb-43ed-9a25-174cd636f180",
        "id": 5
    }
];

//Brush is the higher focus chart, All is the smaller context chart	
var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = $(".chartLeft").width() - margin.left - margin.right,
	height = $(window).height() - margin.top - margin.bottom - 80;

//peer group grey color
var peerGroupColor = "#9C9C9C";

//Set the button actions in the 2nd screen to define the peer group	
var peerGroupAge = "1975_1985",
	peerGroupGender = "Vrouw",
	peerGroupHandicap = "5_15";
	
d3.select("#button_Man").on("click", function(){ peerGroupGender = d3.select("#button_Man").attr("value"); });
d3.select("#button_Vrouw").on("click", function(){ peerGroupGender = d3.select("#button_Vrouw").attr("value"); });

d3.select("#button_1950_1975").on("click", function(){ peerGroupAge = d3.select("#button_1950_1975").attr("value"); });
d3.select("#button_1975_1985").on("click", function(){ peerGroupAge = d3.select("#button_1975_1985").attr("value"); });
d3.select("#button_1985_1997").on("click", function(){ peerGroupAge = d3.select("#button_1985_1997").attr("value"); });
//d3.select("#button_1997_2015").on("click", function(){ peerGroupAge = d3.select("#button_1997_2015").attr("value"); });

d3.select("#button_0_5").on("click", function(){ peerGroupHandicap = d3.select("#button_0_5").attr("value"); });
d3.select("#button_5_15").on("click", function(){ peerGroupHandicap = d3.select("#button_5_15").attr("value"); });
d3.select("#button_15_25").on("click", function(){ peerGroupHandicap = d3.select("#button_15_25").attr("value"); });
d3.select("#button_25_36").on("click", function(){ peerGroupHandicap = d3.select("#button_25_36").attr("value"); });

//[peerGroupAge, peerGroupGender, peerGroupHandicap]

//Group the pro data by the name of the pro
var pro = d3.nest().key(function(d) { return d.Name; }).entries(pro);

var proAge = [29, 24, 23, 19, 27, 29]; //"Joost Luiten", "Daan Huizing", "Robin Kind", "Anne van Dam", "Christel Boeljon", "Dewi Schreefel"
var proGolfEvents = ["KLM open","KLM open","KLM open","Deloitte Ladies open","Deloitte Ladies open","Deloitte Ladies open"];
var proGolfEventsNum = [10,4,5,2,10,4];
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

//Resize top pading to center the Deloitte logo	
d3.select(".stepOneText")
	.style("top", ((height/2 - 200)+"px"))
	.style("visibility", "visible");
	
//Size of the puslating circle
var circleSize = 50;

//Create the two circles that will pulse
svgGreenDot.selectAll(".pulseCircle")
			.data([0,1]).enter()
			.append("circle")
			.attr("class", "pulseCircle")
			.attr("r", circleSize*0.8)
			.attr("cx", width / 2)
			.attr("cy", height / 2)
			.style("fill", "#81BC00")
			.transition().duration(1500).delay(function(d,i) { return i*500; })
			.attr("r", circleSize*1.75)
			.style("opacity", 0.3)
			.each(doPulse);

function doPulse() {
	d3.select(this)
		.transition()
		.duration(1500)
		.attr("r", circleSize*1.75)
		.attr("opacity", 0.3)
		.each("end", function() {
			d3.select(this)
				.transition()
				.duration(1500)
				.delay(function(d,i) { return i*500; })
				.attr("r", circleSize*0.8)
				.attr("opacity", 1)
				.each("end", doPulse);
		});
};

/* //Old pulse
function pulse() {
	var circle = svgGreenDot.selectAll(".pulseCircle");
	(function repeat() {
		circle.transition()
			.duration(1500)
			.attr("r", circleSize*0.8)
			.style("opacity", 0.9)
		.transition().duration(1500).delay(1500)
			.attr("r", circleSize*2)
			.style("opacity", 0.2)
			.each("end", repeat);
	})();
}//pulse
*/

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
		
	d3.selectAll(".stepOneText")
		.transition().duration(750)
		.style("opacity", 0);
	
	setTimeout(function() {
		d3.selectAll(".stepOneElements").style("display", "none");
		d3.select(".greenDotWrapper").remove();
		d3.selectAll(".stepTwoElements")
			.style("opacity", 0)
			.style("display", "block")
			.transition().duration(750)
			.style("opacity", 1);
		d3.selectAll(".btn.stepTwoElements").style("display", "inline-block");
		
		//Make the content center vertically
		var moveDown = $(window).height()/2 - 162 - 
											  ($(".definePeerGroup").height() + 100 + 
											   $(".defineSocialMedia").height() + 50 + 
											   $(".defineButton").height())/2; //162 it the height of the title and paddings in the top section 										   
		d3.select(".definePeerGroup").style("padding-top", (moveDown+"px"));

	}, 1000);	

	//Create green submit circle
	var widthCircle = 80,
		heightCircle = widthCircle;
	//Create SVG
	var svgGreenSubmitDot = d3.select(".submitButton").append("svg")
		.attr("width", widthCircle)
		.attr("height", heightCircle)
		.attr("class", "greenSubmitDot")
		.on("click", moveTwoToThree)
	  .append("g")
		.attr("transform", "translate(" + widthCircle/2 + "," + heightCircle/2 + ")");
		
	//Filter for the outside glow
	var filter = svgGreenSubmitDot.append('defs').append('filter').attr('id','glowSubmit'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','3.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
	
	//Append circle
	svgGreenSubmitDot.append("circle")
			.attr("class", "submitCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0)
			.style("filter" , "url(#glowSubmit)")
			.style("fill", "#81BC00")
			.style("cursor","pointer")
			.transition().duration(1000).delay(1000)
			.attr("r", (widthCircle/2*0.8));
	//Append text	
	svgGreenSubmitDot.append("text")
			.attr("class", "submitText")
			.style("text-anchor", "middle")
			.style("fill", "white")
			.style("font-size", 13)
			.style("font-weight", 400)
			.attr("dy", "0.35em")
			.style("pointer-events", "none")
			.text("submit")
			.style("opacity", 0)
			.transition().duration(1000).delay(2000)
			.style("opacity", 1);

}//setupPeergroup

///////////////////////////////////////////////////////////
///////////////// Helper Functions ////////////////////////
///////////////////////////////////////////////////////////

//Move the element to the front
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
	this.parentNode.appendChild(this);
  });
};

//Needed for creation of arc in Angle of Attack
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}//polarToCartesian

//Needed for creation of arc in Angle of Attack
function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle+90);
    var end = polarToCartesian(x, y, radius, startAngle+90);

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(" ");

    return d;       
}//describeArc

//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text	
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
		x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
		
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
				
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}//wrap