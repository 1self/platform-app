var buildDurationVsUnproductivity = function() {
    var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 40
    },
        width = $("#build-duration-vs-unproductivity").width() * 0.855,
        height = width / 1.61;

    var x = d3.scale.linear()
        .range([0, width - margin.right]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#build-duration-vs-unproductivity").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("js/build-duration-vs-unproductivity.tsv", function(error, data) {
        data.forEach(function(d) {
            d.sepalLength = +d.sepalLength;
            d.sepalWidth = +d.sepalWidth;
        });

        x.domain(d3.extent(data, function(d) {
            return d.sepalWidth;
        })).nice();
        y.domain(d3.extent(data, function(d) {
            return d.sepalLength;
        })).nice();

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width - 40)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Build Duration (mins)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Unproductivity %")

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function(d) {
                return x(d.sepalWidth);
            })
            .attr("cy", function(d) {
                return y(d.sepalLength);
            })
            .style("fill", function(d) {
                return color(d.species);
            });



    });
};

buildDurationVsUnproductivity();