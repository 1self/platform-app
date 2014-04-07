// SparkLine Bar and Pie Charts
$(function() {
    $('#visits').sparkline([3, 6, 7, 1, 4, 6, 3, 2, 9, 4, 5, 1], {
        type: 'line',
        lineWidth: 1,
        fillColor: '#3da9e3',
        lineColor: '#9FD5F1',
        height: 18,
        width: 90,
        spotRadius: 2,
    });
    $('#unique-visitors').sparkline([1, 4, 9, 2, 4, 2, 3, 8, 5, 2, 3, 8], {
        type: 'line',
        lineWidth: 1,
        fillColor: '#3da9e3',
        lineColor: '#9FD5F1',
        height: 18,
        width: 90,
        spotRadius: 2,
    });
    $('#page-views').sparkline([2, 4, 8, 2, 5, 1, 7, 3, 2, 7, 9, 2], {
        type: 'line',
        lineWidth: 1,
        fillColor: '#3da9e3',
        lineColor: '#9FD5F1',
        height: 18,
        width: 90,
        spotRadius: 2,
    });
    $('#bounce-rate').sparkline([4, 8, 9, 3, 5, 8, 5, 7, 2, 6, 3, 1], {
        type: 'line',
        lineWidth: 1,
        fillColor: '#5e5e5e',
        lineColor: '#9C9687',
        height: 18,
        width: 90,
        spotRadius: 2,
    });

    $('#dataLine').sparkline([280, 320, 220, 385, 450, 320, 345, 150, 250, 250, 400, 380], {
        type: 'line',
        lineWidth: 2,
        fillColor: '#f7f7f7',
        lineColor: '#1e91cf',
        height: 60,
        width: 300,
        spotRadius: 3,
    });

    $('#dow').sparkline([280, 320, 220, 385, 450, 320, 345, 250, 390, 250, 400, 380, 345, 250, 390, 250, 400, 380], {
        height: '24',
        type: 'bar',
        barSpacing: 2,
        barWidth: 6,
        barColor: '#ddd',
        tooltipPrefix: 'Volume: '
    });
    $('#dow').sparkline([280, 320, 220, 385, 450, 320, 345, 250, 390, 250, 400, 380, 345, 250, 390, 250, 400, 380], {
        composite: true,
        height: '30',
        fillColor: false,
        lineColor: '#1e91cf',
        tooltipPrefix: 'Index: '
    });

});



//Jquery vector map
$(function() {
    var cityAreaData = [
        230.20,
        750.90,
        440.28,
        180.15,
        69.35,
        280.90,
        510.50,
        99.60,
        135.50
    ]
    $('#us-map').vectorMap({
        map: 'us_aea_en',
        scaleColors: ['#C8EEFF', '#0071A4'],
        normalizeFunction: 'polynomial',
        focusOn: {
            x: 0,
            y: 2,
            scale: 1.5
        },
        zoomOnScroll: false,
        zoomMin: 0.75,
        hoverColor: true,
        regionStyle: {
            initial: {
                fill: '#9FD5F1',
                "fill-opacity": 1,
                stroke: '#aacb8f',
                "stroke-width": 0,
                "stroke-opacity": 0
            },
            hover: {
                "fill-opacity": 0.8
            },
            selected: {
                fill: 'yellow'
            },
        },
        markerStyle: {
            initial: {
                fill: '#F38733',
                stroke: '#F38733',
                "fill-opacity": 1,
                "stroke-width": 8,
                "stroke-opacity": 0.5,
                r: 3
            },
            hover: {
                stroke: 'black',
                "stroke-width": 3
            },
            selected: {
                fill: 'blue'
            },
            selectedHover: {}
        },
        backgroundColor: '#ffffff',
        markers: [{
            latLng: [37.30, -119.30],
            name: 'California, CA'
        }, {
            latLng: [36.10, -115.09],
            name: 'Las Vegas, Nev'
        }, {
            latLng: [56.48, -132.58],
            name: 'Petersburg, Alaska'
        }, {
            latLng: [29.35, -95.46],
            name: 'Richmond Tex'
        }, {
            latLng: [31.02, -85.52],
            name: 'Geneva, Ala'
        }, {
            latLng: [42.11, -73.30],
            name: 'Hillsdale, N.Y'
        }, {
            latLng: [32.90, -97.03],
            name: 'Dallas/FW,TX'
        }, {
            latLng: [34.11, -79.24],
            name: 'Marion S.C'
        }, {
            latLng: [40.09, -74.51],
            name: 'Levittown, Pa'
        }, {
            latLng: [32.33, -92.55],
            name: 'Arcadia, La'
        }, {
            latLng: [35.53, -11.25],
            name: 'Cameron, Ariz'
        }, {
            latLng: [39.46, -86.09],
            name: 'Indianapolis'
        }, {
            latLng: [38.32, -82.41],
            name: 'Ironton, Ohio'
        }, {
            latLng: [38.50, -104.49],
            name: 'Colorado Springs'
        }, {
            latLng: [45.14, -120.11],
            name: 'Condon'
        }, {
            latLng: [19.12, -155.29],
            name: 'Pahala'
        }, {
            latLng: [64.44, -120.17],
            name: 'Los Alamos, Calif'
        }, {
            latLng: [70.10, -105.06],
            name: 'Longmont'
        }, {
            latLng: [57.05, -134.50],
            name: 'Baranof'
        }, {
            latLng: [48.30, -122.14],
            name: 'Sedro Wooley'
        }, {
            latLng: [32.46, -108.17],
            name: 'Silver City'
        }, {
            latLng: [43.25, -74.22],
            name: 'Hamilton Mt.'
        }, {
            latLng: [32.42, -108.08],
            name: 'Hurley, N. Mex'
        }, {
            latLng: [35.22, -117.38],
            name: 'Johannesburg'
        }, {
            latLng: [40.50, -79.38],
            name: 'Worthington Pa'
        }, {
            latLng: [37.45, -119.40],
            name: 'Yosemite Nat. Park'
        }, {
            latLng: [41.09, -81.22],
            name: 'Kent, Ohio'
        }, {
            latLng: [40.0, -74.30],
            name: 'New Jersey'
        }, ],
        series: {
            markers: [{
                attribute: 'r',
                scale: [3, 7],
                values: cityAreaData
            }]
        },
    });
});

