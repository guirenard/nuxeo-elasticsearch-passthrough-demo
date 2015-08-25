var API = (function(API) {

    var esClient;

    var nuxeoIndice = 'nuxeo-cm-demo';

    API.dateFormat = "yyyy-MM-dd";
    API.minDate = "2015-01-01";
    API.maxDate = new Date().toISOString().substring(0, 10);;

    function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
        var result = "<h4>"+n+"</h4><table>";
        if (d === undefined) {
            result += "<tr><td>No Claim</td><td></td></tr>";
        } else {
            for (var i=0; i<d.kind.buckets.length; i++) {
                var kind = d.kind.buckets[i];
                result += "<tr><td>" + kind.key + "</td><td>"+(kind.doc_count)+"</td></tr>"
            }
        }
        result += "</table>";
        return result;
    }

    var query15 = {
        index: nuxeoIndice,
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "ecm:primaryType": "InsuranceClaim" }},
                            { range: {"incl:incident_date": {"gte": API.minDate, "lte": API.maxDate}}} ]
                }
            },
            // Aggregate on the results
            aggs:{
                date: {
                    date_histogram : {
                        field : "incl:incident_date",
                        interval : "month",
                        min_doc_count: 0,
                        format : "yyyy-MM-dd",
                        extended_bounds : {
                            min : API.minDate,
                            max : API.maxDate
                        }
                    }
                }
            }
            // End query.
        }
    };

    var query16 = {
        index: nuxeoIndice,
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "ecm:primaryType": "InsuranceClaim" }} ]
                }
            },
            // Aggregate on the results
            aggs: {
                state : {
                    terms : { field : "incl:incident_us_state" },
                    aggs:{
                        kind: {
                            terms : { field : "incl:incident_kind" }
                        }
                    }
                }
            }
            // End query.
        }
    };

    API.loadSample15 = function() {
        esClient.search(query15).then(function(resp) {
            console.log(resp);

            var data = {
                labels: [],
                datasets: [{
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                }]
            };

            for (var i=0; i<resp.aggregations.date.buckets.length; i++) {
              var date = resp.aggregations.date.buckets[i];
              data.labels.push(date.key_as_string);
              data.datasets[0].data.push(date.doc_count);
            }
            console.log(data);
            var ctx = document.getElementById("kindPerTotal").getContext("2d");
            var myLineChart = new Chart(ctx).Line(data, {

                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines : true,

                //String - Colour of the grid lines
                scaleGridLineColor : "rgba(0,0,0,.05)",

                //Number - Width of the grid lines
                scaleGridLineWidth : 1,

                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,

                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,

                //Boolean - Whether the line is curved between points
                bezierCurve : true,

                //Number - Tension of the bezier curve between points
                bezierCurveTension : 0.4,

                //Boolean - Whether to show a dot for each point
                pointDot : true,

                //Number - Radius of each point dot in pixels
                pointDotRadius : 4,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth : 1,

                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius : 20,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke : true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth : 2,

                //Boolean - Whether to fill the dataset with a colour
                datasetFill : true,

                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

            });
        }, function (err) {
            console.trace(err.message);
        });
    };


    API.loadSample16 = function() {
        esClient.search(query16).then(function(resp) {
            console.log(resp);
            // Transform data
            var sampleData= {};
            for (var i=0; i<resp.aggregations.state.buckets.length; i++) {
              var state = resp.aggregations.state.buckets[i];
              state.color = d3.interpolate("#ffffcc", "#800026")(state.doc_count/resp.aggregations.state.buckets[0].doc_count);
              sampleData[state.key]=state;
            }

            uStates.draw("#statesvg", sampleData, tooltipHtml);

        }, function (err) {
            console.trace(err.message);
        });
    };


    API.config = function () {
        esClient = new $.es.Client({
            hosts: {
                protocol: window.location.protocol,
                host: window.location.hostname,
                port: window.location.port,
                path: '/nuxeo/site/es',
                headers: {
                    'Content-Type' : 'application/json'
                }
            }
        });
    };

    API.loadData =function() {
        API.loadSample15();
        API.loadSample16();
    };

    return API;
})({});

// //////////////////////////// INIT
$(document).ready(function () {
    API.config();
    API.loadData();
});
