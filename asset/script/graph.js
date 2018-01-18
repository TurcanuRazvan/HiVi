var hivi = hivi || {};
hivi.graph = (function (window, document) {
    var history = [];
    var visits = {};

    // function declarations
    function init(originalHistory) {
        // console.log(history);
        // console.log(history[1].url.split("/"));
        history = maphHistory(originalHistory);
        console.log(history);
        // loadVisits();
        // mapHistoryToGraph();
        var graphModel = mapHistoryToGraph();
        test(graphModel);
    };

    function maphHistory(historyList) {
        var allItems = [];
        historyList.forEach(function (historyItem) {
            var url = historyItem.url;
            var domainsSplits = url.split("/");

            if (domainsSplits[0] === "chrome-extension:" || domainsSplits[0] === "file:") {
                return;
            }

            var domain = domainsSplits[2];

            allItems.push({
                "domain": domain,
                "item": historyItem
            })

        });
        console.log(allItems);
        return allItems;
    };

    function loadVisits() {
        var backgroundWindow = chrome.extension.getBackgroundPage();
        // debugger;
        console.log(hivi.backgroundWindow);
        history.forEach(function (historyDomain) {
            historyDomain.items.forEach(function (historyItem) {

                backgroundWindow.returnVisits({
                    'url': historyItem.url
                }, visitsCallback.bind(null, historyDomain.domain, historyItem.url));

            });

        });
    };

    function visitsCallback(domain, url, visitItems) {
        // console.log(visitItems);
        test = visitItems;
        if (!visits[domain]) {
            visits[domain] = {};
        }
        visits[domain][url] = visitItems;


    };

    // setTimeout(function () { console.log(visits); }, 3000);

    function mapHistoryToGraph() {
        var graph = {
            "nodes": [],
            "links": []
        };

        var currentDomains = [];
        // var historyList=[];

        // for (let index = history.length - 1; index >= 0; index--) {
        //     const element = history[index];
        //     historyList.push(element);
        // }

        history.forEach(function (historyItem, index, historyArray) {
            if (currentDomains.indexOf(historyItem.domain) === -1) {
                currentDomains.push(historyItem.domain);
                graph.nodes.push({
                    "id": historyItem.domain,
                    "group": currentDomains.length
                });
            }

            if (index > 0 && historyArray[index - 1].domain !== historyItem.domain) {
                graph.links.push({
                    "source": historyArray[index - 1].domain,
                    "target": historyItem.domain,
                    "value": 1
                });
            }
        });
        console.log(graph);
        debugger;
        return graph;

    };

    function test(graph) {
        var svg = d3.select("#history-graph"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var nd;
        for (var i = 0; i < graph.nodes.length; i++) {
            nd = graph.nodes[i];
            nd.rx = nd.id.length * 4.5;
            nd.ry = 12;
        }

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }))
            .force("collide", d3.ellipseForce(6, 0.5, 5))
            .force("center", d3.forceCenter(width / 2, height / 2));

        var link = svg.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function (d) {
                //  return Math.sqrt(d.value);
                return 4;
            });

        var node = svg.append("g")
            .attr("class", "node")
            .selectAll("ellipse")
            .data(graph.nodes)
            .enter().append("ellipse")
            .attr("rx", function (d) { return d.rx; })
            .attr("ry", function (d) { return d.ry; })
            .attr("fill", function (d) { return color(d.group); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        var text = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("dy", 2)
            .attr("text-anchor", "middle")
            .text(function (d) { return d.id })
            .attr("fill", "white");


        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
            text
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });

        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    };    


    return {
        init: init
    };
})(window, document);