////Jquery vector map Dynamic Visits
var currentNumber = $('#dyn-visits').text();

$({
    numberValue: currentNumber
}).animate({
    numberValue: 345
}, {
    duration: 3000,
    easing: 'linear',
    step: function() {
        $('#dyn-visits').text(Math.ceil(this.numberValue));
    },
    done: function() {
        $('#dyn-visits').text(Math.ceil(this.numberValue));
    }
});


//Timer for tiles info

// builds
var incrementI = $('#views-x').text();

$({
    numberValue: incrementI
}).animate({
    numberValue: 37
}, {
    duration: 3000,
    easing: 'linear',
    step: function() {
        $('#views-x').text(Math.ceil(this.numberValue));
    },
    done: function() {
        $('#views-x').text(Math.ceil(this.numberValue));
    }
});

// successful builds
var incrementJ = $('#likes-x').text();

$({
    numberValue: incrementJ
}).animate({
    numberValue: 28
}, {
    duration: 1500,
    easing: 'linear',
    step: function() {
        $('#likes-x').text(Math.ceil(this.numberValue));
    },
    done: function() {
        $('#likes-x').text(Math.ceil(this.numberValue));
    }
});

// failed builds
var incrementK = $('#uploaded-x').text();

$({
    numberValue: incrementK
}).animate({
    numberValue: 9
}, {
    duration: 3000,
    easing: 'linear',
    step: function() {
        $('#uploaded-x').text(Math.ceil(this.numberValue));
    },
    done: function() {
        $('#uploaded-x').text(Math.ceil(this.numberValue));
    }
});

// uploaded-x
var incrementL = $('#users-x').text();

$({
    numberValue: incrementL
}).animate({
    numberValue: 9125
}, {
    duration: 2000,
    easing: 'linear',
    step: function() {
        $('#users-x').text(Math.ceil(this.numberValue));
    },
    done: function() {
        $('#users-x').text(Math.ceil(this.numberValue));
    }
});

//Data Tables
$(document).ready(function() {
    $('#data-table').dataTable({
        "sPaginationType": "full_numbers"
    });
    $("#data-table_length").css("display", "none")
});


// $(document).ready(function () {
//   var g1 = new JustGage({
//     id: "g1", 
//     value: getRandomInt(20, 95), 
//     min: 0,
//     max: 100,
//     title: "Green",
//     label: "",
//     levelColorsGradient: false
//   });

//   var g1a = new JustGage({
//     id: "g1a", 
//     value: getRandomInt(350, 980), 
//     min: 350,
//     max: 980,
//     title: "Lone Ranger",
//     label: "miles traveled"
//   });

//   var g2 = new JustGage({
//     id: "g2", 
//     value: getRandomInt(350, 980), 
//     min: 350,
//     max: 980,
//     title: "Lone Ranger",
//     label: "miles traveled"
//   });

//   var g2a = new JustGage({
//     id: "g2a", 
//     value: getRandomInt(350, 980), 
//     min: 350,
//     max: 980,
//     title: "Lone Ranger",
//     label: "miles traveled"
//   });

//   var g2b = new JustGage({
//     id: "g2b", 
//     value: getRandomInt(350, 980), 
//     min: 350,
//     max: 980,
//     title: "Lone Ranger",
//     label: "miles traveled"
//   });
// });


//