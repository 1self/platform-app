var liveworld = function() {

    var liveDurationMins = 60; // default duration of 1 hour
    var selectedLanguage = "all"; // default to all languages

    var registerButtonClickHandlers = function() {
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
    };

    $("#language-select").change(function() {
        selectedLanguage = $(this).find(":selected").val();
        console.log("the value you selected: " + selectedLanguage);
        loadData();
    });

    registerButtonClickHandlers();

    var width = $("#live-world").parent().parent().width();
    var height = width;
    var speed = -1e-3;
    var start = Date.now();

    var sphere = {
        type: "Sphere"
    };

    var projection = d3.geo.orthographic()
        .scale(width / 2.1)
        .clipAngle(90)
        .translate([width / 2, height / 2]);

    var graticule = d3.geo.graticule();

    var canvas = d3.select("#live-world").append("canvas")
        .attr("width", width)
        .attr("height", height);

    var context = canvas.node().getContext("2d");

    var path = d3.geo.path()
        .projection(projection)
        .context(context);

    d3.select(self.frameElement).style("height", height + "px");

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

    loadData();
    setInterval(function() {
            loadData()
        },
        60000);

    var CircleSize = function(compile) {
        var size = Math.random(1, 0.7) * 0.7;
        return function() {
            if (compile.status == 'buildPassed') {
                if (size <= 0.05) {
                    size = 0.005;
                } else {
                    size -= 0.0005;
                }
            } else {
                size += 0.05;
                if (size > 3.5) {
                    size = 0.5;
                }
            }

            return size;
        }
    };

    var compiles;

    var createCircles = function() {
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
        animateCircles();
    }

    var animateCircles = function() {
        d3.json("topo/world-110m.json", function(error, topo) {
            var land = topojson.feature(topo, topo.objects.land),
                grid = graticule();

            d3.timer(function() {
                //console.log(new Date().toJSON());
                var λ = (speed * (Date.now() - start) * 2),
                    φ = -15;

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
                projection.rotate([λ + 180, -φ]);

                context.beginPath();
                path(land);
                context.fillStyle = "#dadac4";
                context.fill();

                context.beginPath();
                path(grid);
                context.lineWidth = .5;
                context.strokeStyle = "rgba(0,0,119,.2)";
                context.stroke();

                context.restore();
                projection.rotate([λ, φ]);

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
    }

};

liveworld();