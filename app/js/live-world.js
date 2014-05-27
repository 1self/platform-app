var liveworld = function() {
    var counter = 0;
    var liveDurationMins = 60; // default duration of 1 hour
    var selectedLanguage = "all"; // default to all languages

    $("#world-time-select").change(function() {
        liveDurationMins = $(this).find(":selected").val();
        console.log("the value you selected: " + liveDurationMins);
        loadData();
    });

    $("#world-language-select").change(function() {
        selectedLanguage = $(this).find(":selected").val();
        console.log("the value you selected: " + selectedLanguage);
        loadData();
    });

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
            var allLocations = [];
            for (var i = builds.length - 1; i >= 0; i--) {
                var buildFromServer = builds[i].payload;
                var isFinish = buildFromServer.actionTags.indexOf('Finish');
                var build = {
                    id: i,
                    location: {
                        lon: buildFromServer.location.long,
                        lat: buildFromServer.location.lat
                    },
                    status: isFinish == -1 ? 'buildStarted' : 'buildFailing',
                    language: buildFromServer.properties.Language[0]
                }
                if (!(_.findWhere(allLocations, build.location))) {
                    compileCoords.push(build);
                    allLocations.push(build.location);
                }
            };
            console.info("compileCoords : " + compileCoords[0] + " and length : " + compileCoords.length);
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
                if (size <= 0.03) {
                    size = 0.003;
                } else {
                    size -= 0.0003;
                }
            } else {
                size += 0.03;
                if (size > 2.1) {
                    size = 0.3;
                }
            }

            return size;
        }
    };

    var compiles;

    var createCircles = function() {
        compiles = compileCoords.map(function(compile) {
            var circleSize = new CircleSize(compile);

            var draw = function(context) {
                var circle = d3.geo.circle().angle(circleSize()).origin([compile.location.lon, compile.location.lat]);
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

            var redrawGlobe = function() {
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
                // console.info("counter : " + counter++);
                setTimeout(redrawGlobe, 1000);
            };
            redrawGlobe();
        });
    }

};

liveworld();