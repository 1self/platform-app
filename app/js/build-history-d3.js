var w = $("#build-history").width() * 1;
var h = w / 1.61;
var p = [4, 10, 6, 4],
    x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
    xLinear = d3.scale.linear().range([0, w - p[1] - p[3]]);
y = d3.scale.linear().range([0, h - p[0] - p[2]]),
z = d3.scale.ordinal().range(["lightpink", "lightblue"]),
parse = d3.time.format("%d/%m/%Y").parse,
format = d3.time.format("%d");
formatMonth = d3.time.format("%b");

var svg = d3.select("#build-history").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

example_data = function() {
    //Building a random growing trend
    var data = [
        [new Date(2014, 2, 4, 8, 0, 0, 0), 42],
        [new Date(2014, 3, 4, 8, 0, 0, 0), 42]
    ];
    return data;
}



d3.csv("js/crimea.csv", function(crimea) {

    // Transpose the data into layers by cause.
    var causes = d3.layout.stack()(["failed", "passed"].map(function(cause) {
        return crimea.map(function(d) {
            return {
                x: parse(d.date),
                y: +d[cause]
            };
        });
    }));

    // Compute the x-domain (by date) and y-domain (by top).
    x.domain(causes[0].map(function(d) {
        return d.x;
    }));
    xLinear.domain([0, causes[0].length]);
    y.domain([0, d3.max(causes[causes.length - 1], function(d) {
        return d.y0 + d.y;
    })]);


    // Add a group for each cause.
    var cause = svg.selectAll("g.cause")
        .data(causes)
        .enter().append("svg:g")
        .attr("class", "cause")
        .style("fill", function(d, i) {
            return z(i);
        })
        .style("stroke", function(d, i) {
            return d3.rgb(z(i)).darker();
        });

    // Add a rect for each date.
    var rect = cause.selectAll("rect")
        .data(Object)
        .enter().append("svg:rect")
        .attr("x", function(d) {
            return x(d.x);
        })
        .attr("y", function(d) {
            return -y(d.y0) - y(d.y);
        })
        .attr("height", function(d) {
            return y(d.y);
        })
        .attr("width", x.rangeBand());

    //    Add a label per date
    var label = svg.selectAll("text.month")
        .data(x.domain())
        .enter().append("svg:text")
        .attr("x", function(d) {
            return x(d) + x.rangeBand() / 2;
        })
        .attr("y", 6)
        .attr("text-anchor", "middle")
        .attr("dy", ".71em")
        .text(function(d, i) {
            return (i % 7) ? null : formatMonth(d);
        });

    var filterFormat = format;
    if (w < 800) {
        filterFormat = function(d, i) {
            return (i % 7) ? null : format(d);
        };
    }

    var label = svg.selectAll("text.day")
        .data(x.domain())
        .enter().append("svg:text")
        .attr("x", function(d) {
            return x(d) + x.rangeBand() / 2;
        })
        .attr("y", 19)
        .attr("text-anchor", "middle")
        .attr("dy", ".71em")
        .text(filterFormat);

    // Add y-axis rules.
    var rule = svg.selectAll("g.rule")
        .data(y.ticks(5))
        .enter().append("svg:g")
        .attr("class", "rule")
        .attr("transform", function(d) {
            return "translate(0," + -y(d) + ")";
        });

    rule.append("svg:line")
        .attr("x2", w - p[1] - p[3])
        .style("stroke", function(d) {
            return d ? "#fff" : "#000";
        })
        .style("stroke-opacity", function(d) {
            return d ? .7 : null;
        });

    rule.append("svg:text")
        .attr("x", w - p[1] - p[3] + 6)
        .attr("dy", ".35em")
        .text(d3.format(",d"));

    // Average:
    var movingAverageLine = d3.svg.line()
        .x(function(d, i) {
            //return xLinear(i) * w;
            return xLinear(i);
        })
        .y(function(d, i) {
            var filteredData = crimea.filter(function(d, fi) {
                if (fi <= i && i - fi <= 5) {
                    return d;
                } else {
                    return null;
                }
            })
            var curval = d3.mean(filteredData, function(d) {
                return d.failed;
            });
            return -y(curval); // going up in height so need to go negative
        })
        .interpolate("basis");

    svg.append("path")
        .attr("class", "average")
        .attr("d", movingAverageLine(crimea))
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", 2);
});