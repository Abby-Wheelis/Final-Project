//works to create a scatterplot with different size circles and colors

/*var sampleData= [{name: "fred", rise: 12, run: 5, width: 6},
                {name: "sam", rise: 15, run: 7, width: 7},
                {name: "pebbles", rise: 18, run: 11, width: 9},
                {name: "barney", rise: 8, run: 15, width: 6},
                {name: "george", rise: 9, run: 17, width: 10},
                {name: "green", rise: 13, run: 19, width: 3},
                {name: "orange", rise: 5, run: 15, width: 2},
                {name: "red", rise: 3, run: 12, width: 1},
                {name: "yellow", rise: 1, run: 3, width: 5},
                {name: "purple", rise: 12, run: 7, width: 6},]

var sampleData2= [{name: "fred", rise: 13, run: 4, width: 3},
                {name: "sam", rise: 12, run: 8, width: 4},
                {name: "pebbles", rise: 17, run: 13, width: 7},
                {name: "barney", rise: 5, run: 18, width: 8},
                {name: "george", rise: 7, run: 15, width: 10},
                {name: "green", rise: 15, run: 19, width: 4},
                {name: "orange", rise: 9, run: 13, width: 6},
                {name: "red", rise: 2, run: 11, width: 9},
                {name: "yellow", rise: 1, run: 2, width: 3},
                {name: "purple", rise: 16, run: 9, width: 6},]*/


  
var CirclePromise = d3.csv("CSV-DATA-YAY.csv")

Promise.all([CirclePromise]).then(
function(data)
{
    console.log("data",data);
  
    setup(data);
},
function(err)
{
    console.log("broken",err)
});


// sets the stage for the circle dudes
var setup = function(realData)
{
    
    var screen = {width: 800, height: 500}
    
    var margins = {top: 25, bottom: 35, left: 50, right: 25}
    
    var width = screen.width - margins.left - margins.right
    var height = screen.height - margins.top - margins.bottom
    
    var xScale = d3.scaleLinear()
                    .domain([0,13])
                    .range([0, width])
    
    var yScale = d3.scaleLinear()
                    .domain([0,110])
                    .range([height-5,0])
    
    var rScale = d3.scaleLinear()
                    .domain([-20,800])
                    .range([0,50])
    
    var cScale = d3.scaleOrdinal(d3.schemeTableau10)
    
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)
    
    var svg = d3.select("body")
    .append("svg")
    .attr("width", screen.width)
    .attr("height", screen.height);
    
    svg.append("g")
    .attr("id","xAxis")
    .attr("transform","translate("+margins.left+","+(margins.top+height)+")")
    .call(xAxis)
    
    svg.append("text")
    .attr("transform", "translate("+ (width/2)+","+(height+margins.top+30)+")")
    .style("text-anchor", "middle")
    .text("Co2 Emissins per Capita")
    
    svg.append("g")
    .attr("id","yAxis")
    .attr("transform","translate(35,"+margins.top+")")
    .call(yAxis);
    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", (margins.left-55))
      .attr("x", 0-(height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Total Domestic material consumption per capita in tonnes");     
    
    svg.append("g")
    .attr("id", "scatterplot")
    .attr("transform", "translate("+margins.left+","+margins.top+")");
    
    d3.select("#scatterplot")
    .selectAll("circle")
    .data(realData)
    .enter()
    .append("circle")
    
    drawCircles(realData, xScale, yScale, rScale, cScale)
    
    makeButton(realData, xScale, yScale, rScale, cScale)
}

//draws the dudes and handles the mouseover
var drawCircles = function(dataArray, xScale, yScale, rScale, cScale)
{
            console.log(dataArray[0].[0].tenX)
  
            var spots = d3.select("#scatterplot")        
            .selectAll("circle")
            .data(dataArray[0])
            //.enter()
            //.append("circle")
                        
            spots.transition()
            .duration(1000)
            .attr("cx", function(d)
                 {return xScale(d.tenX)}) 
            .attr("cy", function(d)
                 {return yScale(d.tenY)})
            .attr("r", function(d)
                 {return rScale(d.tenR)})
            .attr("fill", function(d)
                 {return cScale(d.Name)})
            //mouseover works, positioning of the div needs help
            spots.on("mouseover", function(d)
            {   
                //console.log(d3.select(this).attr("r"))
                
                var xPosition = d3.event.pageX; //add later to tweak
                var yPosition = d3.event.pageY;
                
                d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#value")
                .text(d.Name);
                
                d3.select("#tooltip").classed("hidden", false);
            })
            .on("mouseout", function()
                {d3.select("#tooltip").classed("hidden", true);})
}

var makeButton= function(realData, xScale, yScale, rScale, cScale)
{
    d3.select("body")
    .append("button")
    .attr("id", "change")
    .text("swithcheroo")
    .on("click", function()
    {
        console.log("button works!")
        drawCircles(realData, xScale, yScale, rScale, cScale)
        
    })
    
}

//setup(sampleData)// I'll need to actually put this in a promise, duh

/// begin extra SVG for the time slider dude down there
var timelineSetup = function()
{
    var tScreen = {width: 800, height: 100}
    
    var tMargins = {top: 10, bottom: 30, left: 50, right: 25}
    
    var width = tScreen.width - tMargins.left - tMargins.right
    var tHeight = tScreen.height - tMargins.top - tMargins.bottom
    
    var tScale = d3.scaleLinear()
                    .domain([2000,2020])
                    .range([0, width])
    
    var xAxis = d3.axisBottom(tScale)
                .tickFormat(d3.format("d"))
   
    var svg = d3.select("body")
    .append("svg")
    .attr("class", "timeline")
    .attr("width", screen.width)
    .attr("height", screen.height);
    
    svg.append("g")
    .attr("id","xAxis")
    .attr("transform","translate("+tMargins.left+","+(tMargins.top+tHeight)+")")
    .call(xAxis)
    
    svg.append("text")
    .attr("transform", "translate("+ (width/2)+","+(tHeight+tMargins.top+30)+")")
    .style("text-anchor", "middle")
    .text("Year")
    
    var timeLines = {one: tScale(2005), two: tScale(2010), three: tScale(2015)} // array of the pixel destinations

    drawTick(timeLines.one, tScale, tHeight, tMargins)
    
}

var drawTick = function(data, tHeight, tMargins) // ok so this works, but doesn't call to slide, if I do it in the other on it doesn't know everything, if I do it seperately it just ignores that other .on and doesn't move
{
        console.log(data)    
        console.log(tHeight)
        console.log(tMargins)
    
        var tick = d3.select("svg.timeline")
        .append("rect")
        
        tick.transition()
    
        tick.attr("x", function(trash)
              {return data + 50}) //that 50 is tMargins.left, I caved and did it the bad way
       
        //figure out how to change to slide along w/ the transition, I know I need it to slide to change in the same amount of time as the bubbles take to change, maybe use button to initiate the first swap and then a timing thingy to make the next slide start when the first one ends.
            
        .attr("y", function(time)
        {
            return 62.5  //this number should be, tHeight+tMargins.top-7.5, I cheated
        })
        .attr("width", 5)
        .attr("height", 15)
        .attr("fill", "black")  
    
        console.log("got here")
}

timelineSetup() // should not be a loose call down here eventually
