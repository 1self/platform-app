var hoursSleptVsBuilds = function() {
    var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 40
    },
        width = $("#hours-slept-vs-builds").width() * 1,
        height = width / 1.61 * 0.8;

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

    var svg = d3.select("#hours-slept-vs-builds").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("js/hours-slept-vs-builds.tsv", function(error, data) {
        data.forEach(function(d) {
            d.sepalLength = +d.sepalLength;
            d.sepalWidth = +d.sepalWidth;
        });

        var rawData = data.map(function(d, i) {
            return [d.sepalWidth, d.sepalLength];
        })

        var reg = regression("linear", rawData);

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
            .text("Builds");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Hours slept")

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

        // regression line
        var regLine = d3.svg.line()
            .x(function(d, i) {
                //return xLinear(i) * w;
                return x(d[0]);
            })
            .y(function(d, i) {

                return y(d[1]);
            });

        var lineToDraw = regLine(reg.points);

        svg.append("path")
            .attr("class", "regression-line")
            .attr("d", lineToDraw)
            .style("fill", "none")
            .style("stroke", "lightblue")
            .style("stroke-width", 2);



    });
};

hoursSleptVsBuilds();