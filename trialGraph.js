//works to create a scatterplot with different size circles and colors

var sampleData= [{name: "fred", rise: 12, run: 5, width: 6},
                {name: "sam", rise: 15, run: 7, width: 7},
                {name: "pebbles", rise: 18, run: 11, width: 9},
                {name: "barney", rise: 8, run: 15, width: 6},
                {name: "george", rise: 9, run: 17, width: 10},
                {name: "green", rise: 13, run: 19, width: 3},
                {name: "orange", rise: 5, run: 15, width: 2},
                {name: "red", rise: 3, run: 12, width: 1},
                {name: "yellow", rise: 1, run: 3, width: 5},
                {name: "purple", rise: 12, run: 7, width: 6},]

var screen = {width: 800, height: 500}

var setup = function(sampleData)
{
    var xScale = d3.scaleLinear()
                    .domain([0,20])
                    .range([0,screen.width])
    
    var yScale = d3.scaleLinear()
                    .domain([0,20])
                    .range([screen.height,0])
    
    var rScale = d3.scaleLinear()
                    .domain([0,10])
                    .range([0,50])
    
    var cScale = d3.scaleOrdinal(d3.schemeTableau10)
    
    drawCircles(sampleData, xScale, yScale, rScale, cScale)
}


var drawCircles = function(sampleData, xScale, yScale, rScale, cScale)
{
    var svg = d3.select("body")
                .append("svg")
                .attr("width", screen.width)
                .attr("height", screen.height);
    
        svg.selectAll("circle")
            .data(sampleData)
            .enter()
            .append("circle")
            .attr("cx", function(d)
                 {return xScale(d.run)})
            .attr("cy", function(d)
                 {return yScale(d.rise)})
            .attr("r", function(d)
                 {return rScale(d.width)})
            .attr("fill", function(d)
                 {return cScale(d.name)})
}

setup(sampleData)
