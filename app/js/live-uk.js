var liveuk = function(){    
    var width = $("#live-world").parent().parent().width()
        height = width,
        speed = -1e-3,
        start = Date.now();

    var sphere = {type: "Sphere"};

    var projection = d3.geo.mercator()
        .scale(width * 8 )
        .clipAngle(90)
        .translate([width / 2, height / 2])
        .center([0, 52])

    var graticule = d3.geo.graticule();

    var canvas = d3.select("#live-uk").append("canvas")
        .attr("width", width)
        .attr("height", height);

    var compileCoords = [
        // {
        //     id: '1',
        //     location: [0.1275, 51.5072],
        //     label: 'london',
        //     status: 'buildStarted'
        // },
        // {
        //     id: '2',
        //     location: [73.8567, 18.5203],
        //     label: 'pune',
        //     status: 'buildStarted'
        // },
        // {
        //     id: '3',
        //     location: [72.8258, 18.9750],
        //     label: 'mumbai',
        //     status: 'buildFailing'
        // },
        // {
        //     id: '4',
        //     location: [-73.9400, 40.6700],
        //     label: 'New york',
        //     status: 'buildStarted'
        // },
        // {
        //     id: '5',
        //     location: [139.6917, 35.6895],
        //     label: 'Tokyo',
        //     status: 'buildStarted'
        // },
        // {
        //     id: '6',
        //     location: [144.9631, -37.8136],
        //     label: 'Melbourne ',
        //     status: 'buildStarted'
        // },
        // {
        //     id: '7',
        //     location: [-46.6333, -23.5500],
        //     label: 'Sao Paulo',
        //     status: 'buildPassed'
        // },
        // {
        //     id: '8',
        //     location: [-118.2500, 34.0500],
        //     label: 'LA',
        //     status: 'buildStarted'
        // },
        // {
        //     id: '9',
        //     location: [7.4833, 9.0667],
        //     label: 'Abuja',
        //     status: 'buildPassed'
        // },
        // {
        //     id: '10',
        //     location: [37.6167, 55.7500],
        //     label: 'Moscow',
        //     status: 'buildStarted'
        // },
        // {
        //     id: '11',
        //     location: [151.2111, -33.8600],
        //     label: ' Sydney',
        //     status: 'buildFailing'
        // },
    ];

    d3.json("http://quantifieddev.herokuapp.com/live/devbuild", function(error, builds){
        var data = builds;
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

    function CircleSize(compile){
        var size = Math.random(1, 0.07) * 0.07;

        return function(){
            if(compile.status == 'buildPassed'){
                if(size <= 0.001){
                    size = 0.0001;
                }
                else{
                    size -= 0.00001;
                }
            }
            else{
                size += 0.001;
                if(size > 0.07){
                    size = 0.01;
                }
            }
        
            return size;
        }  
    };

    var compiles;

    function createCircles(){
        compiles = compileCoords.map(function(compile){
            var circleSize = new CircleSize(compile);

            var getFillColor = function(compile){
                var result;
                if(compile.status == 'buildStarted'){
                    result = "rgba(0,0,100,.3)";
                }
                else if(compile.status == 'buildFailing'){
                    result = "rgba(180,0,0,.3)";
                }
                else if(compile.status == 'buildPassed'){
                    result = "rgba(0,180,0,.3)";
                }
                else {
                    result = "rgba(100,100,100,.3)";
                }

                return result;
            }

            var draw = function(context){
                var circle = d3.geo.circle().angle(circleSize()).origin(compile.location);
                circlePoints = [circle()];
                context.beginPath();
                path({type: "GeometryCollection", geometries: circlePoints});
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


        

        d3.timer(function(){
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

            if(compiles != undefined){
                compiles.forEach(function(drawCompile){
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
}();