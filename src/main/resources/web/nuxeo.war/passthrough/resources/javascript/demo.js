var API = (function(API) {

	var esClient;

	API.lastModifiedLabels = [
		"Last 24H",
		"Last week",
		"Last month",
		"Last 6 months",
		"More than 6 months"];

	API.sizeLabels = [
		"Less than 100KB",
		"Between 100KB and 1MB",
		"Between 1MB and 10MB",
		"Between 10MB and 100MB",
		"More than 100MB"];

	API.config = function () {
		esClient = new $.es.Client({
			hosts: {
				protocol: window.location.protocol,
				host: window.location.hostname,
				port: window.location.port,
				path: '/nuxeo/site/es',
				headers: {
					'Content-Type' : 'application/json',
					'Authorization': 'Basic ' + btoa('Administrator:Administrator')
				}
			}
		});
	};

	API.search = function(keywords) {
		esClient.search({
		  index: 'nuxeo',
		  body: {
			 fields: ["_id","_source"],
			 query : {
				match : {
					_all : {
						query : keywords,
						analyzer : "fulltext",
						operator : "and",
						fuzziness : "AUTO"
					}
				}
			},
			aggs : {
				type : {terms : { field : "ecm:primaryType" }},
				mime : {terms : { field : "file:content.mime-type" }},
				size : {
					range : {
						field : "file:content.length",
						ranges : [
							{ to : 100000 },
							{ from : 100000, to : 1000000 },
							{ from : 1000000, to : 10000000 },
							{ from : 10000000, to : 100000000 },
							{ from : 10000000 }
						]
					}},
				modified : {
					date_range: {
						field: "dc:modified",
						format: "dd-MM-yyyy",
						ranges: [
							{ from: "now-24H", to : "now" },
							{ from: "now-7d", to : "now-24H" },
							{ from: "now-1M", to : "now-7d" },
							{ from: "now-6M", to : "now-1M" },
							{ to : "now-6M" }
						]}}
			},
			highlight : {
				pre_tags : ["<span style=background-color:lightgray>"],
				post_tags : ["</span>"],
				fields : {
					'dc:title.fulltext' :  {index_options : "offsets"},
					'ecm:binarytext' :  {
						fragment_size : 250,
						number_of_fragments : 1,
						index_options : "offsets"
					}
				}
			}
		}}).then(callbackSearch, function (err) {
			console.trace(err.message);
		});
	};

	////////////////////////////// CALLBACK FUNCTIONS

	function callbackSearch(resp) {

		processRangeAggregates(resp);

		$.Mustache.load('./resources/templates/result_list.html').done(function(){
		 var rendered = $.Mustache.render('resultsTemplate',{hits: resp.hits.hits});
		 $('#searchResults').html(rendered);
		});

		$.Mustache.load('./resources/templates/aggregates.html').done(function(){
		 var rendered = $.Mustache.render('aggregatesTemplate',{aggregations: resp.aggregations});
		 $('#aggregates').html(rendered);
		});

	};

	////////////////////////////// UTILS

	function processRangeAggregates(resp) {
		var buckets = resp.aggregations.modified.buckets;
		for (i = 0; i < buckets.length; i++) {
			processRangeKey(buckets[i]);
			buckets[i].label = API.lastModifiedLabels[buckets.length-1-i];
		}

		buckets = resp.aggregations.size.buckets;
		for (i = 0; i < buckets.length; i++) {
			processRangeKey(buckets[i]);
			buckets[i].label = API.sizeLabels[i];
		}
	};

	function processRangeKey(bucket) {
		if (typeof bucket.key === 'undefined') {
			bucket.key = "from-"+bucket.from+"to-"+bucket.to;
		}
	};

	return API;
})({});

////////////////////////////// INIT
$(document).ready(function () {
	API.config();
    $("#searchIcon").click(function () {
       API.search($("#keywords").val());
	});
});

