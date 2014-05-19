var liveeurope = function() {
    var liveDurationMins = 60; // default duration of 1 hour

    $('#last-minute').click(function() {
        liveDurationMins = 1;
        loadData();
    });

    $('#last-hour').click(function() {
        liveDurationMins = 60;
        loadData();
    });

    $('#last-day').click(function() {
        liveDurationMins = 60 * 24;
        loadData()
    });

    $('#last-week').click(function() {
        liveDurationMins = 60 * 24 * 7;
        loadData();
    });

    // Bit hacky to ge the width and height
    var width = $("#live-world").parent().parent().width()
    height = width,
    speed = -1e-3,
    start = Date.now();

    var sphere = {
        type: "Sphere"
    };


    $.getJSON("http://jsonip.com?callback=?", function(ipDetails) {
        $.ajax({
            url: "http://quantifieddev.herokuapp.com/" + ipDetails.ip,
            success: function(locationInfo) {
                locationInfo = $.parseJSON(locationInfo);
                var centerLatitude = locationInfo.latitude;
                var centerLongitude = locationInfo.longitude;
                var countryName = locationInfo.country_name;
                plotCountry(countryName, centerLatitude, centerLongitude);
            },
            error: function(err) {
                console.log("error is " + JSON.stringify(err));
            }
        })
    });


    var plotCountry = function(countryName, centerLatitude, centerLongitude) {

        $("#country").text(countryName + "'s Builds");
        var projection = d3.geo.mercator()
            .scale(width * 2)
            // .clipAngle(90)
            .translate([width / 2, height / 2])
            .center([centerLongitude, centerLatitude])

        var graticule = d3.geo.graticule();

        var canvas = d3.select("#live-country").append("canvas")
            .attr("width", width)
            .attr("height", height);

        var loadData = function() {
            d3.json("http://quantifieddev.herokuapp.com/live/devbuild/" + liveDurationMins, function(error, builds) {
                var data = builds;
                compileCoords = [];
                for (var i = builds.length - 1; i >= 0; i--) {
                    var buildFromServer = builds[i];
                    var isFinish = buildFromServer.actionTags.indexOf('Finish');
                    var build = {
                        id: i,
                        location: [buildFromServer.location.long, buildFromServer.location.lat],
                        status: isFinish == -1 ? 'buildStarted' : 'buildFailing'
                    }
                    compileCoords.push(build);
                };

                createCircles();
            })
        };

        loadData();
        setInterval(function() {
            loadData()
        }, 60000);

        function CircleSize(compile) {
            var size = Math.random(1, 0.7) * 0.7;

            return function() {
                if (compile.status == 'buildPassed') {
                    if (size <= 0.01) {
                        size = 0.001;
                    } else {
                        size -= 0.0001;
                    }
                } else {
                    size += 0.01;
                    if (size > 0.7) {
                        size = 0.1;
                    }
                }

                return size;
            }
        };

        var compiles;

        function createCircles() {
            compiles = compileCoords.map(function(compile) {
                var circleSize = new CircleSize(compile);

                var getFillColor = function(compile) {
                    var result;
                    if (compile.status == 'buildStarted') {
                        result = "rgba(0,0,100,.3)";
                    } else if (compile.status == 'buildFailing') {
                        result = "rgba(180,0,0,.3)";
                    } else if (compile.status == 'buildPassed') {
                        result = "rgba(0,180,0,.3)";
                    } else {
                        result = "rgba(100,100,100,.3)";
                    }

                    return result;
                }

                var draw = function(context) {
                    var circle = d3.geo.circle().angle(circleSize()).origin(compile.location);
                    circlePoints = [circle()];
                    context.beginPath();
                    path({
                        type: "GeometryCollection",
                        geometries: circlePoints
                    });
                    context.fillStyle = getFillColor(compile);
                    context.fill();
                    context.lineWidth = .2;
                    context.strokeStyle = "#FFF";
                    context.stroke();
                }

                return draw;
            });
        }

        d3.json("topo/world-110m.json", function(error, topo) {
            var land = topojson.feature(topo, topo.objects.land),
                grid = graticule();



            d3.timer(function() {
                context.clearRect(0, 0, width, height);

                context.beginPath();
                path(sphere);
                context.lineWidth = 3;
                context.strokeStyle = "#000";
                context.stroke();
                context.fillStyle = "#fff";
                context.fill();

                context.save();
                context.translate(width / 2, 0);
                context.scale(-1, 1);
                context.translate(-width / 2, 0);

                context.beginPath();
                path(grid);
                context.lineWidth = .5;
                context.strokeStyle = "rgba(0,0,119,.2)";
                context.stroke();

                context.restore();

                context.beginPath();
                path(grid);
                context.lineWidth = .5;
                context.strokeStyle = "rgba(0,119,119,.2)";
                context.stroke();

                context.beginPath();
                path(land);
                context.fillStyle = "rgba(0,100,0,.5)";
                context.fill();
                context.lineWidth = .5;
                context.strokeStyle = "#060";
                context.stroke();

                if (compiles != undefined) {
                    compiles.forEach(function(drawCompile) {
                        drawCompile(context);
                    });
                }

            });
        });

        var context = canvas.node().getContext("2d");

        var path = d3.geo.path()
            .projection(projection)
            .context(context);


        d3.select(self.frameElement).style("height", height + "px");
    }

}();