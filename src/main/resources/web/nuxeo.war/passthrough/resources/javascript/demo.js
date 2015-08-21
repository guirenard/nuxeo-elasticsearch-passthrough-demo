var API = (function(API) {

    var esClient;

    API.dateFormat = "yyyy-MM-dd";
    API.minDate = "2015-08-16";
    API.maxDate = "2015-08-20"

    var query1 = {
        index: 'audit',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "category": "Routing" }},
                            { term: { "eventId": "afterWorkflowFinish"}},
                            { term: { "extended.modelName": "TravelExpenseValidation"}} ]
                }
            },
            // Aggregate on the results
            aggs: {
                duration_per_wf: {
                    terms : { field : "extended.variables.department" },
                    aggs: {
                        computed: {
                            avg: {
                                field: "extended.duration"
                            }
                        }
                    }
                }
            }
            // End query.
        }
    };

    var query2 = {
        index: 'audit',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "category": "Routing" }},
                            { term: { "eventId": "afterWorkflowFinish"}},
                            { term: { "extended.modelName": "TravelExpenseValidation"}} ]
                }
            },
            // Aggregate on the results
            aggs: {
                amount: {
                    range : {
                        field : "extended.variables.amount",
                        ranges : [
                            { key : "<= 1500", to : 1500 },
                            { key : "> 1500", from : 1500 }
                        ]
                    }
                }
            }
            // End query.
        }
    };

    var query3 = {
        index: 'audit',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "category": "Routing" }},
                            { term: { "eventId": "afterWorkflowTaskEnded"}},
                            { term: { "extended.modelName": "TravelExpenseValidation"}},
                            { term: { "extended.taskName": "wf.travelExpenses.create"}},
                            { term: { "docLifeCycle": "ended"}},
                            { range: {"eventDate": {"gte": API.minDate, "lte": API.maxDate}}} ]
                }
            },
            // Aggregate on the results
            aggs: {
                request_count: {
                    terms: {
                        field: "extended.user"
                    },
                    aggs: {
                        top_request: {
                            date_histogram : {
                                field : "eventDate",
                                interval : "day",
                                min_doc_count: 0,
                                format : API.dateFormat,
                                extended_bounds : {
                                    min : API.minDate,
                                    max : API.maxDate
                                }
                            }
                        }
                    }
                }
            }
            // End query.
        }
    };

    var query4 = query3;

    var query5 = {
        index: 'audit',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "category": "Routing" }},
                            { term: { "eventId": "afterWorkflowTaskEnded"}},
                            { term: { "extended.modelName": "TravelExpenseValidation"}},
                            { term: { "extended.taskName": "wf.travelExpenses.create"}},
                            { term: { "docLifeCycle": "ended"}},
                            { range: {"eventDate": {"gte": API.minDate, "lte": API.maxDate}}} ]
                }
            },
            // Aggregate on the results
            aggs: {
                request_count: {
                    terms: {
                        field: "extended.user"
                    },
                    aggs: {
                        top_request: {
                            date_histogram : {
                                field : "eventDate",
                                interval : "day",
                                min_doc_count: 0,
                                format : API.dateFormat,
                                extended_bounds : {
                                    min : API.minDate,
                                    max : API.maxDate
                                }
                            },
                            aggs: {
                                amount: {
                                    sum: {
                                        field : "extended.workflowVariables.amount"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // End query.
        }
    }

    var query6 = {
        index: 'audit',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "category": "Routing" }},
                            { term: { "eventId": "afterWorkflowTaskEnded"}},
                            { term: { "extended.modelName": "TravelExpenseValidation"}},
                            { term: { "extended.taskName": "Accept/ Reject"}} ]
                }
            },
            // Aggregate on the results
            aggs: {
                duration_per_requester: {
                    terms : { field : "extended.user" },
                    aggs: {
                        computed: {
                            avg: {
                                field: "extended.duration"
                            }
                        }
                    }
                }
            }
            // End query.
        }
    };

    var query7 = {
        index: 'audit',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "category": "Routing" }},
                            { term: { "eventId": "afterWorkflowTaskEnded"}},
                            { term: { "extended.modelName": "TravelExpenseValidation"}},
                            { term: { "extended.taskName": "Accept/ Reject"}} ]
                }
            },
            // Aggregate on the results
            aggs: {
                action: {
                    terms : { field : "extended.action" }
                }
            }
            // End query.
        }
    };

    var query8 = {
        index: 'audit',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "category": "Routing" }},
                            { term: { "eventId": "afterWorkflowTaskEnded"}},
                            { term: { "extended.modelName": "TravelExpenseValidation"}},
                            { term: { "extended.taskName": "Accept/ Reject"}} ]
                }
            },
            // Aggregate on the results
            aggs: {
                action: {
                    terms : { field : "extended.action" },
                    aggs: {
                        department: {
                            terms: {
                                field: "extended.workflowVariables.department",
                                min_doc_count: 0
                            }
                        }
                    }
                }
            }
            // End query.
        }
    };

    var query9 = {
        index: 'audit',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "category": "Routing" }},
                            { term: { "eventId": "afterWorkflowTaskEnded"}},
                            { term: { "extended.modelName": "TravelExpenseValidation"}},
                            { term: { "extended.taskName": "Accept/ Reject"}},
                            { range: {"eventDate": {"gte": API.minDate, "lte": API.maxDate}}} ]
                }
            },
            // Aggregate on the results
            aggs: {
                department: {
                    terms : { field : "extended.workflowVariables.department" },
                    aggs: {
                        expenses: {
                            date_histogram : {
                                field : "eventDate",
                                interval : "day",
                                min_doc_count: 0,
                                format : API.dateFormat,
                                extended_bounds : {
                                    min : API.minDate,
                                    max : API.maxDate
                                }
                            },
                            aggs: {
                                total: {
                                    sum : {
                                        field: "extended.workflowVariables.amount"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // End query.
        }
    };

    var query10 = {
        index: 'nuxeo',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "ecm:primaryType": "DocumentRoute" }},
                            { term: { "ecm:title": "wf.travelExpenseValidation"}},
                            { term: { "ecm:currentLifeCycleState": "running"}} ]
                }
            }
        }
    };

    var query11 = {
        index: 'nuxeo',
        size: 0,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "ecm:primaryType": "DocumentRoute" }},
                            { term: { "ecm:title": "wf.travelExpenseValidation"}},
                            { term: { "ecm:currentLifeCycleState": "running"}} ]
                }
            },
            // Aggregate on the results
            aggs: {
                department: {
                    terms : { field : "var_TravelExpenseValidation:department" }
                }
            }
            // End query.
        }
    };

    var query12 = {
        index: 'nuxeo',
        size: 100,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "ecm:primaryType": "RoutingTask" }},
                            { term: { "ecm:currentLifeCycleState": "opened"}} ]
                }
            },
            filter : {
                or : [
                    {
                        term : { "nt:name" : "Accept/ Reject" }
                    },
                    {
                        term : { "nt:name" : "Accountancy" }
                    }
                ]
            },
            // Aggregate on the results
            aggs: {
                user: {
                    terms : { field: "dc:creator" },
                    aggs : {
                        task: {
                            terms: { field : "nt:name", min_doc_count : 0}
                        }
                    }
                }
            }
            // End query.
        }
    };

    var query13 = {
        index: 'nuxeo',
        size: 5,
        body: {
            sort : [
                { "dc:created" : {"order" : "asc"}}
            ],
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "ecm:primaryType": "DocumentRoute" }},
                            { term: { "ecm:title": "wf.travelExpenseValidation"}},
                            { term: { "ecm:currentLifeCycleState": "running"}} ]
                }
            }
            // End query.
        }
    };

    var query14 = {
        index: 'nuxeo',
        size: 1000,
        body: {
            sort : [
                { "dc:created" : {"order" : "asc"}}
            ],
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: [ { term: { "ecm:primaryType": "RoutingTask" }},
                            { term: { "ecm:currentLifeCycleState": "opened"}} ]
                }
            },
            filter : {
                or : [
                    {
                        term : { "nt:name" : "Accept/ Reject" }
                    },
                    {
                        term : { "nt:name" : "Accountancy" }
                    }
                ]
            }
            // End query.
        }
    };

    function formatDuration(duration) {
        seconds = Math.floor(duration/1000);
        minutes = Math.floor(seconds/60);
        hours = Math.floor(minutes/60);
        days = Math.floor(hours/24);
        hours = hours-(days*24);
        minutes = minutes-(days*24*60)-(hours*60);
        seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
        result = "";
        if (days > 0) {
            result += days + " Days ";
        }
        if (hours > 0) {
            result += hours + " h ";
        }
        if (minutes > 0) {
            result += minutes + " m ";
        }
        if (seconds > 0) {
            result += seconds + " s ";
        }
       return result;
    }

    function buildBarChart(data, eltSelector) {
        var chartWidth       = 300,
                barHeight        = 20,
                groupHeight      = barHeight * data.series.length,
                gapBetweenGroups = 10,
                spaceForLabels   = 150,
                spaceForLegend   = 150;

            // Zip the series data together (first values, second values, etc.)
            var zippedData = [];
            for (var i=0; i<data.labels.length; i++) {
              for (var j=0; j<data.series.length; j++) {
                zippedData.push(data.series[j].values[i]);
              }
            }

            // Color scale
            var color = d3.scale.category20();
            var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

            var x = d3.scale.linear()
                .domain([0, d3.max(zippedData)])
                .range([0, chartWidth]);

            var y = d3.scale.linear()
                .range([chartHeight + gapBetweenGroups, 0]);

            var yAxis = d3.svg.axis()
                .scale(y)
                .tickFormat('')
                .tickSize(0)
                .orient("left");

            // Specify the chart area and dimensions
            var chart = d3.select(eltSelector).append("svg")
                .attr("class", "barChart1")
                .attr("width", spaceForLabels + chartWidth + spaceForLegend)
                .attr("height", chartHeight);

            // Create bars
            var bar = chart.selectAll("g")
                .data(zippedData)
                .enter().append("g")
                .attr("transform", function(d, i) {
                  return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
                });

            // Create rectangles of the correct width
            bar.append("rect")
                .attr("fill", function(d,i) { return color(i % data.series.length); })
                .attr("class", "bar")
                .attr("width", x)
                .attr("height", barHeight - 1);

            // Add text label in bar
            bar.append("text")
                .attr("x", function(d) { return x(d) - 3; })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function(d) { return d; });

            // Draw labels
            bar.append("text")
                .attr("class", "label")
                .attr("x", function(d) { return - 10; })
                .attr("y", groupHeight / 2)
                .attr("dy", ".35em")
                .text(function(d,i) {
                  if (i % data.series.length === 0)
                    return data.labels[Math.floor(i/data.series.length)];
                  else
                    return ""});

            chart.append("g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
                  .call(yAxis);

            // Draw legend
            var legendRectSize = 18,
                legendSpacing  = 4;

            var legend = chart.selectAll('.legend')
                .data(data.series)
                .enter()
                .append('g')
                .attr('transform', function (d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset = -gapBetweenGroups/2;
                    var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
                    var vert = i * height - offset;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', function (d, i) { return color(i); })
                .style('stroke', function (d, i) { return color(i); });

            legend.append('text')
                .attr('class', 'legend')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .text(function (d) { return d.label; });
    }

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

    API.loadSample1 = function() {
        // Display Workflow duration per Department within a Cross table
        esClient.search(query1).then(function(resp) {
            // console.log(resp);
            $.Mustache.load('./resources/templates/sample1_agg_table.html').done(function(){
                var buckets = resp.aggregations.duration_per_wf.buckets;
                for (i = 0; i < buckets.length; i++) {
                    buckets[i].computed.label = formatDuration(buckets[i].computed.value);
                }
                var rendered = $.Mustache.render('aggTableTemplate',{buckets: buckets});
                $('#wfDuration').html(rendered);
            });
        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample2 = function() {
        // Range amount paid
        esClient.search(query2).then(function(resp) {
            //console.log(resp);

            var amount = resp.aggregations.amount.buckets;
            // d3 donut chart
            var width = 400,
                height = 300,
                radius = Math.min(width, height) / 2;
            var color = ['#2ca02c', '#1f77b4'];
            var arc = d3.svg.arc()
                .outerRadius(radius - 60)
                .innerRadius(0);
            var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) { return d.doc_count; });
            var svg = d3.select("#expenseAmount").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width/1.4 + "," + height/2 + ")");
            var g = svg.selectAll(".arc")
                .data(pie(amount))
                .enter()
                .append("g")
                .attr("class", "arc");
            g.append("path")
                .attr("d", arc)
                .style("fill", function (d, i) { return color[i]; });
            g.append("text")
                .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .style("fill", "white")
                .text(function (d) { return d.data.key; });
        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample3 = function() {
        // Display Workflow duration per Department within a Cross table
        esClient.search(query3).then(function(resp) {
            //console.log(resp);

            var series = [];
            var data = [];

            for (var i=0; i<resp.aggregations.request_count.buckets.length; i++) {
                var bucket = resp.aggregations.request_count.buckets[i];
                series.push({
                    label : bucket.key,
                    fill : false
                });
                var serieData = [];
                for (var j=0; j<bucket.top_request.buckets.length; j++) {
                    var subBucket = bucket.top_request.buckets[j];
                    serieData.push([subBucket.key_as_string, subBucket.doc_count]);
                }
                data.push(serieData);
            }

            $.jqplot._noToImageButton = true;

            var plot1 = $.jqplot("nbRequest", data, {
                title: 'Number of requests',
                highlighter: {
                    show: true,
                    sizeAdjust: 1,
                    tooltipOffset: 9
                },
                grid: {
                    background: 'rgba(57,57,57,0.0)',
                    drawBorder: false,
                    shadow: false,
                    gridLineColor: '#666666',
                    gridLineWidth: 2
                },
                legend: {
                    show: true,
                    placement: 'outsideGrid'
                },
                seriesDefaults: {
                    rendererOptions: {
                        smooth: true,
                        animation: {
                            show: true
                        }
                    },
                    showMarker: true
                },
                series: series,
                axesDefaults: {
                    rendererOptions: {
                        baselineWidth: 1.5,
                        baselineColor: '#444444',
                        drawBaseline: false
                    }
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.DateAxisRenderer,
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            angle: -30,
                            textColor: '#dddddd'
                        },
                        min: API.minDate,
                        max: API.maxDate,
                        tickInterval: "1 days",
                        drawMajorGridlines: false
                    },
                    yaxis: {
                        renderer: $.jqplot.LinearAxisRenderer,
                        pad: 0,
                        rendererOptions: {
                            minorTicks: 1
                        },
                        tickOptions: {
                            showMark: true
                        }
                    }
                }
            });

            $('.jqplot-highlighter-tooltip').addClass('ui-corner-all')

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample4 = function() {
        // Top Requester (no of request)
        esClient.search(query4).then(function(resp) {
            var data = {
              labels: [],
              series: []
            };

            for (var i=0; i<resp.aggregations.request_count.buckets.length; i++) {
              var userBucket = resp.aggregations.request_count.buckets[i];
              var count = [];
              for (var j=0; j < userBucket.top_request.buckets.length; j++) {
                var dateBucket = userBucket.top_request.buckets[j];
                if (i == 0) {
                    data.labels.push(dateBucket.key_as_string);
                }
                count.push(dateBucket.doc_count);
              }
              var serie = { label: userBucket.key, values: count};
              data.series.push(serie);
            }

            buildBarChart(data, "#wfTopRequestNb");

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample5 = function() {
        // Top Requester (total amount)
        esClient.search(query5).then(function(resp) {
            //console.log(resp);
            var data = {
              labels: [],
              series: []
            };

            for (var i=0; i<resp.aggregations.request_count.buckets.length; i++) {
              var userBucket = resp.aggregations.request_count.buckets[i];
              var count = [];
              for (var j=0; j < userBucket.top_request.buckets.length; j++) {
                var dateBucket = userBucket.top_request.buckets[j];
                if (i == 0) {
                    data.labels.push(dateBucket.key_as_string);
                }
                count.push(dateBucket.amount.value);
              }
              var serie = { label: userBucket.key, values: count};
              data.series.push(serie);
            }

            buildBarChart(data, "#wfTopRequestAmount");

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample6 = function() {
        // Display validation duration per Assignee within a Cross table
        esClient.search(query6).then(function(resp) {
            //console.log(resp);
            $.Mustache.load('./resources/templates/sample6_agg_table.html').done(function(){
                var buckets = resp.aggregations.duration_per_requester.buckets;
                for (i = 0; i < buckets.length; i++) {
                    buckets[i].computed.label = formatDuration(buckets[i].computed.value);
                }
                var rendered = $.Mustache.render('aggTableTemplate',{buckets: buckets});
                $('#validationTime').html(rendered);
            });
        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample7 = function() {
        // Average Result
        esClient.search(query7).then(function(resp) {
            //console.log(resp);

            var data = [];

            $.each(resp.aggregations.action.buckets, function( i, item ) {
                data.push(new Array(item.key, item.doc_count));
            });

            var plot1 = jQuery.jqplot ('averageResult', [data],
                {
                  seriesDefaults: {
                    renderer: jQuery.jqplot.PieRenderer,
                    rendererOptions: {
                      // Turn off filling of slices.
                      fill: true,
                      showDataLabels: true,
                      dataLabels: 'value',
                      // Add a margin to seperate the slices.
                      sliceMargin: 4,
                      // stroke the slices with a little thicker line.
                      lineWidth: 5
                    }
                  },
                  legend: { show:true, location: 'e' },
                  animate: true
                }
            );

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample8 = function() {
        // Result depending on department
        esClient.search(query8).then(function(resp) {
            //console.log(resp);

            var series = [];
            var data = [];

            for (var i=0; i<resp.aggregations.action.buckets.length; i++) {
                var bucket = resp.aggregations.action.buckets[i];
                series.push({
                    label : bucket.key,
                    fill : true
                });
                var serieData = [];
                for (var j=0; j<bucket.department.buckets.length; j++) {
                    var subBucket = bucket.department.buckets[j];
                    serieData.push([subBucket.key, subBucket.doc_count]);
                }
                data.push(serieData);
            }

            var plot1 = $.jqplot('resultDepOnDest', data, {
                // The "seriesDefaults" option is an options object that will
                // be applied to all series in the chart.
                seriesDefaults:{
                    renderer:$.jqplot.BarRenderer,
                    rendererOptions: {fillToZero: true}
                },
                // Custom labels for the series are specified with the "label"
                // option on the series option.  Here a series option object
                // is specified for each series.
                series: series,
                // Show the legend and put it outside the grid, but inside the
                // plot container, shrinking the grid to accomodate the legend.
                // A value of "outside" would not shrink the grid and allow
                // the legend to overflow the container.
                legend: {
                    show: true,
                    placement: 'outsideGrid'
                },
                axes: {
                    // Use a category axis on the x axis and use our custom ticks.
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                    },
                    // Pad the y axis just a little so bars can get close to, but
                    // not touch, the grid boundaries.  1.2 is the default padding.
                    yaxis: {
                        min: 0,
                        pad: 1.05,
                        tickOptions: {formatString: '%s'}
                    }
                }
            });

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample9 = function() {
        // Sum expenses / department
        esClient.search(query9).then(function(resp) {
            //console.log(resp);

            var series = [];
            var data = [];

            for (var i=0; i<resp.aggregations.department.buckets.length; i++) {
                var department = resp.aggregations.department.buckets[i];
                series.push({
                    label : department.key,
                    fill : true
                });
                var serieData = [];
                for (var j=0; j<department.expenses.buckets.length; j++) {
                    var expenses = department.expenses.buckets[j];
                    serieData.push([expenses.key_as_string, expenses.total.value]);
                }
                data.push(serieData);
            }

            var plot1 = $.jqplot('sumExpenses', data, {
                // The "seriesDefaults" option is an options object that will
                // be applied to all series in the chart.
                seriesDefaults:{
                    renderer:$.jqplot.BarRenderer,
                    rendererOptions: {fillToZero: true}
                },
                // Custom labels for the series are specified with the "label"
                // option on the series option.  Here a series option object
                // is specified for each series.
                series: series,
                // Show the legend and put it outside the grid, but inside the
                // plot container, shrinking the grid to accomodate the legend.
                // A value of "outside" would not shrink the grid and allow
                // the legend to overflow the container.
                legend: {
                    show: true,
                    placement: 'outsideGrid'
                },
                axes: {
                    // Use a category axis on the x axis and use our custom ticks.
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                    },
                    // Pad the y axis just a little so bars can get close to, but
                    // not touch, the grid boundaries.  1.2 is the default padding.
                    yaxis: {
                        min: 0,
                        pad: 1.05,
                        tickOptions: {formatString: '%s'}
                    }
                }
            });

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample10 = function() {
        // Sum expenses / department
        esClient.search(query10).then(function(resp) {
            //console.log(resp);
            jQuery("#totalInstance").text(resp.hits.total);

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample11 = function() {
        // Sum expenses / department
        esClient.search(query11).then(function(resp) {
            //console.log(resp);
            $.Mustache.load('./resources/templates/sample11_agg_table.html').done(function(){
                var rendered = $.Mustache.render('aggTableTemplate',{buckets: resp.aggregations.department.buckets});
                $('#wfRunningInstancePerDep').html(rendered);
            });

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample12 = function() {
        // Sum expenses / department
        esClient.search(query12).then(function(resp) {
            //console.log(resp);

            var series = [];
            var data = [];

            for (var i=0; i<resp.aggregations.user.buckets.length; i++) {
                var user = resp.aggregations.user.buckets[i];
                series.push({
                    label : user.key,
                    fill : true
                });
                var serieData = [];
                for (var j=0; j<user.task.buckets.length; j++) {
                    var task = user.task.buckets[j];
                    serieData.push([task.key, task.doc_count]);
                }
                data.push(serieData);
            }

            var plot1 = $.jqplot('wfRunningInstancePerActiveNode', data, {
                // The "seriesDefaults" option is an options object that will
                // be applied to all series in the chart.
                seriesDefaults:{
                    renderer:$.jqplot.BarRenderer,
                    rendererOptions: {fillToZero: true}
                },
                // Custom labels for the series are specified with the "label"
                // option on the series option.  Here a series option object
                // is specified for each series.
                series: series,
                // Show the legend and put it outside the grid, but inside the
                // plot container, shrinking the grid to accomodate the legend.
                // A value of "outside" would not shrink the grid and allow
                // the legend to overflow the container.
                legend: {
                    show: true,
                    placement: 'outsideGrid'
                },
                axes: {
                    // Use a category axis on the x axis and use our custom ticks.
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                    },
                    // Pad the y axis just a little so bars can get close to, but
                    // not touch, the grid boundaries.  1.2 is the default padding.
                    yaxis: {
                        min: 0,
                        pad: 1.05,
                        tickOptions: {formatString: '%s'}
                    }
                }
            });

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample13 = function() {
        // Sum expenses / department
        esClient.search(query13).then(function(resp) {
            console.log(resp);
            $.Mustache.load('./resources/templates/sample13_agg_table.html').done(function(){
                var docs = resp.hits.hits;
                for (i = 0; i < docs.length; i++) {
                    var created  = docs[i]._source["dc:created"];
                    var duration =  new Date() - new Date(created);
                    docs[i]._source.duration = formatDuration(duration);
                    docs[i]._source.initiator = docs[i]._source["docri:initiator"];
                }
                var rendered = $.Mustache.render('aggTableTemplate',{docs: docs});
                $('#topNLongerRequest').html(rendered);
            });

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadSample14 = function() {
        // Sum expenses / department
        esClient.search(query14).then(function(resp) {
            console.log(resp);
            $.Mustache.load('./resources/templates/sample14_agg_table.html').done(function(){
                var docs = resp.hits.hits;
                for (i = 0; i < docs.length; i++) {
                    var created  = docs[i]._source["dc:created"];
                    var duration =  new Date() - new Date(created);
                    docs[i]._source.duration = formatDuration(duration);
                    docs[i]._source.initiator = docs[i]._source["nt:initiator"];
                }
                var rendered = $.Mustache.render('aggTableTemplate',{docs: docs});
                $('#allOpenRequest').html(rendered);
            });

        }, function (err) {
            console.trace(err.message);
        });
    }

    API.loadData =function() {
        API.loadSample1();
        API.loadSample2();
        API.loadSample3();
        API.loadSample4();
        API.loadSample5();
        API.loadSample6();
        API.loadSample7();
        API.loadSample8();
        API.loadSample9();
        API.loadSample10();
        API.loadSample11();
        API.loadSample12();
        API.loadSample13();
        API.loadSample14();
    };

    return API;
})({});

////////////////////////////// INIT
$(document).ready(function () {
    API.config();
    $('.menu .item').tab({alwaysRefresh : true});
});
