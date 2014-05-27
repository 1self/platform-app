var liveCountry = function() {
    var liveDurationMins = 60; // default duration of 1 hour
    var selectedLanguage = "all"; // default to all languages
    
    $("#country-time-select").change(function() {
        liveDurationMins = $(this).find(":selected").val();
        console.log("the value you selected: " + liveDurationMins);
        loadData();
    });

    $("#country-language-select").change(function() {
        selectedLanguage = $(this).find(":selected").val();
        console.log("the value you selected: " + selectedLanguage);
        loadData();
    });

    // Bit hacky to ge the width and height
    var width = $("#live-world").parent().parent().width();
    var height = width;
    var graticule = d3.geo.graticule();
    var canvas = d3.select("#live-country").append("canvas")
        .attr("width", width)
        .attr("height", height);
    var context = canvas.node().getContext("2d");
    var path;

    var plotGraph = function() {
        $.getJSON("http://jsonip.com?callback=?", function(ipDetails) {
            $.ajax({
                url: "http://quantifieddev.herokuapp.com/" + ipDetails.ip,
                success: function(locationInfo) {
                    locationInfo = $.parseJSON(locationInfo);
                    var centerLatitude = locationInfo.latitude;
                    var centerLongitude = locationInfo.longitude;
                    var countryName = locationInfo.country_name;

                    $("#country").text(countryName + "'s Builds");

                    var projection = d3.geo.mercator()
                        .scale(width * 2)
                        // .clipAngle(90)
                        .translate([width / 2, height / 2])
                        .center([centerLongitude, centerLatitude]);

                    path = d3.geo.path()
                        .projection(projection)
                        .context(context);

                    d3.select(self.frameElement).style("height", height + "px");

                    loadData();
                },
                error: function(err) {
                    console.log("error is " + JSON.stringify(err));
                }
            })
        });
    };

    plotGraph();


    var loadData = function() {
        var liveDevBuildUrl = "http://quantifieddev.herokuapp.com/live/devbuild/" + liveDurationMins;

        liveDevBuildUrl += (selectedLanguage !== "all") ? "?lang=" + selectedLanguage : "";

        d3.json(liveDevBuildUrl, function(error, builds) {
            var data = builds;
            compileCoords = [];
            for (var i = builds.length - 1; i >= 0; i--) {
                var buildFromServer = builds[i].payload;
                var isFinish = buildFromServer.actionTags.indexOf('Finish');
                var build = {
                    id: i,
                    location: [buildFromServer.location.long, buildFromServer.location.lat],
                    status: isFinish == -1 ? 'buildStarted' : 'buildFailing',
                    language: buildFromServer.properties.Language[0]
                }
                compileCoords.push(build);
            };

            createCircles();
        })
    };

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

            var draw = function(context) {
                var circle = d3.geo.circle().angle(circleSize()).origin(compile.location);
                circlePoints = [circle()];
                context.beginPath();
                path({
                    type: "GeometryCollection",
                    geometries: circlePoints
                });
                context.fillStyle = "rgba(17, 13, 255, .3)";
                context.fill();
                context.lineWidth = .2;
                context.strokeStyle = "#FFF";
                context.stroke();
            }

            return draw;
        });
        animateCircles();
    }

    var animateCircles = function() {
        d3.json("topo/world-110m.json", function(error, topo) {
            var land = topojson.feature(topo, topo.objects.land),
                grid = graticule();

            setInterval(function() {
                context.clearRect(0, 0, width, height);

                context.beginPath();
                var sphere = {
                    type: "Sphere"
                };
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

            }, 200);
        });
    }

}();