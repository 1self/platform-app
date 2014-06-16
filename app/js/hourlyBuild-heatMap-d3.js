window.qd.plotHourlyBuildHeatMap = function() {
	function circularHeatChart() {
		var margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 70
			},
			innerRadius = 50,
			numSegments = 24,
			segmentHeight = 20,
			domain = null,
			range = ["white", "red"],
			accessor = function(d) {
				return d;
			},
			radialLabels = segmentLabels = [];

		function chart(selection) {
			selection.each(function(data) {
				var svg = d3.select(this);

				var offset = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight;
				g = svg.append("g")
					.classed("circular-heat", true)
					.attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

				var autoDomain = false;
				if (domain === null) {
					domain = d3.extent(data, accessor);
					autoDomain = true;
				}
				var color = d3.scale.linear().domain(domain).range(range);
				if (autoDomain)
					domain = null;

				g.selectAll("path").data(data)
					.enter().append("path")
					.attr("d", d3.svg.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
					.attr("fill", function(d) {
						return color(accessor(d));
					})
					.attr("stroke", "lightgrey");


				// Unique id so that the text path defs are unique - is there a better way to do this?
				var id = d3.selectAll(".circular-heat")[0].length;

				//Radial labels
				var lsa = 0.01; //Label start angle
				var labels = svg.append("g")
					.classed("labels", true)
					.classed("radial", true)
					.attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

				labels.selectAll("def")
					.data(radialLabels).enter()
					.append("def")
					.append("path")
					.attr("id", function(d, i) {
						return "radial-label-path-" + id + "-" + i;
					})
					.attr("d", function(d, i) {
						var r = innerRadius + ((i + 0.2) * segmentHeight);
						return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) +
							" a" + r + " " + r + " 0 1 1 -1 0";
					});

				labels.selectAll("text")
					.data(radialLabels).enter()
					.append("text")
					.append("textPath")
					.attr("xlink:href", function(d, i) {
						return "#radial-label-path-" + id + "-" + i;
					})
					.style("font-size", 0.6 * segmentHeight + 'px')
					.text(function(d) {
						return d;
					});

				//Segment labels
				var segmentLabelOffset = 2;
				var r = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight + segmentLabelOffset;
				labels = svg.append("g")
					.classed("labels", true)
					.classed("segment", true)
					.attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

				labels.append("def")
					.append("path")
					.attr("id", "segment-label-path-" + id)
					.attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");

				labels.selectAll("text")
					.data(segmentLabels).enter()
					.append("text")
					.append("textPath")
					.attr("xlink:href", "#segment-label-path-" + id)
					.attr("startOffset", function(d, i) {
						return i * 100 / numSegments + "%";
					})
					.text(function(d) {
						return d;
					});
			});

		}

		/* Arc functions */
		ir = function(d, i) {
			return innerRadius + Math.floor(i / numSegments) * segmentHeight;
		}
		or = function(d, i) {
			return innerRadius + segmentHeight + Math.floor(i / numSegments) * segmentHeight;
		}
		sa = function(d, i) {
			return (i * 2 * Math.PI) / numSegments;
		}
		ea = function(d, i) {
			return ((i + 1) * 2 * Math.PI) / numSegments;
		}

		/* Configuration getters/setters */
		chart.margin = function(_) {
			if (!arguments.length) return margin;
			margin = _;
			return chart;
		};

		chart.innerRadius = function(_) {
			if (!arguments.length) return innerRadius;
			innerRadius = _;
			return chart;
		};

		chart.numSegments = function(_) {
			if (!arguments.length) return numSegments;
			numSegments = _;
			return chart;
		};

		chart.segmentHeight = function(_) {
			if (!arguments.length) return segmentHeight;
			segmentHeight = _;
			return chart;
		};

		chart.domain = function(_) {
			if (!arguments.length) return domain;
			domain = _;
			return chart;
		};

		chart.range = function(_) {
			if (!arguments.length) return range;
			range = _;
			return chart;
		};

		chart.radialLabels = function(_) {
			if (!arguments.length) return radialLabels;
			if (_ == null) _ = [];
			radialLabels = _;
			return chart;
		};

		chart.segmentLabels = function(_) {
			if (!arguments.length) return segmentLabels;
			if (_ == null) _ = [];
			segmentLabels = _;
			return chart;
		};

		chart.accessor = function(_) {
			if (!arguments.length) return accessor;
			accessor = _;
			return chart;
		};

		return chart;
	}
	var daysOfWeek = ["Sunday", "Saturday", "Friday", "Thursday", "Wednesday", "Tuesday", "Monday"];

	var assignDaysOfWeekTo = function(datesOfWeek, dateString) {
		var dayOfWeek = new Date(dateString).getDay();
		datesOfWeek[dateString] = daysOfWeek[dayOfWeek]
	}

	var segmentData = [];

	for (var hour = 0; hour < 24 * 7; hour++) {
		var buildCountForAnHour = window.qd.hourlyBuildEvents[hour].hourlyBuildCount;
		var segmentDay = window.qd.hourlyBuildEvents[hour].day;

		segmentData[hour] = buildCountForAnHour;
	};

	var labels = [];
	var assignValuesTo = function(labels, values) {
		var i = 0;
		for (value in values) {
			labels[i] = values[value]
			i++;
		}
	}
	assignValuesTo(labels, daysOfWeek);

	var chart = circularHeatChart()
		.innerRadius(30)
		.range(["#EFF0DD", "green"])
		.radialLabels(labels)
		.segmentLabels(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
			"11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"
		]);

	segmentData = _.flatten(_.toArray(_.groupBy(segmentData, function(element, index) {
		return Math.floor(index / 24);
	})).reverse());

	d3.select('#hourlyBuild-heat-map')
		.selectAll('svg')
		.data([data])
		.enter()
		.append('svg')
		.call(chart);
};