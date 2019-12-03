//this is where the promise starts

var CirclePromise = d3.csv("CSV-DATA-YAY.csv")

Promise.all([CirclePromise]).then(
function(data)
{
    console.log("data",data);
    
    console.log(dataArray);
    
    var dataArray= data[0];
    
    setup(dataArray);
    
    timelineSetup();
},
    
function(err)
{
    console.log("broken",err)
});

//these are functions that make my life easier, .maps to get the data nice and pretty to use
var makeTen = function(dataPoint)
{
    return {Name: dataPoint.Name, X: dataPoint.tenX, Y: dataPoint.tenY, R: dataPoint.tenR}
}

var makeFifteen = function(dataPoint)
{
    return {Name: dataPoint.Name, X: dataPoint.fifteenX, Y: dataPoint.fifteenY, R: dataPoint.fifteenR}
}

// sets the stage for the circle dudes
var setup = function(realData)
{
    //dimensions
    var screen = {width: 800, height: 500}
    
    var margins = {top: 25, bottom: 75, left: 60, right: 55}
    
    var width = screen.width - margins.left - margins.right
    var height = screen.height - margins.top - margins.bottom
    
    //scales
    var xScale = d3.scaleLinear()
                    .domain([0,14])
                    .range([0, width])
    
    var yScale = d3.scaleLinear()
                    .domain([0,200])
                    .range([height-5,0])
    
    var rScale = d3.scaleLinear()
                    .domain([-20,800])
                    .range([5,50])
    
    /*
    
    var cScale = d3.scaleOrdinal()
                    .domain("Southern Asia", "Southern Europe", "Northern Africa", "Sub-Saharan Africa", "Latin America and the Carribean", "Western Asia", "Austrailia and New Zealand", "Western Europe", "Northern America", "Melanesia", "South-eastern Asia", "Eastern Europe", "Eastern Asia", "Polynesia", "Northern Europe", "Micronesia", "Central Asia")
                    .range("#35a01f", "#6834f3", "#fa4a55", "#4394b9", "#ff22bc", "#7a5b29", "#5d55ae", "#d26998", "#1d6e4a", "#ca772a", "#8f9024", "#a221af", "#675d6c", "#6547d0", "#8f4e4c", "#ba0e6e", "#ac382d")
    // generated colors here: http://jnnnnn.github.io/category-colors-2L-inplace.html8
    // idea for this here: https://stackoverflow.com/questions/20847161/how-can-i-generate-as-many-colors-as-i-want-using-d3/30912617
    // the scales that have worked here: https://github.com/d3/d3-scale-chromatic
    
    */
    
    var cScale = d3.scaleOrdinal(d3.schemeTableau10)
    
    //axisis
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)
    
    var svg = d3.select("#Scatter")
    .append("svg")
    .attr("width", screen.width)
    .attr("height", screen.height);
    
    svg.append("g")
    .attr("id","Axis")
    .attr("transform","translate("+margins.left+","+(margins.top+height+20)+")")
    .call(xAxis)
    
    svg.append("text")
    .attr("transform", "translate("+ ((width+100)/2)+","+(height+margins.top+55)+")")
    .style("text-anchor", "middle")
    .text("Co2 Emissions per capita (metric tons)")
    
    svg.append("g")
    .attr("id","Axis")
    .attr("transform","translate("+margins.left+","+margins.top+")")
    .call(yAxis);
    
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", (margins.left-55))
    .attr("x", 0-((height+40) / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Domestic Material Consumption per capita (metric tons)");     
    
    //actually doing the initializing
    svg.append("g")
    .attr("id", "scatterplot")
    .attr("transform", "translate("+margins.left+","+margins.top+")");
    
    console.log(realData)
    
    var tenArray= realData.map(makeTen);
    
    d3.select("#scatterplot")
    .selectAll("circle")
    .data(realData)
    .enter()
    .append("circle")
    
    //calling and passing to other things
    drawCircles(tenArray, xScale, yScale, rScale, cScale)
    
    makeButton(realData, xScale, yScale, rScale, cScale)
}

//draws the circles and handles the mouseover
var drawCircles = function(dataArray, xScale, yScale, rScale, cScale)
{
            
    var spots = d3.select("#scatterplot")        
    .selectAll("circle")
    .data(dataArray)
                        
    spots.transition()
    .duration(1000)
    .attr("cx", function(d)
    {
        return xScale(d.X)
    }) 
    .attr("cy", function(d)
    {
        return yScale(d.Y)
    })
    .attr("r", function(d)
    {
        return rScale(d.R)
    })
    .attr("fill", function(d)
    {
        return cScale(d.Name)
    })
    spots.on("mouseover", function(d)
        {   
            var xPosition = d3.event.pageX; //add later to tweak
            var yPosition = d3.event.pageY;

            var tooltip = d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .select("#name")
            .text(d.Name + ": " + d.R)

            d3.select("#tooltip").classed("hidden", false);
        })
    .on("mouseout", function()
        {
            d3.select("#tooltip")
            .classed("hidden", true);
        })
}

//this makes the button and sets what happens when you click it
var makeButton= function(realData, xScale, yScale, rScale, cScale)
{
    d3.select("#buttonHome")
    .append("button")
    .attr("id", "change")
    .text("Advance Timeline")
    .on("click", function()
    {
        var fifteenArray = realData.map(makeFifteen);
        
        console.log("button works!")
        drawCircles(fifteenArray, xScale, yScale, rScale, cScale)
        
        var tScale = d3.scaleLinear()
                    .domain([2005,2020])
                    .range([0, 800]) ///this width I did the bad way... adjust if it changes!!!!!
        
        d3.select("#TICK")
        .transition()
        .duration(1000)
        .attr("x", tScale(2015)) 
})
    
}

/// begin extra SVG for the time slider dude down there
var timelineSetup = function()
{
    //dimensions
    var tScreen = {width: 800, height: 100}
    
    var tMargins = {top: 10, bottom: 30, left: 50, right: 25}
    
    var width = tScreen.width - tMargins.left - tMargins.right
    var tHeight = tScreen.height - tMargins.top - tMargins.bottom
    
    var tScale = d3.scaleLinear()
                    .domain([2005, 2020])
                    .range([0, width])
    
    //axis
    var xAxis = d3.axisBottom()
                    .scale(tScale)
                    .tickFormat(d3.format("d"))
                    .ticks(16)
   
    var svg = d3.select("#Time")
    .append("svg")
    .attr("class", "timeline")
    .attr("width", tScreen.width)
    .attr("height", tScreen.height);
    
    svg.append("g")
    .attr("id","Axis")
    .attr("transform","translate("+tMargins.left+","+(tMargins.top+tHeight)+")")
    .call(xAxis)
    
    svg.append("text")
    .attr("transform", "translate("+ ((width+100)/2)+","+(tHeight+tMargins.top+30)+")")
    .style("text-anchor", "middle")
    .text("Year")
    
    //initializing the timeline
    drawTick(2010, tScale) 
}


//this function is called to draw the rectangle tick mark
var drawTick = function(year, tScale) 
{    
    var tick = d3.select("svg.timeline")
    .append("rect")
    .attr("id", "TICK")
    .attr("x", function(trash)
    {
        return tScale(year) + 50    //that 50 is tMargins.left, I caved and did it the bad way  
    }) 
    .attr("y", function(time)
    {
        return 62.5  //this number should be, tHeight+tMargins.top-7.5, I cheated
    })
    .attr("width", 5)
    .attr("height", 15)
    .attr("fill", "black")  
}