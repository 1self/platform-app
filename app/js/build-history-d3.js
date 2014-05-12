var plotChart = function() {
    var s = d3.select('#build-history svg');
    s = s.remove();

    var w = $("#build-history").width() * 1;
    var h = w / 1.61;
    var p = [h * 0.05, w * 0.1, h * 0.2, w * 0.05],
        x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
        xLinear = d3.scale.linear().range([0, w - p[1] - p[3]]);
    y = d3.scale.linear().range([0, h - p[0] - p[2]]),
    z = d3.scale.ordinal().range(["lightpink", "lightblue"]),
    parse = d3.time.format("%m/%d/%Y").parse,
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

    buildHistory = window.qd.allEvents;

    //HPEYJCCGREGTZOPU
    //D6B1leGgHLIaACVQZ8ezMt2gUGT1jIY1Tc0FQXfP5HYBvRN50bEeK1ORJu7ckJT82wPmGQeojrKtiXo4HzYdeYANOZWFCfPQyw5CmKrkJyZ6EIMEoSOmvURUyNuqCgbSYhtj11t0VhxduJfOxajMxAJM+eOURleagk0UxVshvJm0cCrnhzqFf9QFQKps4VMdAI9F15BmpchaarOYmEg2whIbLN5uw0xqtQ6BCmpOX3n71ELGTr5rYkeWL1B5V8PcqcC1vmlV7FdOl59vy/Xk64/DrSO6uR/cfKVM/I+ZEDrJ4tcAK2CbfrV8u+wSkRTabAAAdW6OaHFokFl7MLsgHA==

    /*d3.json("http://quantifieddev.herokuapp.com/quantifieddev/mydev/" + window.qd.streamId)
        .header("Authorization", window.qd.readToken)
        .header("Content-Type", "application/json")
        .get(function(error, buildHistory) {
*/

    // Transpose the data into layers by cause.
    var buildsByResult = d3.layout.stack()(["failed", "passed"].map(function(cause) {
        return buildHistory.map(function(d) {
            return {
                x: parse(d.date),
                y: +d[cause]
            };
        });
    }));

    // Compute the x-domain (by date) and y-domain (by top).        
    x.domain(buildsByResult[0].map(function(d) {
        return d.x;
    }));
    xLinear.domain([0, buildsByResult[0].length]);
    y.domain([0, d3.max(buildsByResult[buildsByResult.length - 1], function(d) {
        return d.y0 + d.y;
    })]);


    // Add a group for each cause.
    var cause = svg.selectAll("g.cause")
        .data(buildsByResult)
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

    // Failed Builds Average:
    var failedBuildsMovingAverage = d3.svg.line()
        .x(function(d, i) {
            //return xLinear(i) * w;
            return xLinear(i);
        })
        .y(function(meanDay, i) {
            var filteredData = buildHistory.filter(function(rangeDay, fi) {


                var extent = 5;
                var end = 0;
                var begin = 5;

                if (day == 0) {
                    end += 2;
                    begin += 2;
                }

                if (day == 6) {
                    end += 1;
                    begin += 1;
                }

                var day = new Date(rangeDay.date).getDay();
                if (fi > i - 7 && fi <= i) {
                    if (day != 0 && day != 6) {
                        return rangeDay;
                    }
                }
            })
            var curval = d3.mean(filteredData, function(d) {
                // var day = new Date(d.date).getDay();
                // if (day > 0 && day < 6) {
                //     return d.failed;
                // } else {
                //     return null;
                // }
                return d.failed;
            });
            return -y(curval); // going up in height so need to go negative
        })
        .interpolate("basis");

    svg.append("path")
        .attr("class", "average")
        .attr("d", failedBuildsMovingAverage(buildHistory))
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", 2);

    // Successful Builds Average:
    var passedBuildsMovingAverage = d3.svg.line()
        .x(function(d, i) {
            //return xLinear(i) * w;
            return xLinear(i);
        })
        .y(function(d, i) {
            var filteredData = buildHistory.filter(function(rangeDay, fi) {


                var extent = 5;
                var end = 0;
                var begin = 5;

                if (day == 0) {
                    end += 2;
                    begin += 2;
                }

                if (day == 6) {
                    end += 1;
                    begin += 1;
                }

                var day = new Date(rangeDay.date).getDay();
                if (fi > i - 7 && fi <= i) {
                    if (day != 0 && day != 6) {
                        return rangeDay;
                    }
                }
            });

            var curval = d3.mean(filteredData, function(d) {
                // var day = new Date(d.date).getDay();
                // if (day > 0 && day < 6) {
                //     return d.passed;
                // } else {
                //     return null;
                // }
                return +d.passed + +d.failed;
            });
            return -y(curval); // going up in height so need to go negative
        })
        .interpolate("basis");

    svg.append("path")
        .attr("class", "average")
        .attr("d", passedBuildsMovingAverage(buildHistory))
        .style("fill", "none")
        .style("stroke", "blue")
        .style("stroke-width", 2);


    var weekDays = buildHistory.filter(function(day, fi) {

        var dayOfWeek = new Date(day.date).getDay();

        if (dayOfWeek != 0 && dayOfWeek != 6) {
            return day;
        }
    });

    var overallMean = d3.mean(weekDays, function(d) {
        return +d.passed + +d.failed;
    });


    // Successful Builds Average:
    var overallAverage = d3.svg.line()
        .x(function(d, i) {
            //return xLinear(i) * w;
            return xLinear(i);
        })
        .y(function(d, i) {
            return -y(overallMean);
            s
        });

    svg.append("path")
        .attr("class", "average")
        .attr("d", overallAverage(buildHistory))
        .style("fill", "none")
        .style("stroke", "orange")
        .style("stroke-width", 2);

};

window.qd.registerForModelUpdates(plotChart);